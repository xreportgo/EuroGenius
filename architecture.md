# Architecture du Projet EuroGenius

## Vue d'ensemble

EuroGenius est structuré selon une architecture moderne séparant clairement le frontend, le backend, la base de données et les modèles d'intelligence artificielle. Cette séparation permet un développement modulaire, une maintenance simplifiée et une évolution indépendante de chaque composant.

## Structure des répertoires

```
eurogenius/
├── .git/                      # Répertoire Git pour le contrôle de version
├── .github/                   # Configuration pour GitHub Actions (CI/CD)
├── docs/                      # Documentation du projet
│   ├── api/                   # Documentation de l'API
│   ├── database/              # Documentation de la base de données
│   ├── models/                # Documentation des modèles IA
│   └── user/                  # Manuel utilisateur
├── frontend/                  # Application frontend React
│   ├── public/                # Ressources statiques
│   ├── src/                   # Code source React
│   │   ├── assets/            # Images, polices, etc.
│   │   ├── components/        # Composants React réutilisables
│   │   ├── contexts/          # Contextes React pour l'état global
│   │   ├── hooks/             # Hooks React personnalisés
│   │   ├── pages/             # Composants de page
│   │   ├── services/          # Services pour les appels API
│   │   ├── styles/            # Styles globaux et thèmes
│   │   ├── utils/             # Fonctions utilitaires
│   │   ├── App.js             # Composant racine
│   │   └── index.js           # Point d'entrée
│   ├── .eslintrc.js           # Configuration ESLint
│   ├── package.json           # Dépendances et scripts npm
│   └── README.md              # Documentation spécifique au frontend
├── backend/                   # Serveur backend Node.js/Express
│   ├── src/                   # Code source du backend
│   │   ├── api/               # Routes et contrôleurs API
│   │   ├── config/            # Configuration du serveur
│   │   ├── middleware/        # Middleware Express
│   │   ├── models/            # Modèles de données
│   │   ├── services/          # Services métier
│   │   ├── utils/             # Fonctions utilitaires
│   │   └── app.js             # Point d'entrée du serveur
│   ├── tests/                 # Tests unitaires et d'intégration
│   ├── package.json           # Dépendances et scripts npm
│   └── README.md              # Documentation spécifique au backend
├── database/                  # Scripts et migrations de base de données
│   ├── migrations/            # Scripts de migration SQL
│   ├── seeds/                 # Données initiales
│   └── schema.sql             # Schéma de la base de données
├── ml/                        # Modèles d'intelligence artificielle
│   ├── data/                  # Données d'entraînement et de test
│   ├── models/                # Modèles entraînés
│   ├── notebooks/             # Notebooks Jupyter pour l'exploration
│   ├── src/                   # Code source Python pour les modèles
│   │   ├── preprocessing/     # Prétraitement des données
│   │   ├── training/          # Entraînement des modèles
│   │   ├── evaluation/        # Évaluation des modèles
│   │   └── prediction/        # API de prédiction
│   ├── requirements.txt       # Dépendances Python
│   └── README.md              # Documentation spécifique aux modèles IA
├── scripts/                   # Scripts utilitaires
│   ├── setup.sh               # Script d'installation
│   ├── deploy.sh              # Script de déploiement
│   └── backup.sh              # Script de sauvegarde
├── .gitignore                 # Fichiers à ignorer par Git
├── README.md                  # Documentation principale du projet
├── CHANGELOG.md               # Journal des modifications
├── LICENSE                    # Licence du projet
└── docker-compose.yml         # Configuration Docker pour le développement
```

## Composants principaux

### Frontend (React.js)

Le frontend est développé avec React.js et Material-UI pour implémenter le design system minimaliste suisse. Il est responsable de :
- L'affichage des données et des visualisations
- L'interaction utilisateur
- La communication avec le backend via des appels API

### Backend (Node.js/Express)

Le backend fournit une API RESTful pour :
- La gestion des données de tirage
- L'authentification et l'autorisation des utilisateurs
- La communication avec la base de données
- L'intégration avec l'API Pedro Mealha
- L'interface avec les modèles d'IA

### Base de données (PostgreSQL)

La base de données stocke :
- L'historique des tirages EuroMillions
- Les résultats d'analyse statistique
- Les prédictions générées par les modèles d'IA
- Les données utilisateur et les préférences

### Modèles d'IA (Python/TensorFlow)

Les modèles d'intelligence artificielle sont développés en Python avec TensorFlow/Keras et sont responsables de :
- L'analyse des séquences de tirage
- La prédiction des tendances
- La génération de combinaisons intelligentes
- L'évaluation des performances prédictives

## Flux de données

1. **Acquisition des données** : Le backend récupère régulièrement les données de tirage via l'API Pedro Mealha
2. **Stockage** : Les données sont stockées dans la base de données PostgreSQL
3. **Analyse** : Les modèles statistiques et d'IA analysent les données pour générer des insights
4. **Présentation** : Le frontend récupère les résultats d'analyse via l'API backend et les présente à l'utilisateur
5. **Interaction** : L'utilisateur peut demander des analyses spécifiques ou générer des combinaisons
6. **Feedback** : Les interactions utilisateur peuvent être utilisées pour affiner les modèles

## Stratégie de déploiement

Le projet sera déployé en utilisant une approche DevOps avec :
- Intégration continue via GitHub Actions
- Conteneurisation avec Docker pour la cohérence entre les environnements
- Déploiement sur des services cloud (AWS, Google Cloud ou Azure)
- Surveillance et journalisation pour le suivi des performances

## Considérations de sécurité

- Authentification sécurisée avec JWT
- Chiffrement des données sensibles
- Protection contre les attaques courantes (XSS, CSRF, injection SQL)
- Conformité RGPD pour les utilisateurs européens

## Stratégie de sauvegarde

Conformément aux meilleures pratiques :
- Sauvegardes quotidiennes de la base de données
- Contrôle de version avec Git pour tout le code source
- Commits réguliers avec des messages descriptifs
- Branches séparées pour les fonctionnalités et les corrections
