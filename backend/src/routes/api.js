// Backend API pour EuroGenius
// Ce fichier implémente les routes API pour le backend Node.js

const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const drawsController = require('../controllers/drawsController');
const predictionsController = require('../controllers/predictionsController');

// Routes pour les tirages
router.get('/draws/latest', drawsController.getLatestDraws);
router.get('/draws/next', drawsController.getNextDraw);

// Routes pour les statistiques
router.get('/statistics', statisticsController.getStatistics);
router.get('/statistics/hot-cold', statisticsController.getHotColdNumbers);
router.get('/statistics/pairs', statisticsController.getFrequentPairs);
router.get('/statistics/gaps', statisticsController.getNumberGaps);

// Routes pour les prédictions
router.get('/predictions', predictionsController.getPredictions);
router.post('/predictions/custom', predictionsController.generateCustomPrediction);

module.exports = router;
