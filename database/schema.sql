-- Schéma de la base de données EuroGenius

-- Table des tirages EuroMillions
CREATE TABLE tirages (
    id SERIAL PRIMARY KEY,
    date_tirage DATE NOT NULL,
    numero1 INTEGER NOT NULL CHECK (numero1 BETWEEN 1 AND 50),
    numero2 INTEGER NOT NULL CHECK (numero2 BETWEEN 1 AND 50),
    numero3 INTEGER NOT NULL CHECK (numero3 BETWEEN 1 AND 50),
    numero4 INTEGER NOT NULL CHECK (numero4 BETWEEN 1 AND 50),
    numero5 INTEGER NOT NULL CHECK (numero5 BETWEEN 1 AND 50),
    etoile1 INTEGER NOT NULL CHECK (etoile1 BETWEEN 1 AND 12),
    etoile2 INTEGER NOT NULL CHECK (etoile2 BETWEEN 1 AND 12),
    jackpot DECIMAL(15, 2),
    gagnant_rang1 INTEGER DEFAULT 0,
    montant_rang1 DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tirage UNIQUE (date_tirage),
    CONSTRAINT numeros_differents CHECK (
        numero1 != numero2 AND numero1 != numero3 AND numero1 != numero4 AND numero1 != numero5 AND
        numero2 != numero3 AND numero2 != numero4 AND numero2 != numero5 AND
        numero3 != numero4 AND numero3 != numero5 AND
        numero4 != numero5
    ),
    CONSTRAINT etoiles_differentes CHECK (etoile1 != etoile2)
);

