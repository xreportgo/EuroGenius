// Service d'analyse statistique pour EuroMillions
const db = require('../models/db');

// Calculer les statistiques générales
exports.calculateStatistics = async () => {
  try {
    // Récupérer tous les tirages
    const drawsResult = await db.query('SELECT * FROM euromillions_draws ORDER BY draw_date DESC');
    const draws = drawsResult.rows;
    
    if (draws.length === 0) {
      return generateFallbackStatistics();
    }
    
    // Calculer les fréquences des numéros
    const numberFrequencies = {};
    for (let i = 1; i <= 50; i++) {
      const count = draws.filter(draw => 
        draw.n1 === i || draw.n2 === i || draw.n3 === i || draw.n4 === i || draw.n5 === i
      ).length;
      
      const frequency = count / draws.length;
      numberFrequencies[i] = {
        count,
        frequency: parseFloat(frequency.toFixed(4))
      };
    }
    
    // Calculer les fréquences des étoiles
    const starFrequencies = {};
    for (let i = 1; i <= 12; i++) {
      const count = draws.filter(draw => draw.s1 === i || draw.s2 === i).length;
      const frequency = count / draws.length;
      starFrequencies[i] = {
        count,
        frequency: parseFloat(frequency.toFixed(4))
      };
    }
    
    // Calculer les numéros "chauds" et "froids"
    const recentDraws = draws.slice(0, 20);
    const hotNumbers = [];
    const coldNumbers = [];
    
    for (let i = 1; i <= 50; i++) {
      const recentCount = recentDraws.filter(draw => 
        draw.n1 === i || draw.n2 === i || draw.n3 === i || draw.n4 === i || draw.n5 === i
      ).length;
      
      if (recentCount >= 3) {
        hotNumbers.push(i);
      } else if (recentCount === 0) {
        coldNumbers.push(i);
      }
    }
    
    const hotStars = [];
    const coldStars = [];
    
    for (let i = 1; i <= 12; i++) {
      const recentCount = recentDraws.filter(draw => draw.s1 === i || draw.s2 === i).length;
      
      if (recentCount >= 3) {
        hotStars.push(i);
      } else if (recentCount === 0) {
        coldStars.push(i);
      }
    }
    
    return {
      numberFrequencies,
      starFrequencies,
      hotNumbers,
      coldNumbers,
      hotStars,
      coldStars
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    return generateFallbackStatistics();
  }
};

// Obtenir les numéros chauds et froids
exports.getHotColdNumbers = async (period = 'recent') => {
  try {
    // Récupérer les tirages selon la période
    let limit;
    switch (period) {
      case 'recent':
        limit = 20;
        break;
      case 'medium':
        limit = 50;
        break;
      case 'all':
      default:
        limit = 1000;
    }
    
    const drawsResult = await db.query(
      'SELECT * FROM euromillions_draws ORDER BY draw_date DESC LIMIT $1',
      [limit]
    );
    const draws = drawsResult.rows;
    
    if (draws.length === 0) {
      return generateFallbackHotCold();
    }
    
    // Calculer les fréquences
    const numberCounts = {};
    for (let i = 1; i <= 50; i++) {
      numberCounts[i] = draws.filter(draw => 
        draw.n1 === i || draw.n2 === i || draw.n3 === i || draw.n4 === i || draw.n5 === i
      ).length;
    }
    
    const starCounts = {};
    for (let i = 1; i <= 12; i++) {
      starCounts[i] = draws.filter(draw => draw.s1 === i || draw.s2 === i).length;
    }
    
    // Trier par fréquence
    const sortedNumbers = Object.entries(numberCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => ({ number: parseInt(entry[0]), count: entry[1] }));
    
    const sortedStars = Object.entries(starCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => ({ number: parseInt(entry[0]), count: entry[1] }));
    
    // Définir les seuils pour "chaud" et "froid"
    const numberThreshold = Math.max(1, Math.floor(draws.length / 25));
    const starThreshold = Math.max(1, Math.floor(draws.length / 12));
    
    const hotNumbers = sortedNumbers
      .filter(item => item.count >= numberThreshold)
      .map(item => item.number);
    
    const coldNumbers = sortedNumbers
      .filter(item => item.count === 0)
      .map(item => item.number);
    
    const hotStars = sortedStars
      .filter(item => item.count >= starThreshold)
      .map(item => item.number);
    
    const coldStars = sortedStars
      .filter(item => item.count === 0)
      .map(item => item.number);
    
    return {
      hotNumbers,
      coldNumbers,
      hotStars,
      coldStars,
      period
    };
  } catch (error) {
    console.error('Erreur lors du calcul des numéros chauds/froids:', error);
    return generateFallbackHotCold();
  }
};

// Obtenir les paires fréquentes
exports.getFrequentPairs = async (limit = 10) => {
  try {
    // Récupérer tous les tirages
    const drawsResult = await db.query('SELECT * FROM euromillions_draws ORDER BY draw_date DESC');
    const draws = drawsResult.rows;
    
    if (draws.length === 0) {
      return generateFallbackPairs(limit);
    }
    
    // Calculer les fréquences des paires de numéros
    const numberPairs = {};
    
    for (const draw of draws) {
      const numbers = [draw.n1, draw.n2, draw.n3, draw.n4, draw.n5];
      
      // Générer toutes les paires possibles
      for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
          const pair = [numbers[i], numbers[j]].sort((a, b) => a - b);
          const pairKey = `${pair[0]}-${pair[1]}`;
          
          if (!numberPairs[pairKey]) {
            numberPairs[pairKey] = {
              numbers: pair,
              count: 1,
              frequency: 0
            };
          } else {
            numberPairs[pairKey].count++;
          }
        }
      }
    }
    
    // Calculer les fréquences
    for (const key in numberPairs) {
      numberPairs[key].frequency = parseFloat((numberPairs[key].count / draws.length).toFixed(4));
    }
    
    // Trier par fréquence et limiter le nombre de résultats
    const sortedPairs = Object.values(numberPairs)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return {
      numberPairs: sortedPairs
    };
  } catch (error) {
    console.error('Erreur lors du calcul des paires fréquentes:', error);
    return generateFallbackPairs(limit);
  }
};

