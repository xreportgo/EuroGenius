import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ApiProvider } from '../contexts/ApiContext';
import HomePage from '../pages/HomePage';
import EuromillionsApiService from '../services/EuromillionsApiService';

// Mock du service API
jest.mock('../services/EuromillionsApiService');

describe('HomePage Component', () => {
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
  
  test('affiche le dernier tirage correctement', async () => {
    render(
      <ApiProvider>
        <HomePage />
      </ApiProvider>
    );
    
    // Vérification que le composant est en cours de chargement
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
    
    // Attente que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText('2025-03-23')).toBeInTheDocument();
    });
    
    // Vérification que les numéros du dernier tirage sont affichés
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();
    expect(screen.getByText('34')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    
    // Vérification que les étoiles du dernier tirage sont affichées
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });
  
  test('affiche le prochain tirage correctement', async () => {
    render(
      <ApiProvider>
        <HomePage />
      </ApiProvider>
    );
    
    // Attente que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText('2025-03-26')).toBeInTheDocument();
    });
    
    // Vérification que le jackpot du prochain tirage est affiché
    expect(screen.getByText('145 000 000 €')).toBeInTheDocument();
  });
  
  test('calcule et affiche les statistiques correctement', async () => {
    render(
      <ApiProvider>
        <HomePage />
      </ApiProvider>
    );
    
    // Attente que les données soient chargées et les statistiques calculées
    await waitFor(() => {
      expect(screen.getByText('Numéros Chauds')).toBeInTheDocument();
    });
    
    // Vérification que les sections de statistiques sont affichées
    expect(screen.getByText('Numéros Froids')).toBeInTheDocument();
    expect(screen.getByText('Étoiles Chaudes')).toBeInTheDocument();
    expect(screen.getByText('Étoiles Froides')).toBeInTheDocument();
  });
  
  test('gère les erreurs correctement', async () => {
    // Simulation d'une erreur
    EuromillionsApiService.getLatestDraw.mockRejectedValue(new Error('API Error'));
    
    render(
      <ApiProvider>
        <HomePage />
      </ApiProvider>
    );
    
    // Attente que l'erreur soit affichée
    await waitFor(() => {
      expect(screen.getByText(/Impossible de charger les données/i)).toBeInTheDocument();
    });
  });
});
