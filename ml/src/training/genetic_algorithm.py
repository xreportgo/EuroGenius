import numpy as np
import random
import os
import sys
import pandas as pd
from deap import base, creator, tools, algorithms
import matplotlib.pyplot as plt
import pickle

# Ajout du répertoire parent au path pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import ROOT_DIR, DATA_DIR, MODELS_DIR, logger

class GeneticAlgorithm:
    """
    Algorithme génétique pour générer des combinaisons EuroMillions rares mais plausibles
    """
    
    def __init__(self, population_size=100, generations=50, crossover_prob=0.7, mutation_prob=0.2):
        """
        Initialisation de l'algorithme génétique
        
        Args:
            population_size (int): Taille de la population
            generations (int): Nombre de générations
            crossover_prob (float): Probabilité de croisement
            mutation_prob (float): Probabilité de mutation
        """
        self.population_size = population_size
        self.generations = generations
        self.crossover_prob = crossover_prob
        self.mutation_prob = mutation_prob
        
        # Paramètres spécifiques à EuroMillions
        self.num_numbers = 50  # Numéros de 1 à 50
        self.num_stars = 12    # Étoiles de 1 à 12
        self.numbers_to_draw = 5  # 5 numéros par tirage
        self.stars_to_draw = 2    # 2 étoiles par tirage
        
        # Statistiques historiques (à initialiser avec les données réelles)
        self.number_frequencies = None
        self.star_frequencies = None
        self.pair_frequencies = None
        self.historical_draws = None
        
        # Configuration de l'algorithme génétique avec DEAP
        self._setup_genetic_algorithm()
        
        logger.info(f"Algorithme génétique initialisé avec population_size={population_size}, generations={generations}")
    
    def _setup_genetic_algorithm(self):
        """
        Configuration de l'algorithme génétique avec DEAP
        """
        # Création des types pour l'algorithme génétique
        creator.create("FitnessMax", base.Fitness, weights=(1.0,))
        creator.create("Individual", list, fitness=creator.FitnessMax)
        
        # Initialisation de la toolbox
        self.toolbox = base.Toolbox()
        
        # Enregistrement des fonctions pour la création d'individus
        self.toolbox.register("number", random.randint, 1, self.num_numbers)
        self.toolbox.register("star", random.randint, 1, self.num_stars)
        
        # Fonction pour créer un individu valide (combinaison EuroMillions)
        def create_valid_individual():
            # Génération de 5 numéros uniques entre 1 et 50
            numbers = sorted(random.sample(range(1, self.num_numbers + 1), self.numbers_to_draw))
            # Génération de 2 étoiles uniques entre 1 et 12
            stars = sorted(random.sample(range(1, self.num_stars + 1), self.stars_to_draw))
            # Combinaison complète
            return numbers + stars
        
        # Enregistrement des fonctions pour la création de la population
        self.toolbox.register("individual", tools.initIterate, creator.Individual, create_valid_individual)
        self.toolbox.register("population", tools.initRepeat, list, self.toolbox.individual)
        
        # Enregistrement des opérateurs génétiques
        self.toolbox.register("evaluate", self._evaluate_combination)
        self.toolbox.register("mate", self._custom_crossover)
        self.toolbox.register("mutate", self._custom_mutation)
        self.toolbox.register("select", tools.selTournament, tournsize=3)
        
        logger.info("Configuration de l'algorithme génétique terminée")
    
    def _evaluate_combination(self, individual):
        """
        Fonction d'évaluation (fitness) pour une combinaison
        
        Args:
            individual (list): Combinaison à évaluer [n1, n2, n3, n4, n5, s1, s2]
            
        Returns:
            tuple: Score de fitness (un seul élément car weights=(1.0,))
        """
        # Séparation des numéros et des étoiles
        numbers = individual[:self.numbers_to_draw]
        stars = individual[self.numbers_to_draw:]
        
        # Initialisation du score
        score = 0.0
        
        # 1. Rareté relative des numéros et étoiles
        if self.number_frequencies is not None:
            # Calcul de la rareté basée sur les fréquences inversées
            number_rarity = sum(1.0 - self.number_frequencies.get(n, 0.5) for n in numbers) / self.numbers_to_draw
            star_rarity = sum(1.0 - self.star_frequencies.get(s, 0.5) for s in stars) / self.stars_to_draw
            
            # Contribution au score (30%)
            score += 0.3 * (number_rarity + star_rarity) / 2
        else:
            # Si pas de données de fréquence, score aléatoire
            score += 0.3 * random.random()
        
        # 2. Équilibre de la distribution
        # Vérification de l'équilibre entre numéros bas (1-25) et hauts (26-50)
        low_numbers = sum(1 for n in numbers if n <= 25)
        high_numbers = self.numbers_to_draw - low_numbers
        
        # Score maximal pour une distribution équilibrée (idéalement 2-3 ou 3-2)
        balance_score = 1.0 - abs((low_numbers / self.numbers_to_draw) - 0.5) * 2
        
        # Contribution au score (20%)
        score += 0.2 * balance_score
        
        # 3. Originalité par rapport aux tirages historiques
        if self.historical_draws is not None:
            # Calcul de la similarité avec les tirages historiques
            similarities = []
            for draw in self.historical_draws:
                # Nombre de numéros communs
                common_numbers = len(set(numbers).intersection(set(draw[:self.numbers_to_draw])))
                # Nombre d'étoiles communes
                common_stars = len(set(stars).intersection(set(draw[self.numbers_to_draw:])))
                
                # Similarité normalisée (0 = totalement différent, 1 = identique)
                similarity = (common_numbers / self.numbers_to_draw + common_stars / self.stars_to_draw) / 2
                similarities.append(similarity)
            
            # Originalité = 1 - similarité moyenne
            originality = 1.0 - sum(similarities) / len(similarities) if similarities else 0.5
            
            # Contribution au score (30%)
            score += 0.3 * originality
        else:
            # Si pas de données historiques, score aléatoire
            score += 0.3 * random.random()
        
        # 4. Plausibilité des paires
        if self.pair_frequencies is not None:
            # Calcul du score de plausibilité des paires
            pair_scores = []
            for i in range(len(numbers)):
                for j in range(i + 1, len(numbers)):
                    pair = tuple(sorted([numbers[i], numbers[j]]))
                    # Fréquence normalisée de la paire
                    pair_score = self.pair_frequencies.get(pair, 0.1)
                    pair_scores.append(pair_score)
            
            # Score moyen des paires
            avg_pair_score = sum(pair_scores) / len(pair_scores) if pair_scores else 0.1
            
            # Contribution au score (20%)
            score += 0.2 * avg_pair_score
        else:
            # Si pas de données de paires, score aléatoire
            score += 0.2 * random.random()
        
        return (score,)
    
    def _custom_crossover(self, ind1, ind2):
        """
        Opérateur de croisement personnalisé pour les combinaisons EuroMillions
        
        Args:
            ind1 (list): Premier parent
            ind2 (list): Deuxième parent
            
        Returns:
            tuple: Deux enfants (offspring)
        """
        # Copie des parents
        child1, child2 = list(ind1), list(ind2)
        
        # Croisement des numéros (indices 0-4)
        if random.random() < self.crossover_prob:
            # Point de croisement pour les numéros
            cxpoint = random.randint(1, self.numbers_to_draw - 1)
            
            # Échange des segments
            child1[:cxpoint], child2[:cxpoint] = child2[:cxpoint], child1[:cxpoint]
            
            # Correction pour éviter les doublons dans les numéros
            self._fix_duplicates(child1, 0, self.numbers_to_draw)
            self._fix_duplicates(child2, 0, self.numbers_to_draw)
        
        # Croisement des étoiles (indices 5-6)
        if random.random() < self.crossover_prob:
            # Échange des étoiles avec une certaine probabilité
            if random.random() < 0.5:
                child1[self.numbers_to_draw], child2[self.numbers_to_draw] = child2[self.numbers_to_draw], child1[self.numbers_to_draw]
            if random.random() < 0.5:
                child1[self.numbers_to_draw + 1], child2[self.numbers_to_draw + 1] = child2[self.numbers_to_draw + 1], child1[self.numbers_to_draw + 1]
            
            # Correction pour éviter les doublons dans les étoiles
            self._fix_duplicates(child1, self.numbers_to_draw, len(child1))
            self._fix_duplicates(child2, self.numbers_to_draw, len(child2))
        
        # Tri des numéros et des étoiles
        child1[:self.numbers_to_draw] = sorted(child1[:self.numbers_to_draw])
        child1[self.numbers_to_draw:] = sorted(child1[self.numbers_to_draw:])
        child2[:self.numbers_to_draw] = sorted(child2[:self.numbers_to_draw])
        child2[self.numbers_to_draw:] = sorted(child2[self.numbers_to_draw:])
        
        return child1, child2
    
    def _fix_duplicates(self, individual, start, end):
        """
        Corrige les doublons dans une section d'un individu
        
        Args:
            individual (list): Individu à corriger
            start (int): Indice de début de la section
            end (int): Indice de fin de la section
        """
        section = individual[start:end]
        
        # Vérification des doublons
        while len(set(section)) < len(section):
            # Identification des doublons
            seen = set()
            duplicates = []
            
            for i, val in enumerate(section):
                if val in seen:
                    duplicates.append(i)
                else:
                    seen.add(val)
            
            # Remplacement des doublons
            for idx in duplicates:
                if start == 0:  # Numéros
                    # Génération d'un nouveau numéro unique
                    new_val = random.randint(1, self.num_numbers)
                    while new_val in section:
                        new_val = random.randint(1, self.num_numbers)
                else:  # Étoiles
                    # Génération d'une nouvelle étoile unique
                    new_val = random.randint(1, self.num_stars)
                    while new_val in section:
                        new_val = random.randint(1, self.num_stars)
                
                section[idx] = new_val
        
        # Mise à jour de l'individu
        individual[start:end] = section
    
    def _custom_mutation(self, individual):
        """
        Opérateur de mutation personnalisé pour les combinaisons EuroMillions
        
        Args:
            individual (list): Individu à muter
            
        Returns:
            tuple: Individu muté (un seul élément)
        """
        # Mutation des numéros
        for i in range(self.numbers_to_draw):
            if random.random() < self.mutation_prob:
                # Génération d'un nouveau numéro
                new_number = random.randint(1, self.num_numbers)
                # Vérification qu'il n'est pas déjà présent
                while new_number in individual[:self.numbers_to_draw]:
                    new_number = random.randint(1, self.num_numbers)
                # Remplacement
                individual[i] = new_number
        
        # Mutation des étoiles
        for i in range(self.numbers_to_draw, self.numbers_to_draw + self.stars_to_draw):
            if random.random() < self.mutation_prob:
                # Génération d'une nouvelle étoile
                new_star = random.randint(1, self.num_stars)
                # Vérification qu'elle n'est pas déjà présente
                while new_star in individual[self.numbers_to_draw:self.numbers_to_draw + self.stars_to_draw]:
                    new_star = random.randint(1, self.num_stars)
                # Remplacement
                individual[i] = new_star
        
        # Tri des numéros et des étoiles
        individual[:self.numbers_to_draw] = sorted(individual[:self.numbers_to_draw])
        individual[self.numbers_to_draw:] = sorted(individual[self.numbers_to_draw:])
        
        return (individual,)
    
    def load_historical_data(self, data):
        """
        Chargement des données historiques pour l'évaluation
        
        Args:
            data (DataFrame): DataFrame contenant les tirages historiques
        """
        # Extraction des tirages
        numbers_cols = [f'numero{i}' for i in range(1, self.numbers_to_draw + 1)]
        stars_cols = [f'etoile{i}' for i in range(1, self.stars_to_draw + 1)]
        
        # Conversion en liste de listes
        self.historical_draws = data[numbers_cols + stars_cols].values.tolist()
        
        # Calcul des fréquences des numéros
        number_counts = {}
        for draw in self.historical_draws:
            for num in draw[:self.numbers_to_draw]:
                number_counts[num] = number_counts.get(num, 0) + 1
        
        # Normalisation des fréquences des numéros
        total_draws = len(self.historical_draws)
        self.number_frequencies = {num: count / total_draws for num, count in number_counts.items()}
        
        # Calcul des fréquences des étoiles
        star_counts = {}
        for draw in self.historical_draws:
            for star in draw[self.numbers_to_draw:]:
                star_counts[star] = star_counts.get(star, 0) + 1
        
        # Normalisation des fréquences des étoiles
        self.star_frequencies = {star: count / total_draws for star, count in star_counts.items()}
        
        # Calcul des fréquences des paires
        pair_counts = {}
        for draw in self.historical_draws:
            numbers = draw[:self.numbers_to_draw]
            for i in range(len(numbers)):
                for j in range(i + 1, len(numbers)):
                    pair = tuple(sorted([numbers[i], numbers[j]]))
                    pair_counts[pair] = pair_counts.get(pair, 0) + 1
        
        # Normalisation des fréquences des paires
        max_pair_count = max(pair_counts.values()) if pair_counts else 1
        self.pair_frequencies = {pair: count / max_pair_count for pair, count in pair_counts.items()}
        
        logger.info(f"Données historiques chargées: {len(self.historical_draws)} tirages")
    
    def generate_combinations(self, num_combinations=5):
        """
        Génération de combinaisons optimisées avec l'algorithme génétique
        
        Args:
            num_combinations (int): Nombre de combinaisons à générer
            
        Returns:
            list: Liste des meilleures combinaisons générées
        """
        # Création de la population initiale
        pop = self.toolbox.population(n=self.population_size)
        
        # Statistiques à suivre
        stats = tools.Statistics(lambda ind: ind.fitness.values)
        stats.register("avg", np.mean)
        stats.register("min", np.min)
        stats.register("max", np.max)
        
        # Exécution de l'algorithme génétique
        pop, logbook = algorithms.eaSimple(
            pop, self.toolbox, 
            cxpb=self.crossover_prob, 
            mutpb=self.mutation_prob, 
            ngen=self.generations, 
            stats=stats, 
            verbose=True
        )
        
        # Tri de la population finale par fitness
        pop.sort(key=lambda x: x.fitness.values[0], reverse=True)
        
        # Sélection des meilleures combinaisons
        best_combinations = []
        for ind in pop[:num_combinations]:
            numbers = ind[:self.numbers_to_draw]
            stars = ind[self.numbers_to_draw:]
            fitness = ind.fitness.values[0]
            best_combinations.append({
                'numbers': numbers,
                'stars': stars,
                'fitness': fitness
            })
        
        logger.info(f"Génération de {num_combinations} combinaisons terminée")
        return best_combinations
    
    def plot_evolution(self, logbook):
        """
        Visualisation de l'évolution de l'algorithme génétique
        
        Args:
            logbook: Journal d'évolution de l'algorithme
        """
        gen = logbook.select("gen")
        fit_avg = logbook.select("avg")
        fit_max = logbook.select("max")
        
        plt.figure(figsize=(10, 6))
        plt.plot(gen, fit_avg, label="Moyenne")
        plt.plot(gen, fit_max, label="Maximum")
        plt.xlabel("Génération")
        plt.ylabel("Fitness")
        plt.title("Évolution de la fitness au cours des générations")
        plt.legend()
        
        # Sauvegarde du graphique
        plt.savefig(os.path.join(MODELS_DIR, "genetic_evolution.png"))
        plt.close()
    
    def save(self, filepath=None):
        """
        Sauvegarde de l'algorithme génétique
        
        Args:
            filepath (str, optional): Chemin pour la sauvegarde. Par défaut None.
        """
        if filepath is None:
            filepath = os.path.join(MODELS_DIR, 'genetic_algorithm.pkl')
        
        # Sauvegarde des données
        data = {
            'number_frequencies': self.number_frequencies,
            'star_frequencies': self.star_frequencies,
            'pair_frequencies': self.pair_frequencies,
            'population_size': self.population_size,
            'generations': self.generations,
            'crossover_prob': self.crossover_prob,
            'mutation_prob': self.mutation_prob
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(data, f)
        
        logger.info(f"Algorithme génétique sauvegardé à {filepath}")
    
    def load(self, filepath=None):
        """
        Chargement d'un algorithme génétique sauvegardé
        
        Args:
            filepath (str, optional): Chemin de l'algorithme à charger. Par défaut None.
        """
        if filepath is None:
            filepath = os.path.join(MODELS_DIR, 'genetic_algorithm.pkl')
        
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Le fichier {filepath} n'existe pas")
        
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        
        # Chargement des données
        self.number_frequencies = data['number_frequencies']
        self.star_frequencies = data['star_frequencies']
        self.pair_frequencies = data['pair_frequencies']
        self.population_size = data['population_size']
        self.generations = data['generations']
        self.crossover_prob = data['crossover_prob']
        self.mutation_prob = data['mutation_prob']
        
        logger.info(f"Algorithme génétique chargé depuis {filepath}")

# Fonction pour tester l'algorithme avec des données synthétiques
def test_algorithm():
    """
    Test de l'algorithme génétique avec des données synthétiques
    """
    # Création de données synthétiques
    np.random.seed(42)
    n_draws = 1000
    
    # Génération de tirages aléatoires
    draws = []
    for _ in range(n_draws):
        # Tirage de 5 numéros uniques entre 1 et 50
        numbers = np.sort(np.random.choice(range(1, 51), 5, replace=False))
        # Tirage de 2 étoiles uniques entre 1 et 12
        stars = np.sort(np.random.choice(range(1, 13), 2, replace=False))
        draws.append(np.concatenate([numbers, stars]))
    
    # Création d'un DataFrame
    columns = ['numero1', 'numero2', 'numero3', 'numero4', 'numero5', 'etoile1', 'etoile2']
    df = pd.DataFrame(draws, columns=columns)
    
    # Initialisation de l'algorithme génétique
    ga = GeneticAlgorithm(population_size=50, generations=20)
    
    # Chargement des données historiques
    ga.load_historical_data(df)
    
    # Génération de combinaisons
    combinations = ga.generate_combinations(num_combinations=5)
    
    # Affichage des résultats
    print("Meilleures combinaisons générées:")
    for i, combo in enumerate(combinations):
        print(f"{i+1}. Numéros: {combo['numbers']}, Étoiles: {combo['stars']}, Fitness: {combo['fitness']:.4f}")
    
    # Sauvegarde de l'algorithme
    ga.save()
    
    return ga

if __name__ == "__main__":
    # Test de l'algorithme
    test_algorithm()
