-- Script de migration pour la version 0.1.0
-- Ce script crée la structure initiale de la base de données EuroGenius

-- Création des tables
\i /home/ubuntu/eurogenius/database/schema.sql

-- Initialisation des données de base
\i /home/ubuntu/eurogenius/database/seeds/init.sql

-- Enregistrement de la migration
INSERT INTO evenements_systeme (
    type_evenement,
    description
) VALUES (
    'MIGRATION',
    'Migration vers la version 0.1.0 - Structure initiale de la base de données'
);
