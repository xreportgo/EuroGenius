import React, { useState } from 'react';
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
  useTheme
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { NumberBall, StarBall, Combination } from '../components/LotteryComponents';

// Composant de la page d'accueil
const HomePage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  
  // Données fictives pour la démo
  const lastDraw = {
    date: '23 Mars 2025',
    numbers: [7, 12, 23, 34, 45],
    stars: [3, 9],
    jackpot: '130 000 000 €'
  };
  
  const nextDraw = {
    date: '26 Mars 2025',
    jackpot: '145 000 000 €'
  };
  
  const hotNumbers = [7, 15, 23, 31, 42];
  const coldNumbers = [2, 11, 25, 38, 49];
  const hotStars = [3, 8];
  const coldStars = [1, 11];
  
  const recentTrends = [
    { label: 'Numéros pairs', value: '52%', trend: 'up' },
    { label: 'Numéros < 25', value: '48%', trend: 'down' },
    { label: 'Écart max', value: '12 tirages', trend: 'neutral' }
  ];
  
  const suggestedCombinations = [
    { numbers: [3, 17, 23, 34, 42], stars: [2, 9], confidence: 4.5 },
    { numbers: [7, 12, 19, 28, 45], stars: [3, 8], confidence: 4.2 },
    { numbers: [5, 14, 27, 36, 41], stars: [5, 10], confidence: 3.8 }
  ];
  
  // Gestionnaire de changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête avec dernier tirage et prochain jackpot */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Dernier Tirage" 
              subheader={lastDraw.date}
              action={
                <IconButton aria-label="refresh">
                  <RefreshIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {lastDraw.numbers.map((number, index) => (
                  <NumberBall key={index} selected sx={{ mx: 0.5 }}>
                    {number}
                  </NumberBall>
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {lastDraw.stars.map((star, index) => (
                  <StarBall key={index} selected sx={{ mx: 0.5 }}>
                    {star}
                  </StarBall>
                ))}
              </Box>
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
                {nextDraw.date}
              </Typography>
              <Typography variant="h3" color="primary" sx={{ my: 2, fontWeight: 'bold' }}>
                {nextDraw.jackpot}
              </Typography>
              <Button variant="contained" color="primary" size="large">
                Générer une Combinaison
              </Button>
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
                {hotNumbers.map((number, index) => (
                  <NumberBall key={index} isHot>
                    {number}
                  </NumberBall>
                ))}
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
                {coldNumbers.map((number, index) => (
                  <NumberBall key={index}>
                    {number}
                  </NumberBall>
                ))}
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
                {hotStars.map((star, index) => (
                  <StarBall key={index} isHot>
                    {star}
                  </StarBall>
                ))}
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
                {coldStars.map((star, index) => (
                  <StarBall key={index}>
                    {star}
                  </StarBall>
                ))}
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
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  startIcon={<RefreshIcon />}
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
