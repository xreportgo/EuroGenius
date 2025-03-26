// Service pour l'intégration de l'API Pedro Mealha
// Cette API permet de récupérer les résultats des tirages EuroMillions

import axios from 'axios';

// URL de base de l'API
const API_BASE_URL = 'https://api.pedromealha.com/euromillions';

/**
 * Service pour interagir avec l'API Pedro Mealha
 */
class EuromillionsApiService {
  /**
   * Récupère le dernier tirage EuroMillions
   * @returns {Promise} Promesse contenant les données du dernier tirage
   */
  async getLatestDraw() {
    try {
      const response = await axios.get(`${API_BASE_URL}/latest`);
      return this._formatDrawData(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier tirage:', error);
      throw error;
    }
  }

  /**
   * Récupère les informations sur le prochain tirage
   * @returns {Promise} Promesse contenant les données du prochain tirage
   */
  async getNextDraw() {
    try {
      const response = await axios.get(`${API_BASE_URL}/next`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du prochain tirage:', error);
      throw error;
    }
  }

  /**
   * Récupère l'historique des tirages
   * @param {number} limit - Nombre de tirages à récupérer (défaut: 100)
   * @returns {Promise} Promesse contenant l'historique des tirages
   */
  async getDrawHistory(limit = 100) {
    try {
      const response = await axios.get(`${API_BASE_URL}/history?limit=${limit}`);
      return response.data.map(draw => this._formatDrawData(draw));
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des tirages:', error);
      throw error;
    }
  }

  /**
   * Récupère un tirage spécifique par sa date
   * @param {string} date - Date du tirage au format YYYY-MM-DD
   * @returns {Promise} Promesse contenant les données du tirage
   */
  async getDrawByDate(date) {
    try {
      const response = await axios.get(`${API_BASE_URL}/draw?date=${date}`);
      return this._formatDrawData(response.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération du tirage du ${date}:`, error);
      throw error;
    }
  }

  /**
   * Formate les données d'un tirage pour correspondre à notre structure
   * @param {Object} drawData - Données brutes du tirage
   * @returns {Object} Données formatées
   * @private
   */
  _formatDrawData(drawData) {
    return {
      date: drawData.date,
      numbers: [
        drawData.numero1,
        drawData.numero2,
        drawData.numero3,
        drawData.numero4,
        drawData.numero5
      ],
      stars: [
        drawData.etoile1,
        drawData.etoile2
      ],
      jackpot: drawData.jackpot,
      winners: drawData.winners
    };
  }

  /**
   * Simule la récupération des données en cas d'indisponibilité de l'API
   * @returns {Object} Données simulées du dernier tirage
   */
  getSimulatedData() {
    return {
      latest: {
        date: '2025-03-23',
        numbers: [7, 12, 23, 34, 45],
        stars: [3, 9],
        jackpot: '130 000 000 €',
        winners: 0
      },
      next: {
        date: '2025-03-26',
        jackpot: '145 000 000 €'
      },
      history: Array.from({ length: 10 }, (_, i) => ({
        date: new Date(2025, 2, 23 - i * 3).toISOString().split('T')[0],
        numbers: [
          Math.floor(Math.random() * 50) + 1,
          Math.floor(Math.random() * 50) + 1,
          Math.floor(Math.random() * 50) + 1,
          Math.floor(Math.random() * 50) + 1,
          Math.floor(Math.random() * 50) + 1,
        ].sort((a, b) => a - b),
        stars: [
          Math.floor(Math.random() * 12) + 1,
          Math.floor(Math.random() * 12) + 1,
        ].sort((a, b) => a - b),
        jackpot: `${Math.floor(Math.random() * 100 + 50)} 000 000 €`,
        winners: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0
      }))
    };
  }
}

export default new EuromillionsApiService();
