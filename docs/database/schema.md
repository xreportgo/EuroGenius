# Documentation du Schéma de Base de Données EuroGenius

## Vue d'ensemble

La base de données EuroGenius est conçue pour stocker et gérer toutes les données nécessaires à l'analyse des tirages EuroMillions, aux prédictions par intelligence artificielle et à l'interaction des utilisateurs avec l'application. Elle utilise PostgreSQL pour bénéficier de ses fonctionnalités avancées comme les contraintes d'intégrité, les index performants et le stockage JSON.

## Tables principales

### tirages

Cette table centrale stocke tous les résultats des tirages EuroMillions.

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL | Identifiant unique du tirage |
| date_tirage | DATE | Date du tirage |
| numero1-5 | INTEGER | Les 5 numéros principaux tirés (1-50) |
| etoile1-2 | INTEGER | Les 2 numéros étoiles tirés (1-12) |
| jackpot | DECIMAL | Montant du jackpot pour ce tirage |
| gagnant_rang1 | INTEGER | Nombre de gagnants au rang 1 |
| montant_rang1 | DECIMAL | Montant gagné au rang 1 |
| created_at | TIMESTAMP | Date de création de l'enregistrement |
| updated_at | TIMESTAMP | Date de dernière modification |

**Contraintes :**
- Unicité de la date de tirage
- Numéros principaux entre 1 et 50, tous différents
- Numéros étoiles entre 1 et 12, tous différents

### statistiques_numeros

Stocke les statistiques pour chaque numéro principal (1-50).

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL | Identifiant unique |
| numero | INTEGER | Numéro concerné (1-50) |
| frequence | INTEGER | Nombre d'apparitions du numéro |
| dernier_tirage_id | INTEGER | Référence au dernier tirage où ce numéro est apparu |
| ecart_actuel | INTEGER | Nombre de tirages depuis la dernière apparition |
| ecart_moyen | DECIMAL | Écart moyen entre les apparitions |
| ecart_max | INTEGER | Écart maximum observé |
| est_chaud | BOOLEAN | Indique si le numéro est considéré comme "chaud" |
| created_at | TIMESTAMP | Date de création de l'enregistrement |
| updated_at | TIMESTAMP | Date de dernière modification |

### statistiques_etoiles

Similaire à `statistiques_numeros` mais pour les numéros étoiles (1-12).

### paires_numeros

Stocke les statistiques des paires de numéros qui apparaissent ensemble.

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL | Identifiant unique |
| numero1 | INTEGER | Premier numéro de la paire |
| numero2 | INTEGER | Second numéro de la paire |
| frequence | INTEGER | Nombre d'apparitions ensemble |
| dernier_tirage_id | INTEGER | Référence au dernier tirage où cette paire est apparue |
| created_at | TIMESTAMP | Date de création de l'enregistrement |
| updated_at | TIMESTAMP | Date de dernière modification |

**Contraintes :**
- numero1 < numero2 pour éviter les doublons
- Unicité de la paire (numero1, numero2)

### triplets_numeros

Similaire à `paires_numeros` mais pour les triplets de numéros.

### utilisateurs

Stocke les informations des utilisateurs de l'application.

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL | Identifiant unique |
| email | VARCHAR | Email de l'utilisateur (unique) |
| mot_de_passe | VARCHAR | Mot de passe hashé |
| nom | VARCHAR | Nom de l'utilisateur |
| prenom | VARCHAR | Prénom de l'utilisateur |
| date_inscription | TIMESTAMP | Date d'inscription |
| derniere_connexion | TIMESTAMP | Date de dernière connexion |
| preferences | JSONB | Préférences utilisateur au format JSON |
| langue | VARCHAR | Langue préférée (fr, en, pt, de) |
| theme | VARCHAR | Thème préféré (dark, light) |
| created_at | TIMESTAMP | Date de création de l'enregistrement |
| updated_at | TIMESTAMP | Date de dernière modification |

### grilles_utilisateurs

Stocke les grilles jouées par les utilisateurs.

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL | Identifiant unique |
| utilisateur_id | INTEGER | Référence à l'utilisateur |
| date_creation | TIMESTAMP | Date de création de la grille |
| date_tirage | DATE | Date du tirage concerné |
| numero1-5 | INTEGER | Les 5 numéros principaux choisis |
| etoile1-2 | INTEGER | Les 2 numéros étoiles choisis |
| tirage_id | INTEGER | Référence au tirage concerné |
| rang_gagne | INTEGER | Rang gagné (0 si aucun gain) |
| montant_gagne | DECIMAL | Montant gagné |
| methode_generation | VARCHAR | Méthode utilisée pour générer la grille |
| created_at | TIMESTAMP | Date de création de l'enregistrement |
| updated_at | TIMESTAMP | Date de dernière modification |

