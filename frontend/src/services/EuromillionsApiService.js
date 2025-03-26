// API Service pour EuroMillions
// Ce service gère les appels API pour récupérer les données de tirage et les prédictions

import axios from 'axios';

// Configuration de base
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  mlBaseURL: process.env.REACT_APP_ML_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Instance Axios pour le backend
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
});

// Instance Axios pour le service ML
const mlApiClient = axios.create({
  baseURL: API_CONFIG.mlBaseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
});

// Données de secours en cas d'échec de l'API
const FALLBACK_DATA = {
  latestDraw: {
    date: '2025-03-25',
    numbers: [7, 12, 23, 34, 45],
    stars: [3, 9]
  },
  nextDraw: {
    date: '2025-03-28',
    jackpot: '130 000 000 €'
  }
};

// Service API EuroMillions
const EuromillionsApiService = {
  // Récupérer le dernier tirage
  getLatestDraw: async () => {
    try {
      const response = await apiClient.get('/api/draws/latest?n=1');
      if (response.data.status === 'success' && response.data.data.length > 0) {
        return response.data.data[0];
      }
      
      // Fallback vers le service ML si le backend échoue
      try {
        const mlResponse = await mlApiClient.get('/api/draws/latest?n=1');
        if (mlResponse.data.status === 'success' && mlResponse.data.data.length > 0) {
          return mlResponse.data.data[0];
        }
      } catch (mlError) {
        console.error('Erreur lors de la récupération du dernier tirage depuis le service ML:', mlError);
      }
      
      // Utilisation des données de secours
      return FALLBACK_DATA.latestDraw;
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier tirage:', error);
      return FALLBACK_DATA.latestDraw;
    }
  },
  
  // Récupérer les informations sur le prochain tirage
  getNextDraw: async () => {
    try {
      const response = await apiClient.get('/api/draws/next');
      if (response.data.status === 'success') {
        return response.data.data;
      }
      return FALLBACK_DATA.nextDraw;
    } catch (error) {
      console.error('Erreur lors de la récupération du prochain tirage:', error);
      return FALLBACK_DATA.nextDraw;
    }
  },
  
  // Récupérer l'historique des tirages
  getDrawHistory: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/api/draws/latest?n=${limit}`);
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      // Fallback vers le service ML si le backend échoue
      try {
        const mlResponse = await mlApiClient.get(`/api/draws/latest?n=${limit}`);
        if (mlResponse.data.status === 'success') {
          return mlResponse.data.data;
        }
      } catch (mlError) {
        console.error('Erreur lors de la récupération de l\'historique depuis le service ML:', mlError);
      }
      
      // Génération de données de secours
      return generateFallbackHistory(limit);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des tirages:', error);
      return generateFallbackHistory(limit);
    }
  },
  
  // Récupérer les statistiques
  getStatistics: async () => {
    try {
      const response = await apiClient.get('/api/statistics');
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      // Fallback vers le service ML si le backend échoue
      try {
        const mlResponse = await mlApiClient.get('/api/statistics');
        if (mlResponse.data.status === 'success') {
          return mlResponse.data.data;
        }
      } catch (mlError) {
        console.error('Erreur lors de la récupération des statistiques depuis le service ML:', mlError);
      }
      
      // Génération de statistiques de secours
      return generateFallbackStatistics();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return generateFallbackStatistics();
    }
  },
  
  // Générer des prédictions
  getPredictions: async (strategy = 'balanced', count = 5) => {
    try {
      const response = await apiClient.get(`/api/predictions?strategy=${strategy}&n=${count}`);
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      // Fallback vers le service ML si le backend échoue
      try {
        const mlResponse = await mlApiClient.get(`/api/predictions?strategy=${strategy}&n=${count}`);
        if (mlResponse.data.status === 'success') {
          return mlResponse.data.data;
        }
      } catch (mlError) {
        console.error('Erreur lors de la récupération des prédictions depuis le service ML:', mlError);
      }
      
      // Génération de prédictions de secours
      return generateFallbackPredictions(strategy, count);
    } catch (error) {
      console.error('Erreur lors de la récupération des prédictions:', error);
      return generateFallbackPredictions(strategy, count);
    }
  }
};

// Fonction pour générer un historique de secours
const generateFallbackHistory = (limit) => {
  const history = [];
  const baseDate = new Date('2025-03-25');
  
  for (let i = 0; i < limit; i++) {
    const drawDate = new Date(baseDate);
    drawDate.setDate(baseDate.getDate() - (i * 7)); // Un tirage par semaine
    
    history.push({
      date: drawDate.toISOString().split('T')[0],
      numbers: generateRandomNumbers(5, 50),
      stars: generateRandomNumbers(2, 12)
    });
  }
  
  return history;
};

// Fonction pour générer des statistiques de secours
const generateFallbackStatistics = () => {
  const numberFrequencies = {};
  const starFrequencies = {};
  const hotNumbers = [];
  const coldNumbers = [];
  const hotStars = [];
  const coldStars = [];
  
  // Génération des fréquences pour les numéros
  for (let i = 1; i <= 50; i++) {
    const frequency = Math.random() * 0.2 + 0.05; // Entre 5% et 25%
    const count = Math.floor(frequency * 1000);
    numberFrequencies[i] = {
      count,
      frequency: parseFloat(frequency.toFixed(4))
    };
    
    // Ajout aléatoire aux numéros chauds ou froids
    if (Math.random() > 0.8) {
      hotNumbers.push(i);
    } else if (Math.random() < 0.2) {
      coldNumbers.push(i);
    }
  }
  
  // Génération des fréquences pour les étoiles
  for (let i = 1; i <= 12; i++) {
    const frequency = Math.random() * 0.3 + 0.1; // Entre 10% et 40%
    const count = Math.floor(frequency * 1000);
    starFrequencies[i] = {
      count,
      frequency: parseFloat(frequency.toFixed(4))
    };
    
    // Ajout aléatoire aux étoiles chaudes ou froides
    if (Math.random() > 0.7) {
      hotStars.push(i);
    } else if (Math.random() < 0.3) {
      coldStars.push(i);
    }
  }
  
  return {
    number_frequencies: numberFrequencies,
    star_frequencies: starFrequencies,
    hot_numbers: hotNumbers,
    cold_numbers: coldNumbers,
    hot_stars: hotStars,
    cold_stars: coldStars
  };
};

// Fonction pour générer des prédictions de secours
const generateFallbackPredictions = (strategy, count) => {
  const combinations = [];
  
  for (let i = 0; i < count; i++) {
    combinations.push({
      numbers: generateRandomNumbers(5, 50),
      stars: generateRandomNumbers(2, 12),
      confidence: parseFloat((Math.random() * 0.5 + 0.3).toFixed(2)) // Entre 0.3 et 0.8
    });
  }
  
  return {
    strategy,
    combinations
  };
};

// Fonction utilitaire pour générer des nombres aléatoires uniques
const generateRandomNumbers = (count, max) => {
  const numbers = new Set();
  
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1);
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
};

export default EuromillionsApiService;
