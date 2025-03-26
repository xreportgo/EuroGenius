# Documentation Technique - EuroGenius

## Vue d'ensemble

EuroGenius est une application d'analyse statistique avancée et de prédiction pour les tirages EuroMillions. Elle combine des algorithmes statistiques classiques avec des modèles d'intelligence artificielle pour analyser les tendances et générer des combinaisons optimisées.

## Architecture globale

L'application est structurée selon une architecture moderne en trois couches :

1. **Frontend** : Interface utilisateur développée avec React et Material-UI
2. **Backend** : Serveur Node.js/Express pour la logique métier et l'API
3. **Modèles ML** : Système d'intelligence artificielle en Python avec TensorFlow

### Diagramme d'architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │◄───►│     Backend     │◄───►│   Modèles ML    │
│    (React)      │     │  (Node.js/API)  │     │   (Python/TF)   │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  Base de données│
                        │  (PostgreSQL)   │
                        │                 │
                        └─────────────────┘
```

## Technologies utilisées

### Frontend
- **React.js** : Bibliothèque JavaScript pour la construction d'interfaces utilisateur
- **Material-UI** : Framework de composants React pour un design moderne
- **Context API** : Gestion de l'état global de l'application
- **Axios** : Client HTTP pour les requêtes API
- **Jest & React Testing Library** : Outils de test

### Backend
- **Node.js** : Environnement d'exécution JavaScript côté serveur
- **Express** : Framework web pour Node.js
- **PostgreSQL** : Système de gestion de base de données relationnelle
- **Sequelize** : ORM pour Node.js et PostgreSQL
- **API Pedro Mealha** : Source externe pour les données de tirage EuroMillions

### Modèles ML
- **Python** : Langage de programmation pour l'analyse de données et l'IA
- **TensorFlow/Keras** : Bibliothèques pour la création et l'entraînement de modèles d'IA
- **NumPy/Pandas** : Bibliothèques pour la manipulation de données
- **DEAP** : Framework pour les algorithmes génétiques

## Structure du projet

```
eurogenius/
├── frontend/               # Application React
│   ├── public/             # Fichiers statiques
│   └── src/                # Code source React
│       ├── components/     # Composants réutilisables
│       ├── contexts/       # Contextes React (état global)
│       ├── pages/          # Pages de l'application
│       ├── services/       # Services pour les appels API
│       ├── styles/         # Styles et thèmes
│       └── tests/          # Tests unitaires et d'intégration
│
├── backend/                # Serveur Node.js
│   ├── src/                # Code source du backend
│   │   ├── api/            # Contrôleurs et routes API
│   │   ├── config/         # Configuration
│   │   ├── models/         # Modèles de données
│   │   └── services/       # Services métier
│   └── tests/              # Tests du backend
│
├── ml/                     # Modèles d'intelligence artificielle
│   ├── src/                # Code source Python
│   │   ├── config/         # Configuration
│   │   ├── data/           # Gestion des données
│   │   ├── prediction/     # Modèles de prédiction
│   │   └── training/       # Entraînement des modèles
│   └── models/             # Modèles entraînés
│
├── database/               # Scripts de base de données
│   ├── migrations/         # Migrations de schéma
│   ├── seeds/              # Données initiales
│   └── schema.sql          # Schéma principal
│
└── docs/                   # Documentation
    ├── api/                # Documentation API
    ├── database/           # Documentation base de données
    ├── deployment/         # Guide de déploiement
    └── user/               # Manuel utilisateur
```

## Base de données

### Schéma de la base de données

La base de données PostgreSQL comprend les tables suivantes :

1. **draws** : Stocke les tirages historiques EuroMillions
2. **number_stats** : Statistiques sur les numéros
3. **star_stats** : Statistiques sur les étoiles
4. **pairs** : Paires de numéros fréquentes
5. **triplets** : Triplets de numéros fréquents
6. **users** : Informations sur les utilisateurs
7. **user_grids** : Grilles sauvegardées par les utilisateurs
8. **predictions** : Prédictions générées par les modèles IA
9. **analysis_sessions** : Sessions d'analyse

Pour plus de détails, voir la [documentation de la base de données](../database/schema.md).

## Frontend

### Composants principaux

- **App.js** : Composant racine avec la navigation et le thème
- **HomePage.js** : Page d'accueil avec dernier tirage et statistiques rapides
- **StatisticsPage.js** : Page d'analyse statistique détaillée
- **PredictionPage.js** : Page de prédictions IA
- **LotteryComponents.js** : Composants réutilisables pour l'affichage des numéros et étoiles

### Contexte API

Le contexte API (`ApiContext.js`) gère l'état global de l'application et les appels à l'API :

```javascript
// Exemple d'utilisation du contexte API
import { useApi } from '../contexts/ApiContext';

