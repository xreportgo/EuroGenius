-- Script d'initialisation de la base de données EuroGenius
-- Ce script initialise les tables avec des données de base

-- Insertion des données initiales pour les statistiques des numéros (1-50)
INSERT INTO statistiques_numeros (numero, frequence, ecart_actuel, ecart_moyen, ecart_max, est_chaud)
SELECT 
    n, 
    0, -- fréquence initiale à 0
    0, -- écart actuel à 0
    0, -- écart moyen à 0
    0, -- écart max à 0
    FALSE -- est_chaud à FALSE
FROM generate_series(1, 50) AS n;

-- Insertion des données initiales pour les statistiques des étoiles (1-12)
INSERT INTO statistiques_etoiles (etoile, frequence, ecart_actuel, ecart_moyen, ecart_max, est_chaud)
SELECT 
    e, 
    0, -- fréquence initiale à 0
    0, -- écart actuel à 0
    0, -- écart moyen à 0
    0, -- écart max à 0
    FALSE -- est_chaud à FALSE
FROM generate_series(1, 12) AS e;

-- Création d'un utilisateur administrateur par défaut
-- Note: Dans un environnement de production, utiliser un mot de passe sécurisé et hashé
INSERT INTO utilisateurs (
    email, 
    mot_de_passe, 
    nom, 
    prenom, 
    langue, 
    theme
) VALUES (
    'admin@eurogenius.com',
    '$2a$10$XgXLGQAv6UYoqQg4hGFcIOAYmP9HXR6MChN90e4a/LSJUzGtCQlJe', -- 'admin123' hashé avec bcrypt
    'Admin',
    'EuroGenius',
    'fr',
    'dark'
);

-- Insertion d'un événement système pour l'initialisation de la base de données
INSERT INTO evenements_systeme (
    type_evenement,
    description
) VALUES (
    'INITIALISATION',
    'Initialisation de la base de données EuroGenius'
);
