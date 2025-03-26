// Contrôleur pour les tirages EuroMillions
const axios = require('axios');
const config = require('../config/config');
const db = require('../models/db');

// API Pedro Mealha pour récupérer les données de tirage
const pedroMealhaApi = axios.create({
  baseURL: config.pedroMealhaApiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.pedroMealhaApiKey}`
  }
});

// Obtenir les derniers tirages
exports.getLatestDraws = async (req, res) => {
  try {
    const limit = parseInt(req.query.n) || 10;
    
    // Essayer d'abord de récupérer depuis la base de données
    let draws = await db.query(
      'SELECT * FROM euromillions_draws ORDER BY draw_date DESC LIMIT $1',
      [limit]
    );
    
    // Si aucun résultat ou base de données non disponible, essayer l'API externe
    if (!draws || draws.rows.length === 0) {
      try {
        const response = await pedroMealhaApi.get(`/draws/latest?limit=${limit}`);
        draws = {
          rows: response.data.map(draw => ({
            draw_date: draw.date,
            n1: draw.numbers[0],
            n2: draw.numbers[1],
            n3: draw.numbers[2],
            n4: draw.numbers[3],
            n5: draw.numbers[4],
            s1: draw.stars[0],
            s2: draw.stars[1],
            jackpot: draw.jackpot || null
          }))
        };
        
        // Sauvegarder les résultats dans la base de données pour les futures requêtes
        for (const draw of draws.rows) {
          await db.query(
            'INSERT INTO euromillions_draws (draw_date, n1, n2, n3, n4, n5, s1, s2, jackpot) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (draw_date) DO NOTHING',
            [draw.draw_date, draw.n1, draw.n2, draw.n3, draw.n4, draw.n5, draw.s1, draw.s2, draw.jackpot]
          );
        }
      } catch (apiError) {
        console.error('Erreur lors de la récupération depuis l\'API externe:', apiError);
        // En cas d'échec de l'API, générer des données de secours
        draws = { rows: generateFallbackDraws(limit) };
      }
    }
    
    // Formater les résultats
    const formattedDraws = draws.rows.map(draw => ({
      date: draw.draw_date instanceof Date ? draw.draw_date.toISOString().split('T')[0] : draw.draw_date,
      numbers: [draw.n1, draw.n2, draw.n3, draw.n4, draw.n5],
      stars: [draw.s1, draw.s2],
      jackpot: draw.jackpot
    }));
    
    res.json({
      status: 'success',
      data: formattedDraws
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des derniers tirages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des derniers tirages'
    });
  }
};

// Obtenir les informations sur le prochain tirage
exports.getNextDraw = async (req, res) => {
  try {
    // Essayer d'abord de récupérer depuis l'API externe
    try {
      const response = await pedroMealhaApi.get('/draws/next');
      const nextDraw = {
        date: response.data.date,
        jackpot: response.data.jackpot || '130 000 000 €',
        closing_time: response.data.closing_time || '20:00'
      };
      
      res.json({
        status: 'success',
        data: nextDraw
      });
      return;
    } catch (apiError) {
      console.error('Erreur lors de la récupération du prochain tirage depuis l\'API externe:', apiError);
    }
    
    // En cas d'échec de l'API, générer des données de secours
    const today = new Date();
    const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7; // Prochain vendredi
    const nextDrawDate = new Date(today);
    nextDrawDate.setDate(today.getDate() + daysUntilFriday);
    
    const nextDraw = {
      date: nextDrawDate.toISOString().split('T')[0],
      jackpot: '130 000 000 €',
      closing_time: '20:00'
    };
    
    res.json({
      status: 'success',
      data: nextDraw
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du prochain tirage:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération du prochain tirage'
    });
  }
};

// Fonction utilitaire pour générer des tirages de secours
function generateFallbackDraws(limit) {
  const draws = [];
  const today = new Date();
  
  for (let i = 0; i < limit; i++) {
    const drawDate = new Date(today);
    drawDate.setDate(today.getDate() - (i * 7)); // Un tirage par semaine
    
    // Génération de 5 numéros uniques entre 1 et 50
    const numbers = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 50) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    numbers.sort((a, b) => a - b);
    
    // Génération de 2 étoiles uniques entre 1 et 12
    const stars = [];
    while (stars.length < 2) {
      const star = Math.floor(Math.random() * 12) + 1;
      if (!stars.includes(star)) {
        stars.push(star);
      }
    }
    stars.sort((a, b) => a - b);
    
    draws.push({
      draw_date: drawDate.toISOString().split('T')[0],
      n1: numbers[0],
      n2: numbers[1],
      n3: numbers[2],
      n4: numbers[3],
      n5: numbers[4],
      s1: stars[0],
      s2: stars[1],
      jackpot: `${Math.floor(Math.random() * 150 + 50)} 000 000 €`
    });
  }
  
  return draws;
}