-- Table des statistiques de fréquence des numéros
CREATE TABLE statistiques_numeros (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL CHECK (numero BETWEEN 1 AND 50),
    frequence INTEGER DEFAULT 0,
    dernier_tirage_id INTEGER REFERENCES tirages(id),
    ecart_actuel INTEGER DEFAULT 0,
    ecart_moyen DECIMAL(10, 2) DEFAULT 0,
    ecart_max INTEGER DEFAULT 0,
    est_chaud BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des statistiques de fréquence des étoiles
CREATE TABLE statistiques_etoiles (
    id SERIAL PRIMARY KEY,
    etoile INTEGER NOT NULL CHECK (etoile BETWEEN 1 AND 12),
    frequence INTEGER DEFAULT 0,
    dernier_tirage_id INTEGER REFERENCES tirages(id),
    ecart_actuel INTEGER DEFAULT 0,
    ecart_moyen DECIMAL(10, 2) DEFAULT 0,
    ecart_max INTEGER DEFAULT 0,
    est_chaud BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paires de numéros fréquentes
CREATE TABLE paires_numeros (
    id SERIAL PRIMARY KEY,
    numero1 INTEGER NOT NULL CHECK (numero1 BETWEEN 1 AND 50),
    numero2 INTEGER NOT NULL CHECK (numero2 BETWEEN 1 AND 50),
    frequence INTEGER DEFAULT 0,
    dernier_tirage_id INTEGER REFERENCES tirages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT paire_unique CHECK (numero1 < numero2),
    CONSTRAINT unique_paire UNIQUE (numero1, numero2)
);

-- Table des triplets de numéros fréquents
CREATE TABLE triplets_numeros (
    id SERIAL PRIMARY KEY,
    numero1 INTEGER NOT NULL CHECK (numero1 BETWEEN 1 AND 50),
    numero2 INTEGER NOT NULL CHECK (numero2 BETWEEN 1 AND 50),
    numero3 INTEGER NOT NULL CHECK (numero3 BETWEEN 1 AND 50),
    frequence INTEGER DEFAULT 0,
    dernier_tirage_id INTEGER REFERENCES tirages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT triplet_unique CHECK (numero1 < numero2 AND numero2 < numero3),
    CONSTRAINT unique_triplet UNIQUE (numero1, numero2, numero3)
);

-- Table des utilisateurs
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP,
    preferences JSONB DEFAULT '{}',
    langue VARCHAR(10) DEFAULT 'fr',
    theme VARCHAR(10) DEFAULT 'dark',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des grilles jouées par les utilisateurs
CREATE TABLE grilles_utilisateurs (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER REFERENCES utilisateurs(id),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_tirage DATE,
    numero1 INTEGER NOT NULL CHECK (numero1 BETWEEN 1 AND 50),
    numero2 INTEGER NOT NULL CHECK (numero2 BETWEEN 1 AND 50),
    numero3 INTEGER NOT NULL CHECK (numero3 BETWEEN 1 AND 50),
    numero4 INTEGER NOT NULL CHECK (numero4 BETWEEN 1 AND 50),
    numero5 INTEGER NOT NULL CHECK (numero5 BETWEEN 1 AND 50),
    etoile1 INTEGER NOT NULL CHECK (etoile1 BETWEEN 1 AND 12),
    etoile2 INTEGER NOT NULL CHECK (etoile2 BETWEEN 1 AND 12),
    tirage_id INTEGER REFERENCES tirages(id),
    rang_gagne INTEGER,
    montant_gagne DECIMAL(15, 2) DEFAULT 0,
    methode_generation VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT numeros_differents CHECK (
        numero1 != numero2 AND numero1 != numero3 AND numero1 != numero4 AND numero1 != numero5 AND
        numero2 != numero3 AND numero2 != numero4 AND numero2 != numero5 AND
        numero3 != numero4 AND numero3 != numero5 AND
        numero4 != numero5
    ),
    CONSTRAINT etoiles_differentes CHECK (etoile1 != etoile2)
);

-- Table des prédictions générées par l'IA
CREATE TABLE predictions_ia (
    id SERIAL PRIMARY KEY,
    date_generation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_tirage DATE,
    numero1 INTEGER NOT NULL CHECK (numero1 BETWEEN 1 AND 50),
    numero2 INTEGER NOT NULL CHECK (numero2 BETWEEN 1 AND 50),
    numero3 INTEGER NOT NULL CHECK (numero3 BETWEEN 1 AND 50),
    numero4 INTEGER NOT NULL CHECK (numero4 BETWEEN 1 AND 50),
    numero5 INTEGER NOT NULL CHECK (numero5 BETWEEN 1 AND 50),
    etoile1 INTEGER NOT NULL CHECK (etoile1 BETWEEN 1 AND 12),
    etoile2 INTEGER NOT NULL CHECK (etoile2 BETWEEN 1 AND 12),
    score_confiance DECIMAL(5, 2) CHECK (score_confiance BETWEEN 0 AND 5),
    modele_utilise VARCHAR(100),
    parametres_modele JSONB,
    tirage_id INTEGER REFERENCES tirages(id),
    rang_obtenu INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT numeros_differents CHECK (
        numero1 != numero2 AND numero1 != numero3 AND numero1 != numero4 AND numero1 != numero5 AND
        numero2 != numero3 AND numero2 != numero4 AND numero2 != numero5 AND
        numero3 != numero4 AND numero3 != numero5 AND
        numero4 != numero5
    ),
    CONSTRAINT etoiles_differentes CHECK (etoile1 != etoile2)
);

-- Table des sessions d'analyse
CREATE TABLE sessions_analyse (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER REFERENCES utilisateurs(id),
    date_debut TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_fin TIMESTAMP,
    parametres_analyse JSONB,
    resultats JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des événements système (logs)
CREATE TABLE evenements_systeme (
    id SERIAL PRIMARY KEY,
    date_evenement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type_evenement VARCHAR(50) NOT NULL,
    description TEXT,
    utilisateur_id INTEGER REFERENCES utilisateurs(id),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX idx_tirages_date ON tirages(date_tirage);
CREATE INDEX idx_stats_numeros_frequence ON statistiques_numeros(frequence DESC);
CREATE INDEX idx_stats_etoiles_frequence ON statistiques_etoiles(frequence DESC);
CREATE INDEX idx_paires_frequence ON paires_numeros(frequence DESC);
CREATE INDEX idx_triplets_frequence ON triplets_numeros(frequence DESC);
CREATE INDEX idx_grilles_utilisateur ON grilles_utilisateurs(utilisateur_id);
CREATE INDEX idx_grilles_date_tirage ON grilles_utilisateurs(date_tirage);
CREATE INDEX idx_predictions_date_tirage ON predictions_ia(date_tirage);
CREATE INDEX idx_predictions_score ON predictions_ia(score_confiance DESC);
