import numpy as np
import os
import sys
import pandas as pd
import tensorflow as tf
import pickle
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

# Ajout du répertoire parent au path pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import ROOT_DIR, DATA_DIR, MODELS_DIR, logger
from training.lstm_numbers_model import LSTMNumbersModel
from training.lstm_stars_model import LSTMStarsModel
from training.genetic_algorithm import GeneticAlgorithm

class EnsembleModel:
    """
    Système d'ensemble combinant les prédictions des différents modèles
    """
    
    def __init__(self):
        """
        Initialisation du système d'ensemble
        """
        self.lstm_numbers_model = LSTMNumbersModel()
        self.lstm_stars_model = LSTMStarsModel()
        self.genetic_algorithm = GeneticAlgorithm()
        
        # Poids des différents modèles dans l'ensemble
        self.weights = {
            'lstm_numbers': 0.4,
            'lstm_stars': 0.4,
            'genetic': 0.2
        }
        
        # Paramètres spécifiques à EuroMillions
        self.num_numbers = 50  # Numéros de 1 à 50
        self.num_stars = 12    # Étoiles de 1 à 12
        self.numbers_to_draw = 5  # 5 numéros par tirage
        self.stars_to_draw = 2    # 2 étoiles par tirage
        
        logger.info("Système d'ensemble initialisé")
    
    def load_models(self, lstm_numbers_path=None, lstm_stars_path=None, genetic_path=None):
        """
        Chargement des modèles individuels
        
        Args:
            lstm_numbers_path (str, optional): Chemin du modèle LSTM pour les numéros
            lstm_stars_path (str, optional): Chemin du modèle LSTM pour les étoiles
            genetic_path (str, optional): Chemin de l'algorithme génétique
        """
        try:
            self.lstm_numbers_model.load(lstm_numbers_path)
            logger.info("Modèle LSTM pour les numéros chargé avec succès")
        except Exception as e:
            logger.warning(f"Impossible de charger le modèle LSTM pour les numéros: {e}")
        
        try:
            self.lstm_stars_model.load(lstm_stars_path)
            logger.info("Modèle LSTM pour les étoiles chargé avec succès")
        except Exception as e:
            logger.warning(f"Impossible de charger le modèle LSTM pour les étoiles: {e}")
        
        try:
            self.genetic_algorithm.load(genetic_path)
            logger.info("Algorithme génétique chargé avec succès")
        except Exception as e:
            logger.warning(f"Impossible de charger l'algorithme génétique: {e}")
    
    def train_models(self, data):
        """
        Entraînement de tous les modèles
        
        Args:
            data (DataFrame): DataFrame contenant les tirages historiques
        """
        # Entraînement du modèle LSTM pour les numéros
        logger.info("Début de l'entraînement du modèle LSTM pour les numéros")
        self.lstm_numbers_model.train(data)
        
        # Entraînement du modèle LSTM pour les étoiles
        logger.info("Début de l'entraînement du modèle LSTM pour les étoiles")
        self.lstm_stars_model.train(data)
        
        # Chargement des données historiques pour l'algorithme génétique
        logger.info("Chargement des données historiques pour l'algorithme génétique")
        self.genetic_algorithm.load_historical_data(data)
        
        logger.info("Entraînement de tous les modèles terminé")
    
    def generate_combinations(self, recent_draws, num_combinations=5, strategy="balanced"):
        """
        Génération de combinaisons en utilisant tous les modèles
        
        Args:
            recent_draws (DataFrame): Tirages récents pour la prédiction
            num_combinations (int): Nombre de combinaisons à générer
            strategy (str): Stratégie de génération ('balanced', 'conservative', 'risky')
            
        Returns:
            list: Liste des combinaisons générées avec leurs scores de confiance
        """
        # Extraction des numéros et étoiles des tirages récents
        numbers = recent_draws[['numero1', 'numero2', 'numero3', 'numero4', 'numero5']].values
        stars = recent_draws[['etoile1', 'etoile2']].values
        
        # Prédiction avec le modèle LSTM pour les numéros
        try:
            lstm_numbers, lstm_numbers_probs = self.lstm_numbers_model.predict(numbers)
            logger.info(f"Prédiction LSTM pour les numéros: {lstm_numbers}")
        except Exception as e:
            logger.error(f"Erreur lors de la prédiction LSTM pour les numéros: {e}")
            lstm_numbers = []
            lstm_numbers_probs = np.zeros(self.num_numbers + 1)
        
        # Prédiction avec le modèle LSTM pour les étoiles
        try:
            lstm_stars, lstm_stars_probs = self.lstm_stars_model.predict(stars)
            logger.info(f"Prédiction LSTM pour les étoiles: {lstm_stars}")
        except Exception as e:
            logger.error(f"Erreur lors de la prédiction LSTM pour les étoiles: {e}")
            lstm_stars = []
            lstm_stars_probs = np.zeros(self.num_stars + 1)
        
        # Génération de combinaisons avec l'algorithme génétique
        try:
            genetic_combinations = self.genetic_algorithm.generate_combinations(num_combinations=num_combinations)
            logger.info(f"Combinaisons générées par l'algorithme génétique: {len(genetic_combinations)}")
        except Exception as e:
            logger.error(f"Erreur lors de la génération de combinaisons avec l'algorithme génétique: {e}")
            genetic_combinations = []
        
        # Combinaison des prédictions selon la stratégie
        combinations = []
        
        if strategy == "conservative":
            # Stratégie conservatrice: favorise les numéros fréquents
            weights = {
                'lstm_numbers': 0.6,
                'lstm_stars': 0.6,
                'genetic': 0.1
            }
        elif strategy == "risky":
            # Stratégie risquée: favorise les combinaisons rares
            weights = {
                'lstm_numbers': 0.2,
                'lstm_stars': 0.2,
                'genetic': 0.7
            }
        else:  # balanced
            # Stratégie équilibrée: utilise les poids par défaut
            weights = self.weights
        
        # Génération des combinaisons finales
        if lstm_numbers and lstm_stars:
            # Ajout de la prédiction directe des modèles LSTM
            combinations.append({
                'numbers': lstm_numbers,
                'stars': lstm_stars,
                'confidence': 5.0,  # Score de confiance maximal
                'source': 'lstm_direct'
            })
        
        # Ajout des combinaisons de l'algorithme génétique avec scores de confiance
        for combo in genetic_combinations:
            # Calcul du score de confiance (1-5)
            # Basé sur le fitness normalisé et les probabilités LSTM
            
            # Contribution du fitness génétique
            genetic_score = min(5.0, combo['fitness'] * 5.0)
            
            # Contribution des probabilités LSTM pour les numéros
            lstm_numbers_score = 0
            if len(lstm_numbers_probs) > 0:
                for num in combo['numbers']:
                    if num < len(lstm_numbers_probs):
                        lstm_numbers_score += lstm_numbers_probs[num]
                lstm_numbers_score = min(5.0, lstm_numbers_score * 5.0 / self.numbers_to_draw)
            
            # Contribution des probabilités LSTM pour les étoiles
            lstm_stars_score = 0
            if len(lstm_stars_probs) > 0:
                for star in combo['stars']:
                    if star < len(lstm_stars_probs):
                        lstm_stars_score += lstm_stars_probs[star]
                lstm_stars_score = min(5.0, lstm_stars_score * 5.0 / self.stars_to_draw)
            
            # Score de confiance pondéré
            confidence = (
                weights['genetic'] * genetic_score +
                weights['lstm_numbers'] * lstm_numbers_score +
                weights['lstm_stars'] * lstm_stars_score
            ) / sum(weights.values())
            
            # Arrondi à 1 décimale
            confidence = round(confidence, 1)
            
            combinations.append({
                'numbers': combo['numbers'],
                'stars': combo['stars'],
                'confidence': confidence,
                'source': 'ensemble'
            })
        
        # Tri des combinaisons par score de confiance
        combinations.sort(key=lambda x: x['confidence'], reverse=True)
        
        # Limitation au nombre demandé
        combinations = combinations[:num_combinations]
        
        logger.info(f"Génération de {len(combinations)} combinaisons terminée")
        return combinations
    
    def save(self, filepath=None):
        """
        Sauvegarde du système d'ensemble
        
        Args:
            filepath (str, optional): Répertoire pour la sauvegarde. Par défaut None.
        """
        if filepath is None:
            filepath = MODELS_DIR
        
        # Sauvegarde des modèles individuels
        try:
            self.lstm_numbers_model.save(os.path.join(filepath, 'lstm_numbers_model.h5'))
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde du modèle LSTM pour les numéros: {e}")
        
        try:
            self.lstm_stars_model.save(os.path.join(filepath, 'lstm_stars_model.h5'))
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde du modèle LSTM pour les étoiles: {e}")
        
        try:
            self.genetic_algorithm.save(os.path.join(filepath, 'genetic_algorithm.pkl'))
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde de l'algorithme génétique: {e}")
        
        # Sauvegarde des poids de l'ensemble
        ensemble_config = {
            'weights': self.weights
        }
        
        with open(os.path.join(filepath, 'ensemble_config.pkl'), 'wb') as f:
            pickle.dump(ensemble_config, f)
        
        logger.info(f"Système d'ensemble sauvegardé dans {filepath}")
    
    def load(self, filepath=None):
        """
        Chargement du système d'ensemble
        
        Args:
            filepath (str, optional): Répertoire contenant les modèles. Par défaut None.
        """
        if filepath is None:
            filepath = MODELS_DIR
        
        # Chargement des modèles individuels
        self.load_models(
            lstm_numbers_path=os.path.join(filepath, 'lstm_numbers_model.h5'),
            lstm_stars_path=os.path.join(filepath, 'lstm_stars_model.h5'),
            genetic_path=os.path.join(filepath, 'genetic_algorithm.pkl')
        )
        
        # Chargement des poids de l'ensemble
        ensemble_config_path = os.path.join(filepath, 'ensemble_config.pkl')
        if os.path.exists(ensemble_config_path):
            with open(ensemble_config_path, 'rb') as f:
                ensemble_config = pickle.load(f)
            
            self.weights = ensemble_config.get('weights', self.weights)
        
        logger.info(f"Système d'ensemble chargé depuis {filepath}")

# Fonction pour tester le système d'ensemble avec des données synthétiques
def test_ensemble():
    """
    Test du système d'ensemble avec des données synthétiques
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
    
    # Initialisation du système d'ensemble
    ensemble = EnsembleModel()
    
    # Entraînement des modèles (version courte pour le test)
    # Modification des paramètres pour un entraînement rapide
    ensemble.lstm_numbers_model.epochs = 5
    ensemble.lstm_stars_model.epochs = 5
    ensemble.genetic_algorithm.generations = 10
    
    # Entraînement
    ensemble.train_models(df)
    
    # Test de génération de combinaisons
    recent_draws = df.tail(10)
    combinations = ensemble.generate_combinations(recent_draws, num_combinations=5)
    
    # Affichage des résultats
    print("Combinaisons générées par le système d'ensemble:")
    for i, combo in enumerate(combinations):
        print(f"{i+1}. Numéros: {combo['numbers']}, Étoiles: {combo['stars']}, Confiance: {combo['confidence']}/5.0, Source: {combo['source']}")
    
    # Sauvegarde du système d'ensemble
    ensemble.save()
    
    return ensemble

if __name__ == "__main__":
    # Test du système d'ensemble
    test_ensemble()
