# Dockerfile pour le backend Node.js
FROM node:16-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers
COPY . .

# Exposition du port
EXPOSE 3001

# Commande de démarrage
CMD ["npm", "start"]
