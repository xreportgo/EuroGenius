import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ApiProvider } from '../contexts/ApiContext';
import App from '../App';
import EuromillionsApiService from '../services/EuromillionsApiService';

// Mock du service API
jest.mock('../services/EuromillionsApiService');

describe('Tests d\'intégration de l\'application', () => {
  // Configuration des mocks avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    jest.clearAllMocks();
    
    // Mock des données de test
    const mockLatestDraw = {
      date: '2025-03-23',
      numbers: [7, 12, 23, 34, 45],
      stars: [3, 9],
      jackpot: '130 000 000 €'
    };
    
    const mockNextDraw = {
      date: '2025-03-26',
      jackpot: '145 000 000 €'
    };
    
    const mockHistory = Array.from({ length: 10 }, (_, i) => ({
      date: `2025-03-${23 - i}`,
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
    }));
    
    // Configuration des mocks pour les méthodes du service
    EuromillionsApiService.getLatestDraw.mockResolvedValue(mockLatestDraw);
    EuromillionsApiService.getNextDraw.mockResolvedValue(mockNextDraw);
    EuromillionsApiService.getDrawHistory.mockResolvedValue(mockHistory);
  });
  
  test('l\'application se charge correctement avec les données initiales', async () => {
    render(
      <ApiProvider>
        <App />
      </ApiProvider>
    );
    
    // Vérification que l'application se charge correctement
    expect(screen.getByText('EuroGenius')).toBeInTheDocument();
    
    // Attente que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText('2025-03-23')).toBeInTheDocument();
    });
    
    // Vérification que les composants principaux sont présents
    expect(screen.getByText('Dernier Tirage')).toBeInTheDocument();
    expect(screen.getByText('Prochain Tirage')).toBeInTheDocument();
    expect(screen.getByText('Statistiques')).toBeInTheDocument();
    expect(screen.getByText('Prédictions')).toBeInTheDocument();
    expect(screen.getByText('Tendances')).toBeInTheDocument();
  });
  
  test('l\'application gère correctement les erreurs API', async () => {
    // Simulation d'une erreur API
    EuromillionsApiService.getLatestDraw.mockRejectedValue(new Error('API Error'));
    EuromillionsApiService.getNextDraw.mockRejectedValue(new Error('API Error'));
    EuromillionsApiService.getDrawHistory.mockRejectedValue(new Error('API Error'));
    
    // Mock des données simulées
    const simulatedData = {
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
      history: []
    };
    
    EuromillionsApiService.getSimulatedData.mockReturnValue(simulatedData);
    
    render(
      <ApiProvider>
        <App />
      </ApiProvider>
    );
    
    // Attente que le message d'erreur soit affiché
    await waitFor(() => {
      expect(screen.getByText(/Impossible de charger les données/i)).toBeInTheDocument();
    });
    
    // Vérification que les données simulées sont utilisées
    expect(screen.getByText('2025-03-23')).toBeInTheDocument();
    expect(screen.getByText('2025-03-26')).toBeInTheDocument();
  });
  
  test('l\'intégration entre les composants fonctionne correctement', async () => {
    render(
      <ApiProvider>
        <App />
      </ApiProvider>
    );
    
    // Attente que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText('2025-03-23')).toBeInTheDocument();
    });
    
    // Vérification que les données sont correctement transmises entre les composants
    expect(screen.getByText('Numéros Chauds')).toBeInTheDocument();
    expect(screen.getByText('Étoiles Chaudes')).toBeInTheDocument();
    
    // Vérification que les onglets fonctionnent correctement
    const predictionsTab = screen.getByText('Prédictions');
    predictionsTab.click();
    
    // Vérification que le contenu de l'onglet Prédictions est affiché
    expect(screen.getByText('Combinaisons Recommandées')).toBeInTheDocument();
    expect(screen.getByText('Stratégies de Génération')).toBeInTheDocument();
    
    // Vérification que les données sont correctement transmises à l'onglet Prédictions
    expect(screen.getByText('Conservatrice')).toBeInTheDocument();
    expect(screen.getByText('Équilibrée')).toBeInTheDocument();
    expect(screen.getByText('Risquée')).toBeInTheDocument();
  });
});
