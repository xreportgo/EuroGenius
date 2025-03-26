import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Dense, LSTM, Embedding, Input, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import os
import sys
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

# Ajout du répertoire parent au path pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import ROOT_DIR, DATA_DIR, MODELS_DIR, logger

class LSTMStarsModel:
    """
    Modèle LSTM pour la prédiction des étoiles EuroMillions
    """
    
    def __init__(self, sequence_length=10, batch_size=32, epochs=100):
        """
        Initialisation du modèle
        
        Args:
            sequence_length (int): Nombre de tirages précédents à utiliser pour la prédiction
            batch_size (int): Taille des lots pour l'entraînement
            epochs (int): Nombre d'époques pour l'entraînement
        """
        self.sequence_length = sequence_length
        self.batch_size = batch_size
        self.epochs = epochs
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        
        # Paramètres spécifiques à EuroMillions
        self.num_stars = 12  # Étoiles de 1 à 12
        self.stars_to_draw = 2  # 2 étoiles par tirage
        
        logger.info(f"Modèle LSTM pour étoiles initialisé avec sequence_length={sequence_length}")
    
    def _build_model(self):
        """
        Construction de l'architecture du modèle LSTM
        """
        # Définition de l'architecture du modèle
        model = Sequential()
        
        # Couche d'embedding pour transformer les numéros en vecteurs
        model.add(Embedding(input_dim=self.num_stars+1, output_dim=16, 
                           input_length=self.sequence_length*self.stars_to_draw))
        
        # Couche LSTM pour capturer les dépendances temporelles
        model.add(LSTM(64, return_sequences=False))
        
        # Dropout pour éviter le surapprentissage
        model.add(Dropout(0.3))
        
        # Couche dense avec activation ReLU
        model.add(Dense(128, activation='relu'))
        model.add(Dropout(0.3))
        
        # Couche de sortie avec activation softmax pour les probabilités
        # +1 car les étoiles vont de 1 à 12 (0 est utilisé pour le padding)
        model.add(Dense(self.num_stars+1, activation='softmax'))
        
        # Compilation du modèle
        model.compile(
            loss='categorical_crossentropy',
            optimizer=Adam(learning_rate=0.001),
            metrics=['accuracy']
        )
        
        self.model = model
        logger.info(f"Modèle LSTM pour étoiles construit: {model.summary()}")
        return model
    
    def _prepare_data(self, data):
        """
        Préparation des données pour l'entraînement
        
        Args:
            data (DataFrame): DataFrame contenant les tirages historiques
            
        Returns:
            tuple: (X_train, y_train, X_val, y_val) données d'entraînement et de validation
        """
        # Extraction des étoiles
        stars = data[['etoile1', 'etoile2']].values
        
        # Création des séquences
        X, y = [], []
        
        for i in range(len(stars) - self.sequence_length):
            # Séquence d'entrée: sequence_length tirages consécutifs
            seq = stars[i:i+self.sequence_length].flatten()
            X.append(seq)
            
            # Sortie: étoiles du tirage suivant
            next_draw = stars[i+self.sequence_length]
            y.append(next_draw)
        
        X = np.array(X)
        y = np.array(y)
        
        # Conversion des sorties en format one-hot
        y_one_hot = []
        for draw in y:
            # Création d'un vecteur one-hot pour chaque étoile du tirage
            draw_one_hot = np.zeros((self.stars_to_draw, self.num_stars+1))
            for i, num in enumerate(draw):
                draw_one_hot[i, num] = 1
            y_one_hot.append(draw_one_hot)
        
        y_one_hot = np.array(y_one_hot)
        
        # Division en ensembles d'entraînement et de validation
        X_train, X_val, y_train, y_val = train_test_split(
            X, y_one_hot, test_size=0.2, random_state=42
        )
        
        logger.info(f"Données préparées: X_train shape: {X_train.shape}, y_train shape: {y_train.shape}")
        return X_train, y_train, X_val, y_val
    
    def train(self, data):
        """
        Entraînement du modèle
        
        Args:
            data (DataFrame): DataFrame contenant les tirages historiques
            
        Returns:
            History: Historique d'entraînement
        """
        # Construction du modèle s'il n'existe pas
        if self.model is None:
            self._build_model()
        
        # Préparation des données
        X_train, y_train, X_val, y_val = self._prepare_data(data)
        
        # Callbacks pour l'entraînement
        callbacks = [
            EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
            ModelCheckpoint(
                filepath=os.path.join(MODELS_DIR, 'lstm_stars_model.h5'),
                monitor='val_loss',
                save_best_only=True
            )
        ]
        
        # Entraînement du modèle
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=self.epochs,
            batch_size=self.batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        logger.info("Entraînement du modèle LSTM pour étoiles terminé")
        return history
    
    def predict(self, recent_draws):
        """
        Génération de prédictions pour le prochain tirage
        
        Args:
            recent_draws (array): Derniers tirages (sequence_length tirages)
            
        Returns:
            array: Probabilités pour chaque étoile (1-12)
        """
        if self.model is None:
            raise ValueError("Le modèle doit être entraîné avant de faire des prédictions")
        
        # Préparation des données d'entrée
        X = np.array([recent_draws.flatten()])
        
        # Prédiction
        predictions = self.model.predict(X)
        
        # Traitement des prédictions pour obtenir les 2 étoiles les plus probables
        # tout en s'assurant qu'elles sont différentes
        probabilities = predictions[0]
        
        # Conversion des probabilités en liste d'étoiles triées par probabilité
        star_probs = [(i, prob) for i, prob in enumerate(probabilities) if i > 0]
        star_probs.sort(key=lambda x: x[1], reverse=True)
        
        # Sélection des 2 étoiles les plus probables
        selected_stars = [star for star, _ in star_probs[:self.stars_to_draw]]
        selected_stars.sort()  # Tri des étoiles par ordre croissant
        
        logger.info(f"Prédiction générée: {selected_stars}")
        return selected_stars, probabilities
    
    def save(self, filepath=None):
        """
        Sauvegarde du modèle
        
        Args:
            filepath (str, optional): Chemin pour la sauvegarde. Par défaut None.
        """
        if self.model is None:
            raise ValueError("Le modèle doit être entraîné avant d'être sauvegardé")
        
        if filepath is None:
            filepath = os.path.join(MODELS_DIR, 'lstm_stars_model.h5')
        
        self.model.save(filepath)
        logger.info(f"Modèle sauvegardé à {filepath}")
    
    def load(self, filepath=None):
        """
        Chargement d'un modèle sauvegardé
        
        Args:
            filepath (str, optional): Chemin du modèle à charger. Par défaut None.
        """
        if filepath is None:
            filepath = os.path.join(MODELS_DIR, 'lstm_stars_model.h5')
        
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Le fichier modèle {filepath} n'existe pas")
        
        self.model = tf.keras.models.load_model(filepath)
        logger.info(f"Modèle chargé depuis {filepath}")

# Fonction pour tester le modèle avec des données synthétiques
def test_model():
    """
    Test du modèle avec des données synthétiques
    """
    # Création de données synthétiques
    np.random.seed(42)
    n_draws = 1000
    
    # Génération de tirages aléatoires
    draws = []
    for _ in range(n_draws):
        # Tirage de 2 étoiles uniques entre 1 et 12
        stars = np.sort(np.random.choice(range(1, 13), 2, replace=False))
        draws.append(stars)
    
    # Création d'un DataFrame
    columns = ['etoile1', 'etoile2']
    df = pd.DataFrame(draws, columns=columns)
    
    # Initialisation et entraînement du modèle
    model = LSTMStarsModel(sequence_length=5, batch_size=32, epochs=5)
    history = model.train(df)
    
    # Test de prédiction
    recent_draws = np.array(draws[-5:])
    predicted_stars, probabilities = model.predict(recent_draws)
    
    print(f"Derniers tirages utilisés pour la prédiction:")
    for draw in recent_draws:
        print(f"  {draw}")
    
    print(f"Étoiles prédites pour le prochain tirage: {predicted_stars}")
    
    # Sauvegarde du modèle
    model.save()
    
    return model

if __name__ == "__main__":
    # Test du modèle
    test_model()
