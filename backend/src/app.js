// Point d'entrée du backend EuroGenius
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('./config/config');
const apiRoutes = require('./routes/api');

// Initialisation de l'application Express
const app = express();
const port = config.server.port;

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors(config.server.cors));

// Logging des requêtes
app.use(morgan('dev'));

// Parsing du corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api', apiRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({
    name: 'EuroGenius API',
    version: '1.0.0',
    status: 'running'
  });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route non trouvée'
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Une erreur est survenue' 
      : err.message
  });
});

// Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur EuroGenius démarré sur le port ${port}`);
});

module.exports = app;
