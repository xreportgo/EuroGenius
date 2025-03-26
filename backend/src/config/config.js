// Configuration du backend
module.exports = {
  // Configuration de la base de données
  database: {
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'eurogenius'
  },
  
  // Configuration du serveur
  server: {
    port: process.env.PORT || 3001,
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  },
  
  // API externe Pedro Mealha
  pedroMealhaApiUrl: process.env.PEDRO_MEALHA_API_URL || 'https://api.pedromealha.com/euromillions',
  pedroMealhaApiKey: process.env.PEDRO_MEALHA_API_KEY || 'demo_key',
  
  // Service ML
  mlApiUrl: process.env.ML_API_URL || 'http://ml-service:5000'
}
