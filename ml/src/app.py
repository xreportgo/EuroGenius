import os
import flask
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
import joblib
import sys
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialisation de l'application Flask
app = Flask(__name__)
CORS(app)  # Activation de CORS pour permettre les requêtes cross-origin

# Chargement des modèles
def load_models():
    try:
        # Chemins vers les modèles
        numbers_model_path = os.path.join('models', 'lstm_numbers_model.h5')
        stars_model_path = os.path.join('models', 'lstm_stars_model.h5')
        
        # Vérification de l'existence des fichiers
        if not os.path.exists(numbers_model_path):
            logger.error(f"Le modèle des numéros n'existe pas: {numbers_model_path}")
            # Création d'un modèle factice pour le développement
            numbers_model = create_dummy_model(input_shape=(10, 5), output_units=50)
        else:
            numbers_model = keras.models.load_model(numbers_model_path)
            
        if not os.path.exists(stars_model_path):
            logger.error(f"Le modèle des étoiles n'existe pas: {stars_model_path}")
            # Création d'un modèle factice pour le développement
            stars_model = create_dummy_model(input_shape=(10, 2), output_units=12)
        else:
            stars_model = keras.models.load_model(stars_model_path)
            
        logger.info("Modèles chargés avec succès")
        return numbers_model, stars_model
    except Exception as e:
        logger.error(f"Erreur lors du chargement des modèles: {str(e)}")
        # Création de modèles factices en cas d'erreur
        numbers_model = create_dummy_model(input_shape=(10, 5), output_units=50)
        stars_model = create_dummy_model(input_shape=(10, 2), output_units=12)
        return numbers_model, stars_model

