/**
 * Service d'analyse statistique pour EuroGenius
 * Ce service fournit des fonctions pour analyser les données des tirages EuroMillions
 */

const db = require('../config/database');

/**
 * Calcule les fréquences d'apparition de tous les numéros
 * @returns {Promise<Array>} Tableau des numéros avec leurs fréquences
 */
async function getNumberFrequencies() {
  try {
    const result = await db.query(`
      SELECT 
        numero, 
        frequence, 
        ecart_actuel, 
        ecart_moyen, 
        ecart_max, 
        est_chaud,
        ROUND((frequence::float / (SELECT COUNT(*) FROM tirages)) * 100, 2) AS pourcentage
      FROM 
        statistiques_numeros 
      ORDER BY 
        frequence DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors du calcul des fréquences des numéros:', error);
    throw error;
  }
}

/**
 * Calcule les fréquences d'apparition de toutes les étoiles
 * @returns {Promise<Array>} Tableau des étoiles avec leurs fréquences
 */
async function getStarFrequencies() {
  try {
    const result = await db.query(`
      SELECT 
        etoile, 
        frequence, 
        ecart_actuel, 
        ecart_moyen, 
        ecart_max, 
        est_chaud,
        ROUND((frequence::float / (SELECT COUNT(*) FROM tirages)) * 100, 2) AS pourcentage
      FROM 
        statistiques_etoiles 
      ORDER BY 
        frequence DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors du calcul des fréquences des étoiles:', error);
    throw error;
  }
}

/**
 * Récupère les paires de numéros les plus fréquentes
 * @param {number} limit Nombre de paires à récupérer
 * @returns {Promise<Array>} Tableau des paires les plus fréquentes
 */
async function getMostFrequentPairs(limit = 20) {
  try {
    const result = await db.query(`
      SELECT 
        numero1, 
        numero2, 
        frequence,
        ROUND((frequence::float / (SELECT COUNT(*) FROM tirages)) * 100, 2) AS pourcentage
      FROM 
        paires_numeros 
      ORDER BY 
        frequence DESC 
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des paires fréquentes:', error);
    throw error;
  }
}

/**
 * Récupère les triplets de numéros les plus fréquents
 * @param {number} limit Nombre de triplets à récupérer
 * @returns {Promise<Array>} Tableau des triplets les plus fréquents
 */
async function getMostFrequentTriplets(limit = 20) {
  try {
    const result = await db.query(`
      SELECT 
        numero1, 
        numero2, 
        numero3, 
        frequence,
        ROUND((frequence::float / (SELECT COUNT(*) FROM tirages)) * 100, 2) AS pourcentage
      FROM 
        triplets_numeros 
      ORDER BY 
        frequence DESC 
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des triplets fréquents:', error);
    throw error;
  }
}

/**
 * Analyse les écarts entre apparitions pour tous les numéros
 * @returns {Promise<Array>} Tableau des numéros avec leurs statistiques d'écart
 */
async function getNumberGapAnalysis() {
  try {
    const result = await db.query(`
      SELECT 
        numero, 
        ecart_actuel, 
        ecart_moyen, 
        ecart_max,
        ROUND((ecart_actuel::float / ecart_moyen), 2) AS ratio_ecart
      FROM 
        statistiques_numeros 
      ORDER BY 
        ecart_actuel DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de l\'analyse des écarts des numéros:', error);
    throw error;
  }
}

/**
 * Analyse les écarts entre apparitions pour toutes les étoiles
 * @returns {Promise<Array>} Tableau des étoiles avec leurs statistiques d'écart
 */
async function getStarGapAnalysis() {
  try {
    const result = await db.query(`
      SELECT 
        etoile, 
        ecart_actuel, 
        ecart_moyen, 
        ecart_max,
        ROUND((ecart_actuel::float / ecart_moyen), 2) AS ratio_ecart
      FROM 
        statistiques_etoiles 
      ORDER BY 
        ecart_actuel DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de l\'analyse des écarts des étoiles:', error);
    throw error;
  }
}

/**
 * Identifie les numéros "chauds" (fréquence supérieure à la moyenne)
 * @returns {Promise<Array>} Tableau des numéros chauds
 */
async function getHotNumbers() {
  try {
    const result = await db.query(`
      WITH stats AS (
        SELECT AVG(frequence) AS moyenne_frequence FROM statistiques_numeros
      )
      SELECT 
        numero, 
        frequence,
        ROUND((frequence::float / (SELECT COUNT(*) FROM tirages)) * 100, 2) AS pourcentage
      FROM 
        statistiques_numeros, stats
      WHERE 
        frequence > stats.moyenne_frequence
      ORDER BY 
        frequence DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de l\'identification des numéros chauds:', error);
    throw error;
  }
}

/**
 * Identifie les numéros "froids" (fréquence inférieure à la moyenne)
 * @returns {Promise<Array>} Tableau des numéros froids
 */
async function getColdNumbers() {
  try {
    const result = await db.query(`
      WITH stats AS (
        SELECT AVG(frequence) AS moyenne_frequence FROM statistiques_numeros
      )
      SELECT 
        numero, 
        frequence,
        ROUND((frequence::float / (SELECT COUNT(*) FROM tirages)) * 100, 2) AS pourcentage
      FROM 
        statistiques_numeros, stats
      WHERE 
        frequence < stats.moyenne_frequence
      ORDER BY 
        frequence ASC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de l\'identification des numéros froids:', error);
    throw error;
  }
}

/**
 * Identifie les étoiles "chaudes" (fréquence supérieure à la moyenne)
 * @returns {Promise<Array>} Tableau des étoiles chaudes
 */
async function getHotStars() {
  try {
    const result = await db.query(`
      WITH stats AS (
        SELECT AVG(frequence) AS moyenne_frequence FROM statistiques_etoiles
      )
      SELECT 
        etoile, 
        frequence,
        ROUND((frequence::float / (SELECT COUNT(*) FROM tirages)) * 100, 2) AS pourcentage
      FROM 
        statistiques_etoiles, stats
      WHERE 
        frequence > stats.moyenne_frequence
      ORDER BY 
        frequence DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de l\'identification des étoiles chaudes:', error);
    throw error;
  }
}

/**
 * Identifie les étoiles "froides" (fréquence inférieure à la moyenne)
 * @returns {Promise<Array>} Tableau des étoiles froides
 */
async function getColdStars() {
  try {
    const result = await db.query(`
      WITH stats AS (
        SELECT AVG(frequence) AS moyenne_frequence FROM statistiques_etoiles
      )
      SELECT 
        etoile, 
        frequence,
        ROUND((frequence::float / (SELECT COUNT(*) FROM tirages)) * 100, 2) AS pourcentage
      FROM 
        statistiques_etoiles, stats
      WHERE 
        frequence < stats.moyenne_frequence
      ORDER BY 
        frequence ASC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de l\'identification des étoiles froides:', error);
    throw error;
  }
}

/**
 * Met à jour les statistiques après un nouveau tirage
 * @param {Object} tirage Objet contenant les données du tirage
 * @returns {Promise<boolean>} Succès de la mise à jour
 */
async function updateStatisticsAfterDraw(tirage) {
  const client = await db.getClient();
  
  try {
    // Début de la transaction
    await client.query('BEGIN');
    
    const tirageId = tirage.id;
    const numeros = [tirage.numero1, tirage.numero2, tirage.numero3, tirage.numero4, tirage.numero5];
    const etoiles = [tirage.etoile1, tirage.etoile2];
    
    // Mise à jour des écarts pour tous les numéros
    await client.query(`
      UPDATE statistiques_numeros
      SET ecart_actuel = ecart_actuel + 1
    `);
    
    // Mise à jour des écarts pour toutes les étoiles
    await client.query(`
      UPDATE statistiques_etoiles
      SET ecart_actuel = ecart_actuel + 1
    `);
    
    // Mise à jour des statistiques pour les numéros tirés
    for (const numero of numeros) {
      await client.query(`
        UPDATE statistiques_numeros
        SET 
          frequence = frequence + 1,
          dernier_tirage_id = $1,
          ecart_moyen = ((ecart_moyen * frequence) + ecart_actuel) / (frequence + 1),
          ecart_max = GREATEST(ecart_max, ecart_actuel),
          ecart_actuel = 0,
          updated_at = CURRENT_TIMESTAMP
        WHERE 
          numero = $2
      `, [tirageId, numero]);
    }
    
    // Mise à jour des statistiques pour les étoiles tirées
    for (const etoile of etoiles) {
      await client.query(`
        UPDATE statistiques_etoiles
        SET 
          frequence = frequence + 1,
          dernier_tirage_id = $1,
          ecart_moyen = ((ecart_moyen * frequence) + ecart_actuel) / (frequence + 1),
          ecart_max = GREATEST(ecart_max, ecart_actuel),
          ecart_actuel = 0,
          updated_at = CURRENT_TIMESTAMP
        WHERE 
          etoile = $2
      `, [tirageId, etoile]);
    }
    
    // Mise à jour des paires de numéros
    for (let i = 0; i < numeros.length; i++) {
      for (let j = i + 1; j < numeros.length; j++) {
        const num1 = Math.min(numeros[i], numeros[j]);
        const num2 = Math.max(numeros[i], numeros[j]);
        
        // Vérifier si la paire existe déjà
        const pairExists = await client.query(`
          SELECT id FROM paires_numeros
          WHERE numero1 = $1 AND numero2 = $2
        `, [num1, num2]);
        
        if (pairExists.rows.length > 0) {
          // Mettre à jour la paire existante
          await client.query(`
            UPDATE paires_numeros
            SET 
              frequence = frequence + 1,
              dernier_tirage_id = $1,
              updated_at = CURRENT_TIMESTAMP
            WHERE 
              numero1 = $2 AND numero2 = $3
          `, [tirageId, num1, num2]);
        } else {
          // Créer une nouvelle paire
          await client.query(`
            INSERT INTO paires_numeros (numero1, numero2, frequence, dernier_tirage_id)
            VALUES ($1, $2, 1, $3)
          `, [num1, num2, tirageId]);
        }
      }
    }
    
    // Mise à jour des triplets de numéros
    for (let i = 0; i < numeros.length; i++) {
      for (let j = i + 1; j < numeros.length; j++) {
        for (let k = j + 1; k < numeros.length; k++) {
          const nums = [numeros[i], numeros[j], numeros[k]].sort((a, b) => a - b);
          
          // Vérifier si le triplet existe déjà
          const tripletExists = await client.query(`
            SELECT id FROM triplets_numeros
            WHERE numero1 = $1 AND numero2 = $2 AND numero3 = $3
          `, [nums[0], nums[1], nums[2]]);
          
          if (tripletExists.rows.length > 0) {
            // Mettre à jour le triplet existant
            await client.query(`
              UPDATE triplets_numeros
              SET 
                frequence = frequence + 1,
                dernier_tirage_id = $1,
                updated_at = CURRENT_TIMESTAMP
              WHERE 
                numero1 = $2 AND numero2 = $3 AND numero3 = $4
            `, [tirageId, nums[0], nums[1], nums[2]]);
          } else {
            // Créer un nouveau triplet
            await client.query(`
              INSERT INTO triplets_numeros (numero1, numero2, numero3, frequence, dernier_tirage_id)
              VALUES ($1, $2, $3, 1, $4)
            `, [nums[0], nums[1], nums[2], tirageId]);
          }
        }
      }
    }
    
    // Mise à jour des indicateurs chaud/froid
    await client.query(`
      WITH stats AS (
        SELECT AVG(frequence) AS moyenne_frequence FROM statistiques_numeros
      )
      UPDATE statistiques_numeros
      SET est_chaud = (frequence > stats.moyenne_frequence)
      FROM stats
    `);
    
    await client.query(`
      WITH stats AS (
        SELECT AVG(frequence) AS moyenne_frequence FROM statistiques_etoiles
      )
      UPDATE statistiques_etoiles
      SET est_chaud = (frequence > stats.moyenne_frequence)
      FROM stats
    `);
    
    // Validation de la transaction
    await client.query('COMMIT');
    
    return true;
  } catch (error) {
    // Annulation de la transaction en cas d'erreur
    await client.query('ROLLBACK');
    console.error('Erreur lors de la mise à jour des statistiques:', error);
    throw error;
  } finally {
    // Libération du client
    client.release();
  }
}

/**
 * Génère une combinaison basée sur les statistiques
 * @param {string} strategy Stratégie de génération ('hot', 'cold', 'balanced')
 * @returns {Promise<Object>} Combinaison générée
 */
async function generateStatisticalCombination(strategy = 'balanced') {
  try {
    let numeroQuery;
    let etoileQuery;
    
    switch (strategy) {
      case 'hot':
        // Sélectionne les numéros les plus fréquents
        numeroQuery = `
          SELECT numero
          FROM statistiques_numeros
          ORDER BY frequence DESC
          LIMIT 5
        `;
        
        // Sélectionne les étoiles les plus fréquentes
        etoileQuery = `
          SELECT etoile
          FROM statistiques_etoiles
          ORDER BY frequence DESC
          LIMIT 2
        `;
        break;
        
      case 'cold':
        // Sélectionne les numéros les moins fréquents
        numeroQuery = `
          SELECT numero
          FROM statistiques_numeros
          ORDER BY frequence ASC
          LIMIT 5
        `;
        
        // Sélectionne les étoiles les moins fréquentes
        etoileQuery = `
          SELECT etoile
          FROM statistiques_etoiles
          ORDER BY frequence ASC
          LIMIT 2
        `;
        break;
        
      case 'due':
        // Sélectionne les numéros avec le plus grand écart actuel
        numeroQuery = `
          SELECT numero
          FROM statistiques_numeros
          ORDER BY ecart_actuel DESC
          LIMIT 5
        `;
        
        // Sélectionne les étoiles avec le plus grand écart actuel
        etoileQuery = `
          SELECT etoile
          FROM statistiques_etoiles
          ORDER BY ecart_actuel DESC
          LIMIT 2
        `;
        break;
        
      case 'balanced':
      default:
        // Sélectionne un mélange de numéros chauds et froids
        numeroQuery = `
          (SELECT numero FROM statistiques_numeros ORDER BY frequence DESC LIMIT 3)
          UNION
          (SELECT numero FROM statistiques_numeros ORDER BY ecart_actuel DESC LIMIT 2)
        `;
        
        // Sélectionne un mélange d'étoiles chaudes et froides
        etoileQuery = `
          (SELECT etoile FROM statistiques_etoiles ORDER BY frequence DESC LIMIT 1)
          UNION
          (SELECT etoile FROM statistiques_etoiles ORDER BY ecart_actuel DESC LIMIT 1)
        `;
        break;
    }
    
    // Exécution des requêtes
    const numerosResult = await db.query(numeroQuery);
    const etoilesResult = await db.query(etoileQuery);
    
    // Extraction des résultats
    const numeros = numerosResult.rows.map(row => row.numero);
    const etoiles = etoilesResult.rows.map(row => row.etoile);
    
    // Tri des numéros et étoiles
    numeros.sort((a, b) => a - b);
    etoiles.sort((a, b) => a - b);
    
    return {
      numeros,
      etoiles,
      strategy
    };
  } catch (error) {
    console.error('Erreur lors de la génération de combinaison statistique:', error);
    throw error;
  }
}

/**
 * Analyse la distribution positionnelle des numéros
 * @returns {Promise<Object>} Analyse de la distribution positionnelle
 */
async function getPositionalDistribution() {
  try {
    const result = await db.query(`
      SELECT
        numero,
        COUNT(CASE WHEN position = 1 THEN 1 END) AS pos1,
        COUNT(CASE WHEN position = 2 THEN 1 END) AS pos2,
        COUNT(CASE WHEN position = 3 THEN 1 END) AS pos3,
        COUNT(CASE WHEN position = 4 THEN 1 END) AS pos4,
        COUNT(CASE WHEN position = 5 THEN 1 END) AS pos5
      FROM (
        SELECT numero1 AS numero, 1 AS position FROM tirages
        UNION ALL
        SELECT numero2 AS numero, 2 AS position FROM tirages
        UNION ALL
        SELECT numero3 AS numero, 3 AS position FROM tirages
        UNION ALL
        SELECT numero4 AS numero, 4 AS position FROM tirages
        UNION ALL
        SELECT numero5 AS numero, 5 AS position FROM tirages
      ) AS positions
      GROUP BY numero
      ORDER BY numero
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de l\'analyse de la distribution positionnelle:', error);
    throw error;
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
  getPositionalDistribution
};
