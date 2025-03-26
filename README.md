# EuroGenius

## Présentation

EuroGenius est une application d'analyse avancée des tirages EuroMillions qui combine statistiques traditionnelles et intelligence artificielle pour prédire les tendances des tirages. Avec son design minimaliste inspiré du style suisse, EuroGenius offre une expérience utilisateur intuitive et visuellement attrayante.

## Fonctionnalités principales

- **Analyse statistique classique** : fréquences, paires/triplets, intervalles entre apparitions
- **Prédiction par intelligence artificielle** : modèles LSTM et Transformers pour détecter les motifs complexes
- **Générateur intelligent** : proposition de combinaisons basées sur différentes stratégies
- **Visualisations avancées** : cartes thermiques, graphes de dépendance, analyses fractales
- **Interface personnalisable** : thèmes clair/sombre, préférences utilisateur
- **Mode Tournoi** : simulation de tirages pour tester différentes stratégies

## Architecture technique

EuroGenius est construit sur une architecture moderne avec :

- **Frontend** : React.js avec Material-UI
- **Backend** : Node.js/Express ou Python/Flask
- **Base de données** : PostgreSQL
- **IA** : Python avec TensorFlow/Keras

Pour plus de détails sur l'architecture, consultez le fichier [architecture.md](./architecture.md).

## Installation

### Prérequis

- Node.js (v14+)
- Python (v3.8+)
- PostgreSQL (v12+)
- Git

### Installation du projet

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/eurogenius.git
cd eurogenius

# Installation des dépendances frontend
cd frontend
npm install

# Installation des dépendances backend
cd ../backend
npm install

# Installation des dépendances Python pour les modèles IA
cd ../ml
pip install -r requirements.txt

# Configuration de la base de données
cd ../database
# Suivre les instructions dans database/README.md
```

## Développement

### Structure du projet

```
eurogenius/
├── frontend/     # Application React
├── backend/      # API Node.js/Express
├── database/     # Scripts et migrations SQL
├── ml/           # Modèles d'IA Python
├── docs/         # Documentation
└── scripts/      # Scripts utilitaires
```

### Commandes principales

```bash
# Lancer le frontend en développement
cd frontend
npm start

# Lancer le backend en développement
cd backend
npm run dev

# Entraîner les modèles IA
cd ml
python src/training/train_models.py
```

## Contribution

Les contributions sont les bienvenues ! Veuillez consulter [CONTRIBUTING.md](./CONTRIBUTING.md) pour les directives de contribution.

## Licence

Ce projet est sous licence [MIT](./LICENSE).

## Contact

Pour toute question ou suggestion, veuillez contacter l'équipe de développement à [email@example.com](mailto:email@example.com).
