// Contrôleur pour les statistiques EuroMillions
const statisticsService = require('../services/statisticsService');

// Obtenir les statistiques générales
exports.getStatistics = async (req, res) => {
  try {
    const statistics = await statisticsService.calculateStatistics();
    res.json({
      status: 'success',
      data: statistics
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

// Obtenir les numéros chauds et froids
exports.getHotColdNumbers = async (req, res) => {
  try {
    const period = req.query.period || 'recent'; // recent, medium, all
    const hotColdNumbers = await statisticsService.getHotColdNumbers(period);
    res.json({
      status: 'success',
      data: hotColdNumbers
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des numéros chauds/froids:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des numéros chauds/froids'
    });
  }
};

// Obtenir les paires fréquentes
exports.getFrequentPairs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const pairs = await statisticsService.getFrequentPairs(limit);
    res.json({
      status: 'success',
      data: pairs
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paires fréquentes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des paires fréquentes'
    });
  }
};

// Obtenir les écarts entre apparitions
exports.getNumberGaps = async (req, res) => {
  try {
    const gaps = await statisticsService.getNumberGaps();
    res.json({
      status: 'success',
      data: gaps
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des écarts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des écarts'
    });
  }
};
