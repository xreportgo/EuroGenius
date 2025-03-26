/**
 * Routes pour les analyses statistiques
 * Ce fichier définit les endpoints API pour les fonctionnalités d'analyse statistique
 */

const express = require('express');
const router = express.Router();
const statisticsController = require('../api/statisticsController');

// Routes pour les fréquences
router.get('/numbers/frequencies', statisticsController.getNumberFrequencies);
router.get('/stars/frequencies', statisticsController.getStarFrequencies);

// Routes pour les paires et triplets
router.get('/numbers/pairs', statisticsController.getMostFrequentPairs);
router.get('/numbers/triplets', statisticsController.getMostFrequentTriplets);

// Routes pour l'analyse des écarts
router.get('/numbers/gaps', statisticsController.getNumberGapAnalysis);
router.get('/stars/gaps', statisticsController.getStarGapAnalysis);

// Routes pour les numéros chauds et froids
router.get('/numbers/hot', statisticsController.getHotNumbers);
router.get('/numbers/cold', statisticsController.getColdNumbers);
router.get('/stars/hot', statisticsController.getHotStars);
router.get('/stars/cold', statisticsController.getColdStars);

// Route pour la distribution positionnelle
router.get('/numbers/positions', statisticsController.getPositionalDistribution);

// Route pour la génération de combinaisons
router.get('/generate', statisticsController.generateStatisticalCombination);

// Route pour la mise à jour des statistiques après un tirage
router.post('/update', statisticsController.updateStatisticsAfterDraw);

// Route pour le tableau de bord statistique complet
router.get('/dashboard', statisticsController.getStatisticalDashboard);

module.exports = router;