# Création d'un modèle factice pour le développement
def create_dummy_model(input_shape, output_units):
    model = keras.Sequential([
        keras.layers.LSTM(64, input_shape=input_shape),
        keras.layers.Dense(128, activation='relu'),
        keras.layers.Dense(output_units, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy')
    return model

# Chargement des données historiques
def load_historical_data():
    try:
        # Chemin vers les données historiques
        data_path = os.path.join('data', 'euromillions_history.csv')
        
        # Vérification de l'existence du fichier
        if not os.path.exists(data_path):
            logger.error(f"Le fichier de données n'existe pas: {data_path}")
            # Création de données factices pour le développement
            return create_dummy_data()
        
        # Chargement des données
        data = pd.read_csv(data_path)
        logger.info("Données historiques chargées avec succès")
        return data
    except Exception as e:
        logger.error(f"Erreur lors du chargement des données: {str(e)}")
        # Création de données factices en cas d'erreur
        return create_dummy_data()

# Création de données factices pour le développement
def create_dummy_data():
    # Création d'un DataFrame avec des tirages aléatoires
    dates = pd.date_range(start='2004-02-13', end='2025-03-25', freq='W-FRI')
    n_draws = len(dates)
    
    data = {
        'date': dates,
        'n1': np.random.randint(1, 51, n_draws),
        'n2': np.random.randint(1, 51, n_draws),
        'n3': np.random.randint(1, 51, n_draws),
        'n4': np.random.randint(1, 51, n_draws),
        'n5': np.random.randint(1, 51, n_draws),
        's1': np.random.randint(1, 13, n_draws),
        's2': np.random.randint(1, 13, n_draws)
    }
    
    return pd.DataFrame(data)

# Préparation des données pour les modèles
def prepare_data(data, sequence_length=10):
    # Extraction des numéros et étoiles
    numbers = data[['n1', 'n2', 'n3', 'n4', 'n5']].values
    stars = data[['s1', 's2']].values
    
    # Création des séquences
    X_numbers = []
    X_stars = []
    
    for i in range(len(data) - sequence_length):
        X_numbers.append(numbers[i:i+sequence_length])
        X_stars.append(stars[i:i+sequence_length])
    
    return np.array(X_numbers), np.array(X_stars)

# Génération de prédictions
def generate_predictions(numbers_model, stars_model, data, strategy='balanced', n_combinations=5):
    # Préparation des données
    X_numbers, X_stars = prepare_data(data)
    
    if len(X_numbers) == 0:
        logger.error("Pas assez de données pour générer des prédictions")
        return generate_random_combinations(n_combinations)
    
    try:
        # Prédiction des probabilités
        numbers_probs = numbers_model.predict(X_numbers[-1:])
        stars_probs = stars_model.predict(X_stars[-1:])
        
        # Génération des combinaisons selon la stratégie
        if strategy == 'statistical':
            combinations = generate_statistical_combinations(data, n_combinations)
        elif strategy == 'hot':
            combinations = generate_hot_combinations(data, n_combinations)
        elif strategy == 'cold':
            combinations = generate_cold_combinations(data, n_combinations)
        elif strategy == 'rare':
            combinations = generate_rare_combinations(numbers_probs[0], stars_probs[0], n_combinations)
        else:  # balanced
            combinations = generate_balanced_combinations(numbers_probs[0], stars_probs[0], data, n_combinations)
        
        # Calcul des scores de confiance
        combinations = calculate_confidence_scores(combinations, numbers_probs[0], stars_probs[0])
        
        return combinations
    except Exception as e:
        logger.error(f"Erreur lors de la génération des prédictions: {str(e)}")
        return generate_random_combinations(n_combinations)

# Génération de combinaisons aléatoires
def generate_random_combinations(n_combinations):
    combinations = []
    
    for _ in range(n_combinations):
        # Génération de 5 numéros uniques entre 1 et 50
        numbers = sorted(np.random.choice(range(1, 51), 5, replace=False))
        # Génération de 2 étoiles uniques entre 1 et 12
        stars = sorted(np.random.choice(range(1, 13), 2, replace=False))
        
        combination = {
            'numbers': numbers.tolist(),
            'stars': stars.tolist(),
            'confidence': round(np.random.uniform(0.1, 0.9), 2)
        }
        
        combinations.append(combination)
    
    return combinations

# Génération de combinaisons basées sur les statistiques
def generate_statistical_combinations(data, n_combinations):
    combinations = []
    
    # Calcul des fréquences
    number_counts = {}
    for i in range(1, 51):
        count = ((data['n1'] == i) | (data['n2'] == i) | (data['n3'] == i) | 
                 (data['n4'] == i) | (data['n5'] == i)).sum()
        number_counts[i] = count
    
    star_counts = {}
    for i in range(1, 13):
        count = ((data['s1'] == i) | (data['s2'] == i)).sum()
        star_counts[i] = count
    
    # Tri des numéros et étoiles par fréquence
    sorted_numbers = sorted(number_counts.keys(), key=lambda x: number_counts[x], reverse=True)
    sorted_stars = sorted(star_counts.keys(), key=lambda x: star_counts[x], reverse=True)
    
    for i in range(n_combinations):
        # Sélection des numéros et étoiles les plus fréquents avec une légère variation
        start_idx = i % 10
        numbers = sorted(sorted_numbers[start_idx:start_idx+5])
        stars = sorted(sorted_stars[i % 5:i % 5+2])
        
        combination = {
            'numbers': numbers,
            'stars': stars,
            'confidence': round(0.7 - (i * 0.05), 2)  # Confiance décroissante
        }
        
        combinations.append(combination)
    
    return combinations

# Génération de combinaisons basées sur les numéros "chauds"
def generate_hot_combinations(data, n_combinations):
    # Utilisation des 20 derniers tirages pour déterminer les numéros "chauds"
    recent_data = data.tail(20)
    return generate_statistical_combinations(recent_data, n_combinations)

# Génération de combinaisons basées sur les numéros "froids"
def generate_cold_combinations(data, n_combinations):
    combinations = []
    
    # Calcul des écarts (nombre de tirages depuis la dernière apparition)
    number_gaps = {}
    for i in range(1, 51):
        last_occurrence = max(
            data[data['n1'] == i].index.max(),
            data[data['n2'] == i].index.max(),
            data[data['n3'] == i].index.max(),
            data[data['n4'] == i].index.max(),
            data[data['n5'] == i].index.max()
        )
        
        if pd.isna(last_occurrence):
            gap = len(data)  # Jamais apparu
        else:
            gap = len(data) - last_occurrence
        
        number_gaps[i] = gap
    
    star_gaps = {}
    for i in range(1, 13):
        last_occurrence = max(
            data[data['s1'] == i].index.max(),
            data[data['s2'] == i].index.max()
        )
        
        if pd.isna(last_occurrence):
            gap = len(data)  # Jamais apparu
        else:
            gap = len(data) - last_occurrence
        
        star_gaps[i] = gap
    
    # Tri des numéros et étoiles par écart
    sorted_numbers = sorted(number_gaps.keys(), key=lambda x: number_gaps[x], reverse=True)
    sorted_stars = sorted(star_gaps.keys(), key=lambda x: star_gaps[x], reverse=True)
    
    for i in range(n_combinations):
        # Sélection des numéros et étoiles avec les plus grands écarts avec une légère variation
        start_idx = i % 10
        numbers = sorted(sorted_numbers[start_idx:start_idx+5])
        stars = sorted(sorted_stars[i % 5:i % 5+2])
        
        combination = {
            'numbers': numbers,
            'stars': stars,
            'confidence': round(0.6 - (i * 0.05), 2)  # Confiance décroissante
        }
        
        combinations.append(combination)
    
    return combinations

# Génération de combinaisons rares basées sur les probabilités
def generate_rare_combinations(numbers_probs, stars_probs, n_combinations):
    combinations = []
    
    for _ in range(n_combinations):
        # Sélection des numéros avec les probabilités les plus faibles
        numbers_indices = np.argsort(numbers_probs)[:5]
        numbers = sorted([i + 1 for i in numbers_indices])
        
        # Sélection des étoiles avec les probabilités les plus faibles
        stars_indices = np.argsort(stars_probs)[:2]
        stars = sorted([i + 1 for i in stars_indices])
        
        # Ajout d'une légère randomisation
        if np.random.random() < 0.3:
            random_idx = np.random.randint(0, 5)
            new_number = np.random.randint(1, 51)
            while new_number in numbers:
                new_number = np.random.randint(1, 51)
            numbers[random_idx] = new_number
            numbers.sort()
        
        if np.random.random() < 0.3:
            random_idx = np.random.randint(0, 2)
            new_star = np.random.randint(1, 13)
            while new_star in stars:
                new_star = np.random.randint(1, 13)
            stars[random_idx] = new_star
            stars.sort()
        
        combination = {
            'numbers': numbers,
            'stars': stars,
            'confidence': round(np.random.uniform(0.2, 0.5), 2)  # Confiance faible
        }
        
        combinations.append(combination)
    
    return combinations

# Génération de combinaisons équilibrées
def generate_balanced_combinations(numbers_probs, stars_probs, data, n_combinations):
    combinations = []
    
    # Mélange de différentes stratégies
    statistical_combinations = generate_statistical_combinations(data, n_combinations // 3)
    hot_combinations = generate_hot_combinations(data, n_combinations // 3)
    
    # Génération de combinaisons basées sur les probabilités du modèle
    model_combinations = []
    for _ in range(n_combinations - len(statistical_combinations) - len(hot_combinations)):
        # Sélection des numéros avec les probabilités les plus élevées
        numbers_indices = np.argsort(numbers_probs)[-10:]  # Top 10
        selected_indices = np.random.choice(numbers_indices, 5, replace=False)
        numbers = sorted([i + 1 for i in selected_indices])
        
        # Sélection des étoiles avec les probabilités les plus élevées
        stars_indices = np.argsort(stars_probs)[-5:]  # Top 5
        selected_indices = np.random.choice(stars_indices, 2, replace=False)
        stars = sorted([i + 1 for i in selected_indices])
        
        combination = {
            'numbers': numbers,
            'stars': stars,
            'confidence': round(np.random.uniform(0.6, 0.9), 2)  # Confiance élevée
        }
        
        model_combinations.append(combination)
    
    # Combinaison des différentes stratégies
    combinations = statistical_combinations + hot_combinations + model_combinations
    
    return combinations

# Calcul des scores de confiance
def calculate_confidence_scores(combinations, numbers_probs, stars_probs):
    for combination in combinations:
        numbers = combination['numbers']
        stars = combination['stars']
        
        # Calcul du score basé sur les probabilités du modèle
        number_score = sum(numbers_probs[n-1] for n in numbers) / 5
        star_score = sum(stars_probs[s-1] for s in stars) / 2
        
        # Score combiné
        combined_score = 0.7 * number_score + 0.3 * star_score
        
        # Ajustement du score de confiance existant
        combination['confidence'] = round((combination['confidence'] + combined_score) / 2, 2)
    
    return combinations

# Chargement des modèles et des données
numbers_model, stars_model = load_models()
historical_data = load_historical_data()

# Route pour la page d'accueil
@app.route('/')
def home():
    return jsonify({
        'status': 'success',
        'message': 'API EuroGenius ML en ligne',
        'version': '1.0.0'
    })

# Route pour obtenir les derniers tirages
@app.route('/api/draws/latest', methods=['GET'])
def get_latest_draws():
    try:
        n_draws = request.args.get('n', default=10, type=int)
        latest_draws = historical_data.tail(n_draws).to_dict('records')
        
        # Formatage des résultats
        formatted_draws = []
        for draw in latest_draws:
            formatted_draw = {
                'date': draw['date'].strftime('%Y-%m-%d') if isinstance(draw['date'], pd.Timestamp) else draw['date'],
                'numbers': [draw['n1'], draw['n2'], draw['n3'], draw['n4'], draw['n5']],
                'stars': [draw['s1'], draw['s2']]
            }
            formatted_draws.append(formatted_draw)
        
        return jsonify({
            'status': 'success',
            'data': formatted_draws
        })
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des derniers tirages: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# Route pour obtenir les statistiques
@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    try:
        # Calcul des fréquences des numéros
        number_frequencies = {}
        for i in range(1, 51):
            count = ((historical_data['n1'] == i) | (historical_data['n2'] == i) | 
                     (historical_data['n3'] == i) | (historical_data['n4'] == i) | 
                     (historical_data['n5'] == i)).sum()
            frequency = count / len(historical_data)
            number_frequencies[i] = {
                'count': int(count),
                'frequency': round(frequency, 4)
            }
        
        # Calcul des fréquences des étoiles
        star_frequencies = {}
        for i in range(1, 13):
            count = ((historical_data['s1'] == i) | (historical_data['s2'] == i)).sum()
            frequency = count / len(historical_data)
            star_frequencies[i] = {
                'count': int(count),
                'frequency': round(frequency, 4)
            }
        
        # Calcul des numéros "chauds" et "froids"
        recent_data = historical_data.tail(20)
        hot_numbers = []
        cold_numbers = []
        
        for i in range(1, 51):
            recent_count = ((recent_data['n1'] == i) | (recent_data['n2'] == i) | 
                           (recent_data['n3'] == i) | (recent_data['n4'] == i) | 
                           (recent_data['n5'] == i)).sum()
            
            if recent_count >= 3:
                hot_numbers.append(i)
            elif recent_count == 0:
                cold_numbers.append(i)
        
        hot_stars = []
        cold_stars = []
        
        for i in range(1, 13):
            recent_count = ((recent_data['s1'] == i) | (recent_data['s2'] == i)).sum()
            
            if recent_count >= 3:
                hot_stars.append(i)
            elif recent_count == 0:
                cold_stars.append(i)
        
        return jsonify({
            'status': 'success',
            'data': {
                'number_frequencies': number_frequencies,
                'star_frequencies': star_frequencies,
                'hot_numbers': hot_numbers,
                'cold_numbers': cold_numbers,
                'hot_stars': hot_stars,
                'cold_stars': cold_stars
            }
        })
    except Exception as e:
        logger.error(f"Erreur lors du calcul des statistiques: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# Route pour générer des prédictions
@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    try:
        strategy = request.args.get('strategy', default='balanced', type=str)
        n_combinations = request.args.get('n', default=5, type=int)
        
        # Validation des paramètres
        valid_strategies = ['balanced', 'statistical', 'hot', 'cold', 'rare']
        if strategy not in valid_strategies:
            return jsonify({
                'status': 'error',
                'message': f"Stratégie invalide. Valeurs acceptées: {', '.join(valid_strategies)}"
            }), 400
        
        if n_combinations < 1 or n_combinations > 10:
            return jsonify({
                'status': 'error',
                'message': "Le nombre de combinaisons doit être entre 1 et 10"
            }), 400
        
        # Génération des prédictions
        combinations = generate_predictions(numbers_model, stars_model, historical_data, strategy, n_combinations)
        
        return jsonify({
            'status': 'success',
            'data': {
                'strategy': strategy,
                'combinations': combinations
            }
        })
    except Exception as e:
        logger.error(f"Erreur lors de la génération des prédictions: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# Démarrage de l'application
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
