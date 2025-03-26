// Contrôleur pour les prédictions EuroMillions
const axios = require('axios');
const config = require('../config/config');
const statisticsService = require('../services/statisticsService');

// API ML pour les prédictions
const mlApiClient = axios.create({
  baseURL: config.mlApiUrl || 'http://ml-service:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Obtenir des prédictions
exports.getPredictions = async (req, res) => {
  try {
    const strategy = req.query.strategy || 'balanced';
    const count = parseInt(req.query.n) || 5;
    
    // Validation des paramètres
    const validStrategies = ['balanced', 'statistical', 'hot', 'cold', 'rare'];
    if (!validStrategies.includes(strategy)) {
      return res.status(400).json({
        status: 'error',
        message: `Stratégie invalide. Valeurs acceptées: ${validStrategies.join(', ')}`
      });
    }
    
    if (count < 1 || count > 10) {
      return res.status(400).json({
        status: 'error',
        message: 'Le nombre de combinaisons doit être entre 1 et 10'
      });
    }
    
    // Essayer d'abord de récupérer depuis le service ML
    try {
      const response = await mlApiClient.get(`/api/predictions?strategy=${strategy}&n=${count}`);
      if (response.data.status === 'success') {
        return res.json(response.data);
      }
    } catch (mlError) {
      console.error('Erreur lors de la récupération des prédictions depuis le service ML:', mlError);
    }
    
    // En cas d'échec du service ML, générer des prédictions localement
    const combinations = await generateLocalPredictions(strategy, count);
    
    res.json({
      status: 'success',
      data: {
        strategy,
        combinations
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération des prédictions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la génération des prédictions'
    });
  }
};

// Générer une prédiction personnalisée
exports.generateCustomPrediction = async (req, res) => {
  try {
    const { preferences } = req.body;
    
    if (!preferences) {
      return res.status(400).json({
        status: 'error',
        message: 'Les préférences sont requises'
      });
    }
    
    // Validation des préférences
    const validPreferences = validatePreferences(preferences);
    if (!validPreferences.valid) {
      return res.status(400).json({
        status: 'error',
        message: validPreferences.message
      });
    }
    
    // Générer une prédiction personnalisée
    const combination = await generateCustomCombination(preferences);
    
    res.json({
      status: 'success',
      data: {
        combination
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération de la prédiction personnalisée:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la génération de la prédiction personnalisée'
    });
  }
};

// Fonction pour générer des prédictions localement
async function generateLocalPredictions(strategy, count) {
  const combinations = [];
  
  // Récupérer les statistiques pour les utiliser dans la génération
  const statistics = await statisticsService.calculateStatistics();
  
  for (let i = 0; i < count; i++) {
    let numbers = [];
    let stars = [];
    let confidence = 0;
    
    // Générer des combinaisons selon la stratégie
    switch (strategy) {
      case 'statistical':
        // Utiliser les numéros les plus fréquents
        numbers = selectTopFrequent(statistics.numberFrequencies, 5);
        stars = selectTopFrequent(statistics.starFrequencies, 2);
        confidence = 0.7 - (i * 0.05);
        break;
        
      case 'hot':
        // Utiliser les numéros "chauds"
        if (statistics.hotNumbers.length >= 5 && statistics.hotStars.length >= 2) {
          numbers = selectRandomFromArray(statistics.hotNumbers, 5);
          stars = selectRandomFromArray(statistics.hotStars, 2);
        } else {
          // Fallback si pas assez de numéros chauds
          numbers = selectTopFrequent(statistics.numberFrequencies, 5);
          stars = selectTopFrequent(statistics.starFrequencies, 2);
        }
        confidence = 0.65 - (i * 0.05);
        break;
        
      case 'cold':
        // Utiliser les numéros "froids"
        if (statistics.coldNumbers.length >= 5 && statistics.coldStars.length >= 2) {
          numbers = selectRandomFromArray(statistics.coldNumbers, 5);
          stars = selectRandomFromArray(statistics.coldStars, 2);
        } else {
          // Fallback si pas assez de numéros froids
          numbers = selectBottomFrequent(statistics.numberFrequencies, 5);
          stars = selectBottomFrequent(statistics.starFrequencies, 2);
        }
        confidence = 0.5 - (i * 0.05);
        break;
        
      case 'rare':
        // Générer une combinaison rare
        numbers = generateRareCombination(statistics.numberFrequencies, 5);
        stars = generateRareCombination(statistics.starFrequencies, 2);
        confidence = 0.4 - (i * 0.05);
        break;
        
      default: // 'balanced'
        // Mélange de différentes stratégies
        if (i % 3 === 0) {
          // Stratégie statistique
          numbers = selectTopFrequent(statistics.numberFrequencies, 5);
          stars = selectTopFrequent(statistics.starFrequencies, 2);
          confidence = 0.7 - (i * 0.03);
        } else if (i % 3 === 1) {
          // Stratégie numéros chauds
          if (statistics.hotNumbers.length >= 5 && statistics.hotStars.length >= 2) {
            numbers = selectRandomFromArray(statistics.hotNumbers, 5);
            stars = selectRandomFromArray(statistics.hotStars, 2);
          } else {
            numbers = selectTopFrequent(statistics.numberFrequencies, 5);
            stars = selectTopFrequent(statistics.starFrequencies, 2);
          }
          confidence = 0.65 - (i * 0.03);
        } else {
          // Stratégie mixte
          numbers = generateMixedCombination(statistics, 5);
          stars = generateMixedCombination(statistics, 2, true);
          confidence = 0.6 - (i * 0.03);
        }
    }
    
    combinations.push({
      numbers: numbers.sort((a, b) => a - b),
      stars: stars.sort((a, b) => a - b),
      confidence: parseFloat(confidence.toFixed(2))
    });
  }
  
  return combinations;
}

// Fonction pour générer une combinaison personnalisée
async function generateCustomCombination(preferences) {
  const { includeNumbers, excludeNumbers, includeStars, excludeStars, strategy } = preferences;
  
  // Récupérer les statistiques
  const statistics = await statisticsService.calculateStatistics();
  
  // Générer les numéros
  let numbers = [];
  let remainingCount = 5 - (includeNumbers ? includeNumbers.length : 0);
  
  if (remainingCount > 0) {
    // Filtrer les numéros disponibles
    let availableNumbers = Array.from({ length: 50 }, (_, i) => i + 1);
    
    if (includeNumbers && includeNumbers.length > 0) {
      availableNumbers = availableNumbers.filter(n => !includeNumbers.includes(n));
    }
    
    if (excludeNumbers && excludeNumbers.length > 0) {
      availableNumbers = availableNumbers.filter(n => !excludeNumbers.includes(n));
    }
    
    // Sélectionner les numéros selon la stratégie
    let selectedNumbers = [];
    
    switch (strategy) {
      case 'statistical':
        selectedNumbers = selectTopFrequentFromArray(statistics.numberFrequencies, availableNumbers, remainingCount);
        break;
      case 'hot':
        const hotAvailable = statistics.hotNumbers.filter(n => availableNumbers.includes(n));
        if (hotAvailable.length >= remainingCount) {
          selectedNumbers = selectRandomFromArray(hotAvailable, remainingCount);
        } else {
          selectedNumbers = selectTopFrequentFromArray(statistics.numberFrequencies, availableNumbers, remainingCount);
        }
        break;
      case 'cold':
        const coldAvailable = statistics.coldNumbers.filter(n => availableNumbers.includes(n));
        if (coldAvailable.length >= remainingCount) {
          selectedNumbers = selectRandomFromArray(coldAvailable, remainingCount);
        } else {
          selectedNumbers = selectBottomFrequentFromArray(statistics.numberFrequencies, availableNumbers, remainingCount);
        }
        break;
      case 'rare':
        selectedNumbers = generateRareCombinationFromArray(statistics.numberFrequencies, availableNumbers, remainingCount);
        break;
      default: // 'balanced'
        selectedNumbers = generateMixedCombinationFromArray(statistics, availableNumbers, remainingCount);
    }
    
    // Combiner avec les numéros inclus
    numbers = [...(includeNumbers || []), ...selectedNumbers];
  } else {
    numbers = [...includeNumbers];
  }
  
  // Générer les étoiles
  let stars = [];
  let remainingStarsCount = 2 - (includeStars ? includeStars.length : 0);
  
  if (remainingStarsCount > 0) {
    // Filtrer les étoiles disponibles
    let availableStars = Array.from({ length: 12 }, (_, i) => i + 1);
    
    if (includeStars && includeStars.length > 0) {
      availableStars = availableStars.filter(s => !includeStars.includes(s));
    }
    
    if (excludeStars && excludeStars.length > 0) {
      availableStars = availableStars.filter(s => !excludeStars.includes(s));
    }
    
    // Sélectionner les étoiles selon la stratégie
    let selectedStars = [];
    
    switch (strategy) {
      case 'statistical':
        selectedStars = selectTopFrequentFromArray(statistics.starFrequencies, availableStars, remainingStarsCount);
        break;
      case 'hot':
        const hotAvailable = statistics.hotStars.filter(s => availableStars.includes(s));
        if (hotAvailable.length >= remainingStarsCount) {
          selectedStars = selectRandomFromArray(hotAvailable, remainingStarsCount);
        } else {
          selectedStars = selectTopFrequentFromArray(statistics.starFrequencies, availableStars, remainingStarsCount);
        }
        break;
      case 'cold':
        const coldAvailable = statistics.coldStars.filter(s => availableStars.includes(s));
        if (coldAvailable.length >= remainingStarsCount) {
          selectedStars = selectRandomFromArray(coldAvailable, remainingStarsCount);
        } else {
          selectedStars = selectBottomFrequentFromArray(statistics.starFrequencies, availableStars, remainingStarsCount);
        }
        break;
      case 'rare':
        selectedStars = generateRareCombinationFromArray(statistics.starFrequencies, availableStars, remainingStarsCount);
        break;
      default: // 'balanced'
        selectedStars = generateMixedCombinationFromArray(statistics, availableStars, remainingStarsCount, true);
    }
    
    // Combiner avec les étoiles incluses
    stars = [...(includeStars || []), ...selectedStars];
  } else {
    stars = [...includeStars];
  }
  
  // Calculer le score de confiance
  let confidence = 0;
  switch (strategy) {
    case 'statistical':
      confidence = 0.7;
      break;
    case 'hot':
      confidence = 0.65;
      break;
    case 'cold':
      confidence = 0.5;
      break;
    case 'rare':
      confidence = 0.4;
      break;
    default: // 'balanced'
      confidence = 0.6;
  }
  
  return {
    numbers: numbers.sort((a, b) => a - b),
    stars: stars.sort((a, b) => a - b),
    confidence: parseFloat(confidence.toFixed(2))
  };
}

// Fonction pour valider les préférences
function validatePreferences(preferences) {
  const { includeNumbers, excludeNumbers, includeStars, excludeStars, strategy } = preferences;
  
  // Vérifier la stratégie
  const validStrategies = ['balanced', 'statistical', 'hot', 'cold', 'rare'];
  if (strategy && !validStrategies.includes(strategy)) {
    return {
      valid: false,
      message: `Stratégie invalide. Valeurs acceptées: ${validStrategies.join(', ')}`
    };
  }
  
  // Vérifier les numéros inclus
  if (includeNumbers) {
    if (!Array.isArray(includeNumbers)) {
      return {
        valid: false,
        message: 'includeNumbers doit être un tableau'
      };
    }
    
    if (includeNumbers.length > 5) {
      return {
        valid: false,
        message: 'Vous ne pouvez pas inclure plus de 5 numéros'
      };
    }
    
    for (const num of includeNumbers) {
      if (!Number.isInteger(num) || num < 1 || num > 50) {
        return {
          valid: false,
          message: 'Les numéros doivent être des entiers entre 1 et 50'
        };
      }
    }
    
    // Vérifier les doublons
    if (new Set(includeNumbers).size !== includeNumbers.length) {
      return {
        valid: false,
        message: 'Les numéros inclus ne doivent pas contenir de doublons'
      };
    }
  }
  
  // Vérifier les numéros exclus
  if (excludeNumbers) {
    if (!Array.isArray(excludeNumbers)) {
      return {
        valid: false,
        message: 'excludeNumbers doit être un tableau'
      };
    }
    
    for (const num of excludeNumbers) {
      if (!Number.isInteger(num) || num < 1 || num > 50) {
        return {
          valid: false,
          message: 'Les numéros doivent être des entiers entre 1 et 50'
        };
      }
    }
    
    // Vérifier les doublons
    if (new Set(excludeNumbers).size !== excludeNumbers.length) {
      return {
        valid: false,
        message: 'Les numéros exclus ne doivent pas contenir de doublons'
      };
    }
    
    // Vérifier les conflits avec les numéros inclus
    if (includeNumbers) {
      for (const num of includeNumbers) {
        if (excludeNumbers.includes(num)) {
          return {
            valid: false,
            message: 'Un numéro ne peut pas être à la fois inclus et exclu'
          };
        }
      }
    }
    
    // Vérifier qu'il reste assez de numéros disponibles
    const remainingNumbers = 50 - excludeNumbers.length;
    const requiredNumbers = 5 - (includeNumbers ? includeNumbers.length : 0);
    
    if (remainingNumbers < requiredNumbers) {
      return {
        valid: false,
        message: `Trop de numéros exclus. Il doit rester au moins ${requiredNumbers} numéros disponibles.`
      };
    }
  }
  
  // Vérifier les étoiles incluses
  if (includeStars) {
    if (!Array.isArray(includeStars)) {
      return {
        valid: false,
        message: 'includeStars doit être un tableau'
      };
    }
    
    if (includeStars.length > 2) {
      return {
        valid: false,
        message: 'Vous ne pouvez pas inclure plus de 2 étoiles'
      };
    }
    
    for (const star of includeStars) {
      if (!Number.isInteger(star) || star < 1 || star > 12) {
        return {
          valid: false,
          message: 'Les étoiles doivent être des entiers entre 1 et 12'
        };
      }
    }
    
    // Vérifier les doublons
    if (new Set(includeStars).size !== includeStars.length) {
      return {
        valid: false,
        message: 'Les étoiles incluses ne doivent pas contenir de doublons'
      };
    }
  }
  
  // Vérifier les étoiles exclues
  if (excludeStars) {
    if (!Array.isArray(excludeStars)) {
      return {
        valid: false,
        message: 'excludeStars doit être un tableau'
      };
    }
    
    for (const star of excludeStars) {
      if (!Number.isInteger(star) || star < 1 || star > 12) {
        return {
          valid: false,
          message: 'Les étoiles doivent être des entiers entre 1 et 12'
        };
      }
    }
    
    // Vérifier les doublons
    if (new Set(excludeStars).size !== excludeStars.length) {
      return {
        valid: false,
        message: 'Les étoiles exclues ne doivent pas contenir de doublons'
      };
    }
    
    // Vérifier les conflits avec les étoiles incluses
    if (includeStars) {
      for (const star of includeStars) {
        if (excludeStars.includes(star)) {
          return {
            valid: false,
            message: 'Une étoile ne peut pas être à la fois incluse et exclue'
          };
        }
      }
    }
    
    // Vérifier qu'il reste assez d'étoiles disponibles
    const remainingStars = 12 - excludeStars.length;
    const requiredStars = 2 - (includeStars ? includeStars.length : 0);
    
    if (remainingStars < requiredStars) {
      return {
        valid: false,
        message: `Trop d'étoiles exclues. Il doit rester au moins ${requiredStars} étoiles disponibles.`
      };
    }
  }
  
  return { valid: true };
}

// Fonctions utilitaires pour la génération de combinaisons

// Sélectionner les éléments les plus fréquents
function selectTopFrequent(frequencies, count) {
  const sorted = Object.entries(frequencies)
    .sort((a, b) => b[1].frequency - a[1].frequency)
    .map(entry => parseInt(entry[0]));
  
  return sorted.slice(0, count);
}

// Sélectionner les éléments les moins fréquents
function selectBottomFrequent(frequencies, count) {
  const sorted = Object.entries(frequencies)
    .sort((a, b) => a[1].frequency - b[1].frequency)
    .map(entry => parseInt(entry[0]));
  
  return sorted.slice(0, count);
}

// Sélectionner aléatoirement des éléments d'un tableau
function selectRandomFromArray(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Sélectionner les éléments les plus fréquents parmi un sous-ensemble
function selectTopFrequentFromArray(frequencies, array, count) {
  const sorted = array
    .map(num => [num, frequencies[num] ? frequencies[num].frequency : 0])
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return sorted.slice(0, count);
}

// Sélectionner les éléments les moins fréquents parmi un sous-ensemble
function selectBottomFrequentFromArray(frequencies, array, count) {
  const sorted = array
    .map(num => [num, frequencies[num] ? frequencies[num].frequency : 0])
    .sort((a, b) => a[1] - b[1])
    .map(entry => entry[0]);
  
  return sorted.slice(0, count);
}

// Générer une combinaison rare
function generateRareCombination(frequencies, count) {
  // Sélectionner des numéros avec une faible fréquence
  return selectBottomFrequent(frequencies, count);
}

// Générer une combinaison rare à partir d'un sous-ensemble
function generateRareCombinationFromArray(frequencies, array, count) {
  return selectBottomFrequentFromArray(frequencies, array, count);
}

// Générer une combinaison mixte
function generateMixedCombination(statistics, count, isStars = false) {
  const result = [];
  const max = isStars ? 12 : 50;
  
  // Mélange de numéros chauds et froids
  const hotPool = isStars ? statistics.hotStars : statistics.hotNumbers;
  const coldPool = isStars ? statistics.coldStars : statistics.coldNumbers;
  const frequencies = isStars ? statistics.starFrequencies : statistics.numberFrequencies;
  
  // Sélectionner quelques numéros chauds
  const hotCount = Math.min(Math.ceil(count / 2), hotPool.length);
  if (hotCount > 0) {
    const selectedHot = selectRandomFromArray(hotPool, hotCount);
    result.push(...selectedHot);
  }
  
  // Compléter avec des numéros aléatoires
  const remaining = count - result.length;
  if (remaining > 0) {
    // Créer un pool de numéros disponibles
    const availableNumbers = Array.from({ length: max }, (_, i) => i + 1)
      .filter(num => !result.includes(num));
    
    // Sélectionner aléatoirement
    const selected = selectRandomFromArray(availableNumbers, remaining);
    result.push(...selected);
  }
  
  return result;
}

// Générer une combinaison mixte à partir d'un sous-ensemble
function generateMixedCombinationFromArray(statistics, array, count, isStars = false) {
  if (array.length <= count) {
    return array;
  }
  
  const result = [];
  const hotPool = isStars ? statistics.hotStars : statistics.hotNumbers;
  const frequencies = isStars ? statistics.starFrequencies : statistics.numberFrequencies;
  
  // Filtrer les numéros chauds disponibles
  const availableHot = array.filter(num => hotPool.includes(num));
  
  // Sélectionner quelques numéros chauds
  const hotCount = Math.min(Math.ceil(count / 2), availableHot.length);
  if (hotCount > 0) {
    const selectedHot = selectRandomFromArray(availableHot, hotCount);
    result.push(...selectedHot);
  }
  
  // Compléter avec des numéros aléatoires
  const remaining = count - result.length;
  if (remaining > 0) {
    // Créer un pool de numéros disponibles
    const availableNumbers = array.filter(num => !result.includes(num));
    
    // Sélectionner aléatoirement
    const selected = selectRandomFromArray(availableNumbers, remaining);
    result.push(...selected);
  }
  
  return result;
}
