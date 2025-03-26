/**
 * Tests pour le service d'analyse statistique
 * Ce fichier contient les tests unitaires pour les fonctions du service statistique
 */

const { expect } = require('chai');
const sinon = require('sinon');
const db = require('../../src/config/database');
const statisticsService = require('../../src/services/statisticsService');

describe('Service d\'analyse statistique', () => {
  // Stub pour simuler les requêtes à la base de données
  let queryStub;
  
  beforeEach(() => {
    // Création d'un stub pour la méthode query de la base de données
    queryStub = sinon.stub(db, 'query');
  });
  
  afterEach(() => {
    // Restauration du stub après chaque test
    queryStub.restore();
  });
  
  describe('getNumberFrequencies', () => {
    it('devrait retourner les fréquences des numéros', async () => {
      // Configuration du stub pour simuler une réponse de la base de données
      queryStub.resolves({
        rows: [
          { numero: 1, frequence: 10, ecart_actuel: 5, ecart_moyen: 8.5, ecart_max: 15, est_chaud: true, pourcentage: 10.5 },
          { numero: 2, frequence: 8, ecart_actuel: 0, ecart_moyen: 9.2, ecart_max: 20, est_chaud: false, pourcentage: 8.4 }
        ]
      });
      
      // Appel de la fonction à tester
      const result = await statisticsService.getNumberFrequencies();
      
      // Vérification que la requête SQL a été appelée
      expect(queryStub.calledOnce).to.be.true;
      
      // Vérification du résultat
      expect(result).to.be.an('array').with.lengthOf(2);
      expect(result[0].numero).to.equal(1);
      expect(result[0].frequence).to.equal(10);
      expect(result[1].numero).to.equal(2);
      expect(result[1].frequence).to.equal(8);
    });
    
    it('devrait gérer les erreurs correctement', async () => {
      // Configuration du stub pour simuler une erreur
      queryStub.rejects(new Error('Erreur de base de données'));
      
      try {
        // Appel de la fonction à tester
        await statisticsService.getNumberFrequencies();
        // Si on arrive ici, le test échoue car une exception aurait dû être levée
        expect.fail('Une exception aurait dû être levée');
      } catch (error) {
        // Vérification que l'erreur est bien remontée
        expect(error.message).to.equal('Erreur de base de données');
      }
    });
  });
  
  describe('getHotNumbers', () => {
    it('devrait retourner les numéros chauds', async () => {
      // Configuration du stub pour simuler une réponse de la base de données
      queryStub.resolves({
        rows: [
          { numero: 5, frequence: 15, pourcentage: 15.8 },
          { numero: 23, frequence: 12, pourcentage: 12.6 }
        ]
      });
      
      // Appel de la fonction à tester
      const result = await statisticsService.getHotNumbers();
      
      // Vérification que la requête SQL a été appelée
      expect(queryStub.calledOnce).to.be.true;
      
      // Vérification du résultat
      expect(result).to.be.an('array').with.lengthOf(2);
      expect(result[0].numero).to.equal(5);
      expect(result[0].frequence).to.equal(15);
      expect(result[1].numero).to.equal(23);
      expect(result[1].frequence).to.equal(12);
    });
  });
  
  describe('generateStatisticalCombination', () => {
    it('devrait générer une combinaison avec la stratégie "hot"', async () => {
      // Configuration des stubs pour simuler les réponses de la base de données
      queryStub.onFirstCall().resolves({
        rows: [
          { numero: 5 },
          { numero: 23 },
          { numero: 17 },
          { numero: 33 },
          { numero: 41 }
        ]
      });
      
      queryStub.onSecondCall().resolves({
        rows: [
          { etoile: 2 },
          { etoile: 8 }
        ]
      });
      
      // Appel de la fonction à tester
      const result = await statisticsService.generateStatisticalCombination('hot');
      
      // Vérification que les requêtes SQL ont été appelées
      expect(queryStub.calledTwice).to.be.true;
      
      // Vérification du résultat
      expect(result).to.be.an('object');
      expect(result.numeros).to.be.an('array').with.lengthOf(5);
      expect(result.etoiles).to.be.an('array').with.lengthOf(2);
      expect(result.strategy).to.equal('hot');
      
      // Vérification que les numéros sont triés
      expect(result.numeros).to.deep.equal([5, 17, 23, 33, 41]);
      expect(result.etoiles).to.deep.equal([2, 8]);
    });
    
    it('devrait utiliser la stratégie "balanced" par défaut', async () => {
      // Configuration des stubs pour simuler les réponses de la base de données
      queryStub.onFirstCall().resolves({
        rows: [
          { numero: 5 },
          { numero: 23 },
          { numero: 17 },
          { numero: 33 },
          { numero: 41 }
        ]
      });
      
      queryStub.onSecondCall().resolves({
        rows: [
          { etoile: 2 },
          { etoile: 8 }
        ]
      });
      
      // Appel de la fonction à tester sans spécifier de stratégie
      const result = await statisticsService.generateStatisticalCombination();
      
      // Vérification du résultat
      expect(result.strategy).to.equal('balanced');
    });
  });
  
  describe('updateStatisticsAfterDraw', () => {
    it('devrait mettre à jour les statistiques après un tirage', async () => {
      // Création d'un stub pour la méthode getClient
      const clientStub = {
        query: sinon.stub(),
        release: sinon.stub()
      };
      
      const getClientStub = sinon.stub(db, 'getClient').resolves({
        query: clientStub.query,
        release: clientStub.release
      });
      
      // Configuration des stubs pour simuler les réponses de la base de données
      clientStub.query.resolves({ rows: [] });
      
      // Données de tirage de test
      const tirage = {
        id: 1,
        numero1: 5,
        numero2: 17,
        numero3: 23,
        numero4: 33,
        numero5: 41,
        etoile1: 2,
        etoile2: 8
      };
      
      // Appel de la fonction à tester
      const result = await statisticsService.updateStatisticsAfterDraw(tirage);
      
      // Vérification que getClient a été appelé
      expect(getClientStub.calledOnce).to.be.true;
      
      // Vérification que la transaction a été gérée correctement
      expect(clientStub.query.calledWith('BEGIN')).to.be.true;
      expect(clientStub.query.calledWith('COMMIT')).to.be.true;
      
      // Vérification que le client a été libéré
      expect(clientStub.release.calledOnce).to.be.true;
      
      // Vérification du résultat
      expect(result).to.be.true;
      
      // Restauration du stub getClient
      getClientStub.restore();
    });
  });
});
