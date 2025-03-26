const { Pool } = require('pg');
const dotenv = require('dotenv');

// Chargement des variables d'environnement
dotenv.config();

// Configuration de la connexion à la base de données
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'eurogenius',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Test de connexion à la base de données
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connexion à la base de données établie:', res.rows[0].now);
  }
});

// Fonction pour exécuter une requête SQL
const query = (text, params) => pool.query(text, params);

// Fonction pour obtenir un client du pool
const getClient = async () => {
  const client = await pool.connect();
  const query = (text, params) => client.query(text, params);
  const release = () => client.release();
  
  return { query, release };
};

module.exports = {
  query,
  getClient,
  pool,
};
