/**
 * Contrôleur pour les analyses statistiques
 * Ce contrôleur expose les endpoints API pour les fonctionnalités d'analyse statistique
 */

const statisticsService = require('../services/statisticsService');

/**
 * Récupère les fréquences des numéros
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getNumberFrequencies(req, res) {
  try {
    const frequencies = await statisticsService.getNumberFrequencies();
    res.json({
      success: true,
      data: frequencies
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getNumberFrequencies:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des fréquences des numéros',
      error: error.message
    });
  }
}

/**
 * Récupère les fréquences des étoiles
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getStarFrequencies(req, res) {
  try {
    const frequencies = await statisticsService.getStarFrequencies();
    res.json({
      success: true,
      data: frequencies
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getStarFrequencies:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des fréquences des étoiles',
      error: error.message
    });
  }
}

/**
 * Récupère les paires de numéros les plus fréquentes
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getMostFrequentPairs(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const pairs = await statisticsService.getMostFrequentPairs(limit);
    res.json({
      success: true,
      data: pairs
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getMostFrequentPairs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paires fréquentes',
      error: error.message
    });
  }
}

/**
 * Récupère les triplets de numéros les plus fréquents
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getMostFrequentTriplets(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const triplets = await statisticsService.getMostFrequentTriplets(limit);
    res.json({
      success: true,
      data: triplets
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getMostFrequentTriplets:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des triplets fréquents',
      error: error.message
    });
  }
}

/**
 * Récupère l'analyse des écarts pour les numéros
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getNumberGapAnalysis(req, res) {
  try {
    const analysis = await statisticsService.getNumberGapAnalysis();
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getNumberGapAnalysis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'analyse des écarts des numéros',
      error: error.message
    });
  }
}

/**
 * Récupère l'analyse des écarts pour les étoiles
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getStarGapAnalysis(req, res) {
  try {
    const analysis = await statisticsService.getStarGapAnalysis();
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getStarGapAnalysis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'analyse des écarts des étoiles',
      error: error.message
    });
  }
}

/**
 * Récupère les numéros chauds
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getHotNumbers(req, res) {
  try {
    const hotNumbers = await statisticsService.getHotNumbers();
    res.json({
      success: true,
      data: hotNumbers
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getHotNumbers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des numéros chauds',
      error: error.message
    });
  }
}

/**
 * Récupère les numéros froids
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getColdNumbers(req, res) {
  try {
    const coldNumbers = await statisticsService.getColdNumbers();
    res.json({
      success: true,
      data: coldNumbers
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getColdNumbers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des numéros froids',
      error: error.message
    });
  }
}

/**
 * Récupère les étoiles chaudes
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getHotStars(req, res) {
  try {
    const hotStars = await statisticsService.getHotStars();
    res.json({
      success: true,
      data: hotStars
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getHotStars:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des étoiles chaudes',
      error: error.message
    });
  }
}

/**
 * Récupère les étoiles froides
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getColdStars(req, res) {
  try {
    const coldStars = await statisticsService.getColdStars();
    res.json({
      success: true,
      data: coldStars
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getColdStars:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des étoiles froides',
      error: error.message
    });
  }
}

/**
 * Met à jour les statistiques après un nouveau tirage
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function updateStatisticsAfterDraw(req, res) {
  try {
    const tirage = req.body;
    
    // Validation basique des données du tirage
    if (!tirage || !tirage.id || !tirage.numero1 || !tirage.etoile1) {
      return res.status(400).json({
        success: false,
        message: 'Données de tirage invalides ou incomplètes'
      });
    }
    
    const success = await statisticsService.updateStatisticsAfterDraw(tirage);
    res.json({
      success: true,
      message: 'Statistiques mises à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur updateStatisticsAfterDraw:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des statistiques',
      error: error.message
    });
  }
}

/**
 * Génère une combinaison basée sur les statistiques
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function generateStatisticalCombination(req, res) {
  try {
    const strategy = req.query.strategy || 'balanced';
    
    // Validation de la stratégie
    const validStrategies = ['hot', 'cold', 'due', 'balanced'];
    if (!validStrategies.includes(strategy)) {
      return res.status(400).json({
        success: false,
        message: 'Stratégie invalide. Valeurs acceptées: hot, cold, due, balanced'
      });
    }
    
    const combination = await statisticsService.generateStatisticalCombination(strategy);
    res.json({
      success: true,
      data: combination
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur generateStatisticalCombination:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération de combinaison',
      error: error.message
    });
  }
}

/**
 * Récupère l'analyse de la distribution positionnelle
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getPositionalDistribution(req, res) {
  try {
    const distribution = await statisticsService.getPositionalDistribution();
    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getPositionalDistribution:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'analyse de la distribution positionnelle',
      error: error.message
    });
  }
}

/**
 * Récupère un tableau de bord statistique complet
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
async function getStatisticalDashboard(req, res) {
  try {
    // Récupération parallèle de toutes les données statistiques
    const [
      numberFrequencies,
      starFrequencies,
      hotNumbers,
      coldNumbers,
      hotStars,
      coldStars,
      numberGapAnalysis,
      starGapAnalysis,
      frequentPairs,
      frequentTriplets
    ] = await Promise.all([
      statisticsService.getNumberFrequencies(),
      statisticsService.getStarFrequencies(),
      statisticsService.getHotNumbers(),
      statisticsService.getColdNumbers(),
      statisticsService.getHotStars(),
      statisticsService.getColdStars(),
      statisticsService.getNumberGapAnalysis(),
      statisticsService.getStarGapAnalysis(),
      statisticsService.getMostFrequentPairs(10),
      statisticsService.getMostFrequentTriplets(10)
    ]);
    
    res.json({
      success: true,
      data: {
        numberFrequencies,
        starFrequencies,
        hotNumbers,
        coldNumbers,
        hotStars,
        coldStars,
        numberGapAnalysis,
        starGapAnalysis,
        frequentPairs,
        frequentTriplets
      }
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getStatisticalDashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du tableau de bord statistique',
      error: error.message
    });
  }
}

module.exports = {
  getNumberFrequencies,
  getStarFrequencies,
  getMostFrequentPairs,
  getMostFrequentTriplets,
  getNumberGapAnalysis,
  getStarGapAnalysis,
  getHotNumbers,
  getColdNumbers,
  getHotStars,
  getColdStars,
  updateStatisticsAfterDraw,
  generateStatisticalCombination,
  getPositionalDistribution,
  getStatisticalDashboard
};