### predictions_ia

Stocke les prédictions générées par les modèles d'IA.

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL | Identifiant unique |
| date_generation | TIMESTAMP | Date de génération de la prédiction |
| date_tirage | DATE | Date du tirage concerné |
| numero1-5 | INTEGER | Les 5 numéros principaux prédits |
| etoile1-2 | INTEGER | Les 2 numéros étoiles prédits |
| score_confiance | DECIMAL | Score de confiance (0-5) |
| modele_utilise | VARCHAR | Nom du modèle d'IA utilisé |
| parametres_modele | JSONB | Paramètres du modèle au format JSON |
| tirage_id | INTEGER | Référence au tirage concerné |
| rang_obtenu | INTEGER | Rang obtenu après le tirage |
| created_at | TIMESTAMP | Date de création de l'enregistrement |
| updated_at | TIMESTAMP | Date de dernière modification |

### sessions_analyse

Stocke les sessions d'analyse effectuées par les utilisateurs.

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL | Identifiant unique |
| utilisateur_id | INTEGER | Référence à l'utilisateur |
| date_debut | TIMESTAMP | Date de début de la session |
| date_fin | TIMESTAMP | Date de fin de la session |
| parametres_analyse | JSONB | Paramètres de l'analyse au format JSON |
| resultats | JSONB | Résultats de l'analyse au format JSON |
| created_at | TIMESTAMP | Date de création de l'enregistrement |
| updated_at | TIMESTAMP | Date de dernière modification |

### evenements_systeme

Stocke les événements système pour la journalisation et le débogage.

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL | Identifiant unique |
| date_evenement | TIMESTAMP | Date de l'événement |
| type_evenement | VARCHAR | Type d'événement |
| description | TEXT | Description de l'événement |
| utilisateur_id | INTEGER | Référence à l'utilisateur concerné (si applicable) |
| details | JSONB | Détails supplémentaires au format JSON |
| created_at | TIMESTAMP | Date de création de l'enregistrement |

## Relations

1. `tirages` est la table centrale référencée par :
   - `statistiques_numeros.dernier_tirage_id`
   - `statistiques_etoiles.dernier_tirage_id`
   - `paires_numeros.dernier_tirage_id`
   - `triplets_numeros.dernier_tirage_id`
   - `grilles_utilisateurs.tirage_id`
   - `predictions_ia.tirage_id`

2. `utilisateurs` est référencée par :
   - `grilles_utilisateurs.utilisateur_id`
   - `sessions_analyse.utilisateur_id`
   - `evenements_systeme.utilisateur_id`

## Index

Des index ont été créés pour optimiser les requêtes fréquentes :

- `idx_tirages_date` : Recherche de tirages par date
- `idx_stats_numeros_frequence` : Tri des numéros par fréquence
- `idx_stats_etoiles_frequence` : Tri des étoiles par fréquence
- `idx_paires_frequence` : Tri des paires par fréquence
- `idx_triplets_frequence` : Tri des triplets par fréquence
- `idx_grilles_utilisateur` : Recherche des grilles par utilisateur
- `idx_grilles_date_tirage` : Recherche des grilles par date de tirage
- `idx_predictions_date_tirage` : Recherche des prédictions par date de tirage
- `idx_predictions_score` : Tri des prédictions par score de confiance

## Initialisation

Le script d'initialisation (`init.sql`) :
1. Crée des entrées pour tous les numéros (1-50) dans `statistiques_numeros`
2. Crée des entrées pour toutes les étoiles (1-12) dans `statistiques_etoiles`
3. Crée un utilisateur administrateur par défaut
4. Enregistre un événement système d'initialisation

## Maintenance

Pour maintenir les performances de la base de données :
1. Exécuter régulièrement `VACUUM ANALYZE` pour mettre à jour les statistiques
2. Surveiller la croissance des tables, particulièrement `tirages` et `predictions_ia`
3. Archiver les anciennes données si nécessaire

## Évolutions futures

Possibilités d'extension du schéma :
1. Table pour les statistiques de combinaisons de 4 numéros
2. Table pour les statistiques de combinaisons numéros+étoiles
3. Table pour les modèles d'IA entraînés (métadonnées)
4. Table pour les tournois entre utilisateurs