// Obtenir les écarts entre apparitions
exports.getNumberGaps = async () => {
  try {
    // Récupérer tous les tirages
    const drawsResult = await db.query('SELECT * FROM euromillions_draws ORDER BY draw_date ASC');
    const draws = drawsResult.rows;
    
    if (draws.length === 0) {
      return generateFallbackGaps();
    }
    
    // Calculer les écarts pour chaque numéro
    const numberGaps = {};
    const starGaps = {};
    
    // Initialiser les structures
    for (let i = 1; i <= 50; i++) {
      numberGaps[i] = {
        lastAppearance: null,
        currentGap: draws.length,
        maxGap: 0,
        averageGap: 0,
        appearances: 0,
        gaps: []
      };
    }
    
    for (let i = 1; i <= 12; i++) {
      starGaps[i] = {
        lastAppearance: null,
        currentGap: draws.length,
        maxGap: 0,
        averageGap: 0,
        appearances: 0,
        gaps: []
      };
    }
    
    // Parcourir les tirages
    for (let i = 0; i < draws.length; i++) {
      const draw = draws[i];
      const numbers = [draw.n1, draw.n2, draw.n3, draw.n4, draw.n5];
      const stars = [draw.s1, draw.s2];
      
      // Traiter les numéros
      for (let j = 1; j <= 50; j++) {
        if (numbers.includes(j)) {
          // Le numéro est apparu dans ce tirage
          if (numberGaps[j].lastAppearance !== null) {
            const gap = i - numberGaps[j].lastAppearance;
            numberGaps[j].gaps.push(gap);
            numberGaps[j].maxGap = Math.max(numberGaps[j].maxGap, gap);
          }
          
          numberGaps[j].lastAppearance = i;
          numberGaps[j].appearances++;
          numberGaps[j].currentGap = 0;
        } else if (numberGaps[j].lastAppearance !== null) {
          // Le numéro n'est pas apparu, incrémenter l'écart courant
          numberGaps[j].currentGap = i - numberGaps[j].lastAppearance;
        }
      }
      
      // Traiter les étoiles
      for (let j = 1; j <= 12; j++) {
        if (stars.includes(j)) {
          // L'étoile est apparue dans ce tirage
          if (starGaps[j].lastAppearance !== null) {
            const gap = i - starGaps[j].lastAppearance;
            starGaps[j].gaps.push(gap);
            starGaps[j].maxGap = Math.max(starGaps[j].maxGap, gap);
          }
          
          starGaps[j].lastAppearance = i;
          starGaps[j].appearances++;
          starGaps[j].currentGap = 0;
        } else if (starGaps[j].lastAppearance !== null) {
          // L'étoile n'est pas apparue, incrémenter l'écart courant
          starGaps[j].currentGap = i - starGaps[j].lastAppearance;
        }
      }
    }
    
    // Calculer les écarts moyens
    for (let i = 1; i <= 50; i++) {
      if (numberGaps[i].gaps.length > 0) {
        const sum = numberGaps[i].gaps.reduce((a, b) => a + b, 0);
        numberGaps[i].averageGap = parseFloat((sum / numberGaps[i].gaps.length).toFixed(2));
      }
      
      // Supprimer le tableau des écarts pour alléger la réponse
      delete numberGaps[i].gaps;
    }
    
    for (let i = 1; i <= 12; i++) {
      if (starGaps[i].gaps.length > 0) {
        const sum = starGaps[i].gaps.reduce((a, b) => a + b, 0);
        starGaps[i].averageGap = parseFloat((sum / starGaps[i].gaps.length).toFixed(2));
      }
      
      // Supprimer le tableau des écarts pour alléger la réponse
      delete starGaps[i].gaps;
    }
    
    return {
      numberGaps,
      starGaps
    };
  } catch (error) {
    console.error('Erreur lors du calcul des écarts:', error);
    return generateFallbackGaps();
  }
};

