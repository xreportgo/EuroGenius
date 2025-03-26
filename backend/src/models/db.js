// Modèle de base de données pour EuroGenius
const { Pool } = require('pg');
const config = require('../config/config');

// Création du pool de connexions PostgreSQL
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Vérification de la connexion à la base de données
pool.on('connect', () => {
  console.log('Connexion à la base de données PostgreSQL établie');
});

pool.on('error', (err) => {
  console.error('Erreur de connexion à la base de données PostgreSQL:', err);
});

// Fonction pour exécuter des requêtes SQL
const query = async (text, params) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Requête exécutée', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête:', error);
    
    // En mode développement, on peut retourner une erreur détaillée
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
    
    // En production, on retourne une erreur générique
    throw new Error('Erreur de base de données');
  }
};

module.exports = {
  query,
  pool
};
