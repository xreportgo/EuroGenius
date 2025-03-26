#!/bin/bash

# Script de déploiement pour EuroGenius
# Ce script déploie l'application EuroGenius sur un serveur de production

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Vérification des prérequis
log "Vérification des prérequis..."
command -v nginx >/dev/null 2>&1 || error "Nginx n'est pas installé. Veuillez l'installer avant de continuer."
command -v node >/dev/null 2>&1 || error "Node.js n'est pas installé. Veuillez l'installer avant de continuer."
command -v npm >/dev/null 2>&1 || error "npm n'est pas installé. Veuillez l'installer avant de continuer."

# Variables de configuration
DEPLOY_DIR="/var/www/eurogenius"
NGINX_CONF="/etc/nginx/sites-available/eurogenius.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/eurogenius.conf"
DOMAIN="eurogenius.com"

# Création du répertoire de déploiement
log "Création du répertoire de déploiement..."
sudo mkdir -p $DEPLOY_DIR
sudo chown -R $USER:$USER $DEPLOY_DIR

# Copie des fichiers
log "Copie des fichiers frontend..."
cp -r /home/ubuntu/eurogenius/frontend/public/* $DEPLOY_DIR/

# Configuration de Nginx
log "Configuration de Nginx..."
sudo cp /home/ubuntu/eurogenius/deployment/nginx/eurogenius.conf $NGINX_CONF
sudo ln -sf $NGINX_CONF $NGINX_ENABLED

# Vérification de la configuration Nginx
log "Vérification de la configuration Nginx..."
sudo nginx -t || error "La configuration Nginx est invalide. Veuillez vérifier le fichier de configuration."

# Redémarrage de Nginx
log "Redémarrage de Nginx..."
sudo systemctl restart nginx || error "Impossible de redémarrer Nginx."

# Configuration du domaine (simulation)
log "Configuration du domaine (simulation)..."
echo "Pour un déploiement réel, vous devriez configurer les enregistrements DNS suivants :"
echo "A     $DOMAIN       <IP_DU_SERVEUR>"
echo "CNAME www.$DOMAIN   $DOMAIN"

# Configuration de Let's Encrypt (simulation)
log "Configuration de Let's Encrypt (simulation)..."
echo "Pour un déploiement réel, vous devriez exécuter la commande suivante :"
echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"

# Déploiement terminé
log "Déploiement terminé avec succès !"
log "L'application est maintenant accessible à l'adresse : https://$DOMAIN"
log "Pour un déploiement réel, n'oubliez pas de configurer les DNS et d'obtenir un certificat SSL."

# Vérification du déploiement
log "Vérification du déploiement..."
if [ -f "$DEPLOY_DIR/index.html" ]; then
  log "Le fichier index.html a été correctement déployé."
else
  warn "Le fichier index.html n'a pas été trouvé dans le répertoire de déploiement."
fi

if [ -f "$DEPLOY_DIR/styles/main.min.css" ]; then
  log "Les styles CSS ont été correctement déployés."
else
  warn "Les styles CSS n'ont pas été trouvés dans le répertoire de déploiement."
fi

if [ -f "$DEPLOY_DIR/scripts/main.min.js" ]; then
  log "Les scripts JS ont été correctement déployés."
else
  warn "Les scripts JS n'ont pas été trouvés dans le répertoire de déploiement."
fi

log "Pour un déploiement permanent, vous devez :"
log "1. Configurer les enregistrements DNS pour votre domaine"
log "2. Obtenir un certificat SSL avec Let's Encrypt"
log "3. Configurer un service de surveillance pour votre application"
log "4. Mettre en place des sauvegardes régulières"

exit 0