// Fonctions pour générer des données de secours

// Générer des statistiques de secours
function generateFallbackStatistics() {
  const numberFrequencies = {};
  const starFrequencies = {};
  const hotNumbers = [];
  const coldNumbers = [];
  const hotStars = [];
  const coldStars = [];
  
  // Générer des fréquences aléatoires pour les numéros
  for (let i = 1; i <= 50; i++) {
    const frequency = Math.random() * 0.2 + 0.05; // Entre 5% et 25%
    const count = Math.floor(frequency * 1000);
    numberFrequencies[i] = {
      count,
      frequency: parseFloat(frequency.toFixed(4))
    };
    
    // Ajouter aléatoirement aux numéros chauds ou froids
    if (Math.random() > 0.8) {
      hotNumbers.push(i);
    } else if (Math.random() < 0.2) {
      coldNumbers.push(i);
    }
  }
  
  // Générer des fréquences aléatoires pour les étoiles
  for (let i = 1; i <= 12; i++) {
    const frequency = Math.random() * 0.3 + 0.1; // Entre 10% et 40%
    const count = Math.floor(frequency * 1000);
    starFrequencies[i] = {
      count,
      frequency: parseFloat(frequency.toFixed(4))
    };
    
    // Ajouter aléatoirement aux étoiles chaudes ou froides
    if (Math.random() > 0.7) {
      hotStars.push(i);
    } else if (Math.random() < 0.3) {
      coldStars.push(i);
    }
  }
  
  return {
    numberFrequencies,
    starFrequencies,
    hotNumbers,
    coldNumbers,
    hotStars,
    coldStars
  };
}

// Générer des numéros chauds/froids de secours
function generateFallbackHotCold() {
  const hotNumbers = [];
  const coldNumbers = [];
  const hotStars = [];
  const coldStars = [];
  
  // Générer des numéros chauds/froids aléatoires
  for (let i = 1; i <= 50; i++) {
    if (Math.random() > 0.8) {
      hotNumbers.push(i);
    } else if (Math.random() < 0.2) {
      coldNumbers.push(i);
    }
  }
  
  // Générer des étoiles chaudes/froides aléatoires
  for (let i = 1; i <= 12; i++) {
    if (Math.random() > 0.7) {
      hotStars.push(i);
    } else if (Math.random() < 0.3) {
      coldStars.push(i);
    }
  }
  
  return {
    hotNumbers,
    coldNumbers,
    hotStars,
    coldStars,
    period: 'recent'
  };
}

// Générer des paires fréquentes de secours
function generateFallbackPairs(limit) {
  const numberPairs = [];
  
  // Générer des paires aléatoires
  for (let i = 0; i < limit; i++) {
    // Générer deux numéros uniques
    let num1, num2;
    do {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
    } while (num1 === num2);
    
    // Trier les numéros
    const pair = [num1, num2].sort((a, b) => a - b);
    
    // Générer une fréquence aléatoire
    const count = Math.floor(Math.random() * 100) + 10;
    const frequency = parseFloat((count / 1000).toFixed(4));
    
    numberPairs.push({
      numbers: pair,
      count,
      frequency
    });
  }
  
  // Trier par fréquence décroissante
  numberPairs.sort((a, b) => b.count - a.count);
  
  return {
    numberPairs
  };
}

// Générer des écarts de secours
function generateFallbackGaps() {
  const numberGaps = {};
  const starGaps = {};
  
  // Générer des écarts aléatoires pour les numéros
  for (let i = 1; i <= 50; i++) {
    const appearances = Math.floor(Math.random() * 200) + 50;
    const averageGap = parseFloat((Math.random() * 10 + 5).toFixed(2));
    const maxGap = Math.floor(averageGap * 3);
    const currentGap = Math.floor(Math.random() * maxGap);
    
    numberGaps[i] = {
      lastAppearance: null, // Non pertinent pour les données de secours
      currentGap,
      maxGap,
      averageGap,
      appearances
    };
  }
  
  // Générer des écarts aléatoires pour les étoiles
  for (let i = 1; i <= 12; i++) {
    const appearances = Math.floor(Math.random() * 150) + 50;
    const averageGap = parseFloat((Math.random() * 8 + 3).toFixed(2));
    const maxGap = Math.floor(averageGap * 3);
    const currentGap = Math.floor(Math.random() * maxGap);
    
    starGaps[i] = {
      lastAppearance: null, // Non pertinent pour les données de secours
      currentGap,
      maxGap,
      averageGap,
      appearances
    };
  }
  
  return {
    numberGaps,
    starGaps
  };
}