const MyComponent = () => {
  const { latestDraw, loading, error, refreshLatestDraw } = useApi();
  
  // Utilisation des données et fonctions du contexte
  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <div>
          <h2>Dernier tirage : {latestDraw.date}</h2>
          {/* Affichage des numéros et étoiles */}
        </div>
      )}
      <Button onClick={refreshLatestDraw}>Rafraîchir</Button>
    </div>
  );
};
```

### Thème et design system

L'application utilise un design system basé sur Material-UI avec une palette de couleurs personnalisée :

- **Noir (#121212)** : fond sombre, textes sur thème clair
- **Blanc (#FFFFFF)** : fond clair, textes sur thème sombre
- **Orange (#FF6D00)** : accents, boutons importants
- **Bleu (#1976D2)** : éléments interactifs secondaires
- **Vert émeraude (#2E7D32)** : pour les indicateurs positifs/statistiques favorables

L'application prend en charge les thèmes clair et sombre, avec basculement automatique.

## Backend

### API RESTful

Le backend expose une API RESTful avec les endpoints suivants :

#### Tirages
- `GET /api/draws/latest` : Récupère le dernier tirage
- `GET /api/draws/next` : Récupère les informations sur le prochain tirage
- `GET /api/draws/history` : Récupère l'historique des tirages
- `GET /api/draws/:date` : Récupère un tirage spécifique par date

#### Statistiques
- `GET /api/stats/numbers` : Statistiques sur les numéros
- `GET /api/stats/stars` : Statistiques sur les étoiles
- `GET /api/stats/pairs` : Statistiques sur les paires fréquentes
- `GET /api/stats/triplets` : Statistiques sur les triplets fréquents
- `GET /api/stats/gaps` : Analyse des écarts

#### Prédictions
- `POST /api/predictions/generate` : Génère des prédictions
- `GET /api/predictions/history` : Historique des prédictions

### Services

Les services backend implémentent la logique métier :

- **StatisticsService** : Calcul des statistiques
- **PredictionService** : Interface avec les modèles ML
- **DrawService** : Gestion des tirages
- **UserService** : Gestion des utilisateurs

## Modèles d'intelligence artificielle

### Architecture des modèles

Le système d'IA combine trois approches complémentaires :

1. **Modèle LSTM pour les numéros principaux** : Réseau neuronal récurrent pour prédire les 5 numéros
2. **Modèle LSTM pour les étoiles** : Réseau neuronal dédié aux 2 étoiles
3. **Algorithme génétique** : Génération de combinaisons rares mais plausibles

### Système d'ensemble

Un système d'ensemble combine les prédictions des différents modèles selon trois stratégies :

- **Conservatrice** : Favorise les numéros fréquents (poids LSTM élevé)
- **Équilibrée** : Mélange équilibré des approches
- **Risquée** : Favorise les combinaisons rares (poids algorithme génétique élevé)

## Tests

### Tests unitaires

Les tests unitaires vérifient le bon fonctionnement des composants individuels :

- Tests des composants React
- Tests des services backend
- Tests des modèles ML

### Tests d'intégration

Les tests d'intégration vérifient que les différentes parties de l'application fonctionnent ensemble :

- Tests de l'intégration frontend-backend
- Tests de l'intégration backend-ML
- Tests de l'application complète

## Sécurité

- **Authentification** : JWT (JSON Web Tokens)
- **Validation des entrées** : Validation côté client et serveur
- **Protection contre les injections SQL** : Utilisation de requêtes paramétrées
- **HTTPS** : Communication chiffrée

## Performance

- **Lazy loading** : Chargement différé des composants React
- **Mise en cache** : Cache des résultats d'API fréquemment utilisés
- **Optimisation des requêtes** : Indexation de la base de données
- **Compression** : Compression gzip pour les réponses HTTP

## Extensibilité

L'architecture modulaire permet d'ajouter facilement de nouvelles fonctionnalités :

- Nouveaux modèles d'IA
- Nouvelles visualisations
- Support pour d'autres loteries
- Fonctionnalités sociales

## Limitations connues

- Les prédictions sont basées sur des données historiques et ne garantissent pas de gains
- L'API Pedro Mealha peut être temporairement indisponible
- Les modèles ML nécessitent des mises à jour régulières pour maintenir leur précision

## Références

- [Documentation React](https://reactjs.org/docs/getting-started.html)
- [Documentation Material-UI](https://mui.com/getting-started/usage/)
- [Documentation TensorFlow](https://www.tensorflow.org/api_docs)
- [Documentation API Pedro Mealha](https://api.pedromealha.com/docs)
