import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Tabs, 
  Tab, 
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { NumberBall, StarBall, Combination } from '../components/LotteryComponents';
import { useApi } from '../contexts/ApiContext';

// Composant de la page d'accueil
const HomePage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  
  // Utilisation du contexte API
  const { 
    latestDraw, 
    nextDraw, 
    drawHistory, 
    loading, 
    error, 
    refreshLatestDraw 
  } = useApi();
  
  // Données dérivées pour les statistiques
  const [hotNumbers, setHotNumbers] = useState([]);
  const [coldNumbers, setColdNumbers] = useState([]);
  const [hotStars, setHotStars] = useState([]);
  const [coldStars, setColdStars] = useState([]);
  const [recentTrends, setRecentTrends] = useState([]);
  const [suggestedCombinations, setSuggestedCombinations] = useState([]);
  
  // Calcul des statistiques à partir de l'historique des tirages
  useEffect(() => {
    if (drawHistory && drawHistory.length > 0) {
      calculateStatistics();
    }
  }, [drawHistory]);
  
  // Fonction pour calculer les statistiques
  const calculateStatistics = () => {
    // Comptage des fréquences des numéros
    const numberCounts = {};
    const starCounts = {};
    
    drawHistory.forEach(draw => {
      // Comptage des numéros
      draw.numbers.forEach(num => {
        numberCounts[num] = (numberCounts[num] || 0) + 1;
      });
      
      // Comptage des étoiles
      draw.stars.forEach(star => {
        starCounts[star] = (starCounts[star] || 0) + 1;
      });
    });
    
    // Conversion en tableaux pour le tri
    const numberFrequencies = Object.entries(numberCounts).map(([number, count]) => ({
      number: parseInt(number),
      count
    }));
    
    const starFrequencies = Object.entries(starCounts).map(([star, count]) => ({
      star: parseInt(star),
      count
    }));
    
    // Tri par fréquence
    numberFrequencies.sort((a, b) => b.count - a.count);
    starFrequencies.sort((a, b) => b.count - a.count);
    
    // Sélection des numéros chauds et froids
    setHotNumbers(numberFrequencies.slice(0, 5).map(item => item.number));
    setColdNumbers(numberFrequencies.slice(-5).map(item => item.number));
    setHotStars(starFrequencies.slice(0, 2).map(item => item.star));
    setColdStars(starFrequencies.slice(-2).map(item => item.star));
    
    // Calcul des tendances récentes
    const recentDraws = drawHistory.slice(0, 10);
    
    // Pourcentage de numéros pairs
    const evenCount = recentDraws.reduce((count, draw) => {
      return count + draw.numbers.filter(num => num % 2 === 0).length;
    }, 0);
    const totalNumbers = recentDraws.length * 5;
    const evenPercentage = Math.round((evenCount / totalNumbers) * 100);
    
    // Pourcentage de numéros < 25
    const lowCount = recentDraws.reduce((count, draw) => {
      return count + draw.numbers.filter(num => num <= 25).length;
    }, 0);
    const lowPercentage = Math.round((lowCount / totalNumbers) * 100);
    
    // Calcul de l'écart maximal
    let maxGap = 0;
    for (let i = 1; i <= 50; i++) {
      let lastSeen = -1;
      for (let j = 0; j < recentDraws.length; j++) {
        if (recentDraws[j].numbers.includes(i)) {
          if (lastSeen === -1) {
            lastSeen = j;
          } else {
            const gap = j - lastSeen;
            if (gap > maxGap) {
              maxGap = gap;
            }
            lastSeen = j;
          }
        }
      }
    }
    
    setRecentTrends([
      { 
        label: 'Numéros pairs', 
        value: `${evenPercentage}%`, 
        trend: evenPercentage > 50 ? 'up' : evenPercentage < 50 ? 'down' : 'neutral' 
      },
      { 
        label: 'Numéros < 25', 
        value: `${lowPercentage}%`, 
        trend: lowPercentage > 50 ? 'up' : lowPercentage < 50 ? 'down' : 'neutral' 
      },
      { 
        label: 'Écart max', 
        value: `${maxGap} tirages`, 
        trend: 'neutral' 
      }
    ]);
    
    // Génération de combinaisons suggérées (simplifiée)
    // Dans une implémentation réelle, cela appellerait le backend avec les modèles IA
    const combinations = [];
    
    // Combinaison basée sur les numéros chauds
    combinations.push({
      numbers: [...hotNumbers].sort((a, b) => a - b),
      stars: [...hotStars].sort((a, b) => a - b),
      confidence: 4.5
    });
    
    // Combinaison équilibrée (mélange de chauds et froids)
    const balancedNumbers = [
      hotNumbers[0],
      hotNumbers[1],
      hotNumbers[2],
      coldNumbers[0],
      coldNumbers[1]
    ].sort((a, b) => a - b);
    
    combinations.push({
      numbers: balancedNumbers,
      stars: [hotStars[0], coldStars[0]].sort((a, b) => a - b),
      confidence: 4.2
    });
    
    // Combinaison basée sur les numéros froids
    combinations.push({
      numbers: [...coldNumbers].sort((a, b) => a - b),
      stars: [...coldStars].sort((a, b) => a - b),
      confidence: 3.8
    });
    
    setSuggestedCombinations(combinations);
  };
  
  // Gestionnaire de changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Gestionnaire de rafraîchissement des données
  const handleRefresh = () => {
    refreshLatestDraw();
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Message d'erreur */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* En-tête avec dernier tirage et prochain jackpot */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Dernier Tirage" 
              subheader={latestDraw ? latestDraw.date : "Chargement..."}
              action={
                <IconButton aria-label="refresh" onClick={handleRefresh} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
                </IconButton>
              }
            />
            <CardContent>
              {loading && !latestDraw ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : latestDraw ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {latestDraw.numbers.map((number, index) => (
                      <NumberBall key={index} selected sx={{ mx: 0.5 }}>
                        {number}
                      </NumberBall>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {latestDraw.stars.map((star, index) => (
                      <StarBall key={index} selected sx={{ mx: 0.5 }}>
                        {star}
                      </StarBall>
                    ))}
                  </Box>
                </>
              ) : (
                <Typography variant="body1" align="center">
                  Aucune donnée disponible
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Prochain Tirage
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {nextDraw ? nextDraw.date : "Chargement..."}
              </Typography>
              {loading && !nextDraw ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : nextDraw ? (
                <>
                  <Typography variant="h3" color="primary" sx={{ my: 2, fontWeight: 'bold' }}>
                    {nextDraw.jackpot}
                  </Typography>
                  <Button variant="contained" color="primary" size="large">
                    Générer une Combinaison
                  </Button>
                </>
              ) : (
                <Typography variant="body1" align="center">
                  Aucune donnée disponible
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Onglets pour les différentes sections */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<BarChartIcon />} label="Statistiques" />
          <Tab icon={<LightbulbIcon />} label="Prédictions" />
          <Tab icon={<TimelineIcon />} label="Tendances" />
        </Tabs>
      </Box>
      
      {/* Contenu de l'onglet Statistiques */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Numéros Chauds
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, my: 2 }}>
                {loading ? (
                  <CircularProgress />
                ) : hotNumbers.length > 0 ? (
                  hotNumbers.map((number, index) => (
                    <NumberBall key={index} isHot>
                      {number}
                    </NumberBall>
                  ))
                ) : (
                  <Typography variant="body1">
                    Aucune donnée disponible
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="textSecondary">
                Les numéros chauds sont ceux qui apparaissent le plus fréquemment dans les tirages récents.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Numéros Froids
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, my: 2 }}>
                {loading ? (
                  <CircularProgress />
                ) : coldNumbers.length > 0 ? (
                  coldNumbers.map((number, index) => (
                    <NumberBall key={index}>
                      {number}
                    </NumberBall>
                  ))
                ) : (
                  <Typography variant="body1">
                    Aucune donnée disponible
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="textSecondary">
                Les numéros froids sont ceux qui apparaissent le moins fréquemment dans les tirages récents.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Étoiles Chaudes
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, my: 2 }}>
                {loading ? (
                  <CircularProgress />
                ) : hotStars.length > 0 ? (
                  hotStars.map((star, index) => (
                    <StarBall key={index} isHot>
                      {star}
                    </StarBall>
                  ))
                ) : (
                  <Typography variant="body1">
                    Aucune donnée disponible
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="textSecondary">
                Les étoiles chaudes sont celles qui apparaissent le plus fréquemment dans les tirages récents.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Étoiles Froides
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, my: 2 }}>
                {loading ? (
                  <CircularProgress />
                ) : coldStars.length > 0 ? (
                  coldStars.map((star, index) => (
                    <StarBall key={index}>
                      {star}
                    </StarBall>
                  ))
                ) : (
                  <Typography variant="body1">
                    Aucune donnée disponible
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="textSecondary">
                Les étoiles froides sont celles qui apparaissent le moins fréquemment dans les tirages récents.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<BarChartIcon />}
                sx={{ mr: 2 }}
              >
                Statistiques Détaillées
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                startIcon={<TimelineIcon />}
              >
                Analyse des Écarts
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
      
      {/* Contenu de l'onglet Prédictions */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom align="center">
                Combinaisons Recommandées
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                Générées par notre système d'intelligence artificielle
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : suggestedCombinations.length > 0 ? (
                <Grid container spacing={2}>
                  {suggestedCombinations.map((combo, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Combination 
                        numbers={combo.numbers} 
                        stars={combo.stars} 
                        confidence={combo.confidence} 
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" align="center">
                  Aucune combinaison disponible
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  startIcon={<RefreshIcon />}
                  disabled={loading}
                >
                  Générer de Nouvelles Combinaisons
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Stratégies de Génération
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Conservatrice
                      </Typography>
                      <Typography variant="body2">
                        Favorise les numéros fréquents et les patterns établis pour maximiser les chances de gains.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 2 }}
                      >
                        Sélectionner
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ border: `2px solid ${theme.palette.primary.main}` }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Équilibrée
                      </Typography>
                      <Typography variant="body2">
                        Mélange de numéros fréquents et rares pour un équilibre entre probabilité et potentiel de gain.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 2 }}
                      >
                        Sélectionnée
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Risquée
                      </Typography>
                      <Typography variant="body2">
                        Privilégie les numéros rares et les combinaisons peu communes pour des gains potentiels plus élevés.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 2 }}
                      >
                        Sélectionner
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Contenu de l'onglet Tendances */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Tendances Récentes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : recentTrends.length > 0 ? (
                <Grid container spacing={2}>
                  {recentTrends.map((trend, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">
                              {trend.label}
                            </Typography>
                            <Typography 
                              variant="h5" 
                              color={
                                trend.trend === 'up' 
                                  ? 'success.main' 
                                  : trend.trend === 'down' 
                                    ? 'error.main' 
                                    : 'text.secondary'
                              }
                            >
                              {trend.value}
                              {trend.trend === 'up' && ' ↑'}
                              {trend.trend === 'down' && ' ↓'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" align="center">
                  Aucune tendance disponible
                </Typography>
              )}
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Analyse des 10 derniers tirages
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  L'analyse des tendances récentes montre une légère préférence pour les numéros pairs et une distribution équilibrée entre les numéros bas (1-25) et hauts (26-50). Les écarts entre apparitions restent dans la moyenne historique.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<TrendingUpIcon />}
                >
                  Voir l'Analyse Complète
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;
