## Guide d'exportation vers GitHub et tests réels

### Exportation vers GitHub

#### Préparation du dépôt GitHub
1. Créez un compte GitHub si vous n'en avez pas déjà un
2. Créez un nouveau dépôt nommé "EuroGenius"
3. Choisissez la visibilité (public ou privé)
4. N'initialisez pas avec un README, .gitignore ou une licence (car nous importons un projet existant)

#### Configuration de l'authentification
Pour une authentification sécurisée avec GitHub, vous pouvez utiliser:
- HTTPS avec un token d'accès personnel (PAT)
- SSH avec une clé SSH

##### Méthode HTTPS (recommandée pour les débutants)
1. Créez un token d'accès personnel sur GitHub:
   - Allez dans Paramètres > Paramètres du développeur > Tokens d'accès personnel
   - Générez un nouveau token avec les permissions "repo"
   - Copiez le token généré (il ne sera affiché qu'une seule fois)

2. Configurez Git pour stocker vos identifiants:
```bash
git config --global credential.helper store
```

#### Exportation du code
```bash
# Naviguez vers le dossier du projet décompressé
cd chemin/vers/eurogenius

# Vérifiez que le dépôt Git est correctement initialisé
git status

# Ajoutez le dépôt distant GitHub
git remote add origin https://github.com/votre-nom-utilisateur/EuroGenius.git

# Poussez le code vers GitHub
git push -u origin master
```

Si vous utilisez un token d'accès personnel, vous serez invité à entrer votre nom d'utilisateur GitHub et votre token comme mot de passe.

### Tests réels de l'application

#### Test de récupération des données
1. Accédez à l'application déployée: https://efcyehmb.manus.space
2. Vérifiez que la page d'accueil affiche correctement les derniers tirages
3. Comparez ces données avec les résultats officiels d'EuroMillions

#### Test d'analyse statistique
1. Naviguez vers la section "Statistiques"
2. Vérifiez les éléments suivants:
   - Fréquences d'apparition des numéros et étoiles
   - Identification des numéros "chauds" et "froids"
   - Analyse des paires et triplets fréquents
   - Intervalles entre apparitions

#### Test des prédictions IA
1. Utilisez la fonction "Générer une combinaison"
2. Testez les différentes stratégies:
   - Statistique pure
   - Tendance récente
   - Combinaison rare
3. Vérifiez que les combinaisons générées:
   - Respectent les règles d'EuroMillions (5 numéros entre 1-50, 2 étoiles entre 1-12)
   - Sont accompagnées d'un score de confiance
   - Varient selon la stratégie choisie

#### Test de l'interface utilisateur
1. Testez la réactivité sur différents appareils:
   - Ordinateur de bureau
   - Tablette
   - Smartphone
2. Vérifiez la navigation entre les sections
3. Testez le basculement entre thème clair et sombre
4. Vérifiez l'accessibilité (contraste, taille des textes, etc.)

### Mise en place d'un environnement de test local

Si vous souhaitez effectuer des tests plus approfondis, vous pouvez configurer un environnement local:

1. Installez les dépendances:
```bash
# Backend
cd eurogenius/backend
npm install

# Frontend
cd ../frontend
npm install
```

2. Configurez la base de données:
```bash
# Créez une base de données PostgreSQL
createdb eurogenius

# Importez le schéma
psql eurogenius < ../database/schema.sql

# Importez les données initiales
psql eurogenius < ../database/seeds/init.sql
```

3. Lancez l'application en mode développement:
```bash
# Terminal 1: Backend
cd eurogenius/backend
npm run dev

# Terminal 2: Frontend
cd eurogenius/frontend
npm start
```

4. Accédez à l'application à l'adresse http://localhost:3000
