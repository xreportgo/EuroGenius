# Guide de Déploiement - EuroGenius

Ce guide détaille les étapes nécessaires pour déployer l'application EuroGenius dans différents environnements.

## Prérequis

### Environnement de développement

- Node.js v16.x ou supérieur
- npm v8.x ou supérieur
- Python 3.8 ou supérieur
- PostgreSQL 13 ou supérieur
- Git

### Environnement de production

- Serveur Linux (Ubuntu 20.04 LTS recommandé)
- Nginx ou Apache
- Node.js v16.x ou supérieur
- Python 3.8 ou supérieur
- PostgreSQL 13 ou supérieur
- PM2 (gestionnaire de processus pour Node.js)
- Certificat SSL (Let's Encrypt recommandé)

## Structure du projet

Le projet EuroGenius est divisé en trois parties principales :

1. **Frontend** : Application React
2. **Backend** : API Node.js/Express
3. **ML** : Modèles d'intelligence artificielle en Python

## Déploiement local (développement)

### 1. Cloner le dépôt

```bash
git clone https://github.com/eurogenius/eurogenius.git
cd eurogenius
```

### 2. Configurer la base de données

```bash
# Créer la base de données PostgreSQL
sudo -u postgres psql
postgres=# CREATE DATABASE eurogenius;
postgres=# CREATE USER eurogenius WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';
postgres=# GRANT ALL PRIVILEGES ON DATABASE eurogenius TO eurogenius;
postgres=# \q

# Initialiser la structure de la base de données
cd database
psql -U eurogenius -d eurogenius -f schema.sql
psql -U eurogenius -d eurogenius -f seeds/init.sql
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` dans le répertoire `backend` :

```
# Backend .env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgres://eurogenius:votre_mot_de_passe@localhost:5432/eurogenius
JWT_SECRET=votre_secret_jwt
API_KEY=votre_cle_api_pedro_mealha
```

Créez un fichier `.env` dans le répertoire `frontend` :

```
# Frontend .env
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Installer les dépendances et démarrer les services

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

#### ML

```bash
cd ml
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
pip install -r requirements.txt
python src/server.py
```

L'application sera accessible à l'adresse http://localhost:3000

## Déploiement en production

### 1. Préparation du serveur

```bash
# Mettre à jour le système
sudo apt update
sudo apt upgrade -y

# Installer les dépendances
sudo apt install -y nginx postgresql postgresql-contrib python3 python3-pip python3-venv
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Configurer la base de données

```bash
# Créer la base de données PostgreSQL
sudo -u postgres psql
postgres=# CREATE DATABASE eurogenius;
postgres=# CREATE USER eurogenius WITH ENCRYPTED PASSWORD 'votre_mot_de_passe_production';
postgres=# GRANT ALL PRIVILEGES ON DATABASE eurogenius TO eurogenius;
postgres=# \q

# Initialiser la structure de la base de données
cd /path/to/eurogenius/database
sudo -u postgres psql -d eurogenius -f schema.sql
sudo -u postgres psql -d eurogenius -f seeds/init.sql
```

### 3. Déployer le backend

```bash
# Cloner le dépôt
cd /var/www
sudo git clone https://github.com/eurogenius/eurogenius.git
cd eurogenius/backend

# Configurer les variables d'environnement
sudo nano .env
# Ajouter les variables d'environnement de production

# Installer les dépendances
sudo npm install --production

# Démarrer le serveur avec PM2
sudo pm2 start src/server.js --name eurogenius-backend
sudo pm2 startup
sudo pm2 save
```

### 4. Déployer les modèles ML

```bash
cd /var/www/eurogenius/ml

# Créer et activer l'environnement virtuel
sudo python3 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur ML avec PM2
sudo pm2 start --interpreter=python3 src/server.py --name eurogenius-ml
sudo pm2 save
```

### 5. Déployer le frontend

```bash
cd /var/www/eurogenius/frontend

# Configurer les variables d'environnement
sudo nano .env
# Ajouter les variables d'environnement de production

# Installer les dépendances et construire l'application
sudo npm install
sudo npm run build
```

### 6. Configurer Nginx

Créez un fichier de configuration Nginx :

```bash
sudo nano /etc/nginx/sites-available/eurogenius
```

Ajoutez la configuration suivante :

```nginx
server {
    listen 80;
    server_name eurogenius.com www.eurogenius.com;

    location / {
        root /var/www/eurogenius/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ml {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activez la configuration et redémarrez Nginx :

```bash
sudo ln -s /etc/nginx/sites-available/eurogenius /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Configurer SSL avec Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d eurogenius.com -d www.eurogenius.com
```

## Déploiement avec Docker

### 1. Prérequis

- Docker
- Docker Compose

### 2. Structure des fichiers Docker

Le projet contient les fichiers Docker suivants :

- `Dockerfile.frontend` : Configuration pour le frontend
- `Dockerfile.backend` : Configuration pour le backend
- `Dockerfile.ml` : Configuration pour les modèles ML
- `docker-compose.yml` : Configuration pour orchestrer tous les services

### 3. Déploiement avec Docker Compose

```bash
# Cloner le dépôt
git clone https://github.com/eurogenius/eurogenius.git
cd eurogenius

# Configurer les variables d'environnement
cp .env.example .env
# Modifier le fichier .env avec vos paramètres

# Démarrer les services
docker-compose up -d
```

L'application sera accessible à l'adresse http://localhost:3000

## Mise à jour de l'application

### Mise à jour manuelle

```bash
cd /var/www/eurogenius

# Récupérer les dernières modifications
sudo git pull

# Mettre à jour le backend
cd backend
sudo npm install --production
sudo pm2 restart eurogenius-backend

# Mettre à jour le frontend
cd ../frontend
sudo npm install
sudo npm run build

# Mettre à jour les modèles ML
cd ../ml
source venv/bin/activate
pip install -r requirements.txt
sudo pm2 restart eurogenius-ml
```

### Mise à jour avec Docker

```bash
cd /path/to/eurogenius

# Récupérer les dernières modifications
git pull

# Reconstruire et redémarrer les services
docker-compose down
docker-compose build
docker-compose up -d
```

## Sauvegarde et restauration

### Sauvegarde de la base de données

```bash
# Créer un répertoire pour les sauvegardes
mkdir -p /var/backups/eurogenius

# Sauvegarder la base de données
pg_dump -U eurogenius -d eurogenius > /var/backups/eurogenius/backup_$(date +%Y%m%d).sql

# Automatiser la sauvegarde avec cron
echo "0 2 * * * pg_dump -U eurogenius -d eurogenius > /var/backups/eurogenius/backup_\$(date +\%Y\%m\%d).sql" | sudo tee -a /etc/crontab
```

### Restauration de la base de données

```bash
# Restaurer à partir d'une sauvegarde
psql -U eurogenius -d eurogenius < /var/backups/eurogenius/backup_20250326.sql
```

## Surveillance et maintenance

### Surveillance avec PM2

```bash
# Vérifier l'état des services
pm2 status

# Consulter les logs
pm2 logs eurogenius-backend
pm2 logs eurogenius-ml

# Redémarrer les services
pm2 restart eurogenius-backend
pm2 restart eurogenius-ml
```

### Surveillance avec Nginx

```bash
# Vérifier les logs d'accès
sudo tail -f /var/log/nginx/access.log

# Vérifier les logs d'erreur
sudo tail -f /var/log/nginx/error.log
```

## Résolution des problèmes courants

### Le backend ne démarre pas

1. Vérifiez les logs : `pm2 logs eurogenius-backend`
2. Vérifiez la connexion à la base de données
3. Vérifiez les variables d'environnement

### Le frontend affiche une page blanche

1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que le build a été correctement généré
3. Vérifiez la configuration Nginx

### Les modèles ML ne fonctionnent pas

1. Vérifiez les logs : `pm2 logs eurogenius-ml`
2. Vérifiez que toutes les dépendances Python sont installées
3. Vérifiez que les modèles entraînés sont présents dans le répertoire `ml/models`

## Optimisation des performances

### Base de données

- Ajoutez des index pour les requêtes fréquentes
- Configurez le pool de connexions dans le backend
- Augmentez les ressources allouées à PostgreSQL si nécessaire

### Nginx

- Activez la compression gzip
- Configurez la mise en cache des ressources statiques
- Augmentez les limites de connexion si nécessaire

### Application

- Utilisez un CDN pour les ressources statiques
- Activez la mise en cache côté client
- Optimisez les images et les bundles JavaScript

## Sécurité

### Bonnes pratiques

- Maintenez tous les logiciels à jour
- Utilisez des mots de passe forts et uniques
- Limitez les accès SSH avec des clés publiques
- Configurez un pare-feu (UFW recommandé)
- Utilisez HTTPS pour toutes les communications

### Configuration de sécurité Nginx

```nginx
server {
    # ... configuration existante ...

    # Ajouter des en-têtes de sécurité
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.pedromealha.com;";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

## Support et contact

Pour toute question ou problème concernant le déploiement, contactez notre équipe de support :

- Email : support@eurogenius.com
- Documentation complète : https://docs.eurogenius.com

---

© 2025 EuroGenius. Tous droits réservés.
