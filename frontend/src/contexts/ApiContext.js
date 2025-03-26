// Contexte d'API pour gérer l'état global et les appels API
import React, { createContext, useState, useEffect, useContext } from 'react';
import EuromillionsApiService from '../services/EuromillionsApiService';

// Création du contexte
const ApiContext = createContext();

/**
 * Fournisseur de contexte API pour l'application
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} Composant fournisseur de contexte
 */
export const ApiProvider = ({ children }) => {
  // États pour stocker les données
  const [latestDraw, setLatestDraw] = useState(null);
  const [nextDraw, setNextDraw] = useState(null);
  const [drawHistory, setDrawHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement initial des données
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Charge les données initiales (dernier tirage, prochain tirage, historique)
   */
  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Tentative de récupération des données depuis l'API
      const latest = await EuromillionsApiService.getLatestDraw();
      const next = await EuromillionsApiService.getNextDraw();
      const history = await EuromillionsApiService.getDrawHistory(50);
      
      setLatestDraw(latest);
      setNextDraw(next);
      setDrawHistory(history);
    } catch (err) {
      console.error('Erreur lors du chargement des données initiales:', err);
      setError('Impossible de charger les données. Utilisation des données simulées.');
      
      // Utilisation des données simulées en cas d'erreur
      const simulatedData = EuromillionsApiService.getSimulatedData();
      setLatestDraw(simulatedData.latest);
      setNextDraw(simulatedData.next);
      setDrawHistory(simulatedData.history);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rafraîchit les données du dernier tirage
   */
  const refreshLatestDraw = async () => {
    setLoading(true);
    
    try {
      const latest = await EuromillionsApiService.getLatestDraw();
      setLatestDraw(latest);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement du dernier tirage:', err);
      setError('Impossible de rafraîchir les données.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère l'historique des tirages avec une limite spécifiée
   * @param {number} limit - Nombre de tirages à récupérer
   */
  const getHistory = async (limit = 100) => {
    setLoading(true);
    
    try {
      const history = await EuromillionsApiService.getDrawHistory(limit);
      setDrawHistory(history);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'historique:', err);
      setError('Impossible de récupérer l\'historique des tirages.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère un tirage spécifique par sa date
   * @param {string} date - Date du tirage au format YYYY-MM-DD
   * @returns {Promise} Promesse contenant les données du tirage
   */
  const getDrawByDate = async (date) => {
    try {
      return await EuromillionsApiService.getDrawByDate(date);
    } catch (err) {
      console.error(`Erreur lors de la récupération du tirage du ${date}:`, err);
      throw err;
    }
  };

  // Valeur du contexte à exposer
  const value = {
    latestDraw,
    nextDraw,
    drawHistory,
    loading,
    error,
    refreshLatestDraw,
    getHistory,
    getDrawByDate,
    loadInitialData
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte API
 * @returns {Object} Contexte API
 */
export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi doit être utilisé à l\'intérieur d\'un ApiProvider');
  }
  return context;
};

export default ApiContext;
