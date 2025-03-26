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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  useTheme
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import TuneIcon from '@mui/icons-material/Tune';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { NumberGrid, StarGrid, Combination } from '../components/LotteryComponents';

// Composant de la page d'analyse statistique détaillée
const StatisticsPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('frequency');
  
  // Données fictives pour la démo
  const numberStats = Array.from({ length: 50 }, (_, i) => ({
    number: i + 1,
    frequency: Math.floor(Math.random() * 100),
    percentage: (Math.random() * 20).toFixed(2),
    lastDrawn: Math.floor(Math.random() * 20),
    averageGap: (Math.random() * 10 + 2).toFixed(1),
    isHot: Math.random() > 0.7
  })).sort((a, b) => b.frequency - a.frequency);
  
  const starStats = Array.from({ length: 12 }, (_, i) => ({
    star: i + 1,
    frequency: Math.floor(Math.random() * 100),
    percentage: (Math.random() * 20).toFixed(2),
    lastDrawn: Math.floor(Math.random() * 20),
    averageGap: (Math.random() * 10 + 2).toFixed(1),
    isHot: Math.random() > 0.7
  })).sort((a, b) => b.frequency - a.frequency);
  
  const pairStats = [
    { pair: [3, 17], frequency: 12, percentage: "2.4%" },
    { pair: [7, 23], frequency: 10, percentage: "2.0%" },
    { pair: [12, 34], frequency: 9, percentage: "1.8%" },
    { pair: [5, 42], frequency: 8, percentage: "1.6%" },
    { pair: [15, 31], frequency: 7, percentage: "1.4%" },
  ];
  
  const tripletStats = [
    { triplet: [3, 17, 23], frequency: 5, percentage: "1.0%" },
    { triplet: [7, 12, 34], frequency: 4, percentage: "0.8%" },
    { triplet: [5, 15, 42], frequency: 3, percentage: "0.6%" },
    { triplet: [9, 21, 37], frequency: 3, percentage: "0.6%" },
    { triplet: [11, 25, 49], frequency: 2, percentage: "0.4%" },
  ];
  
  // Gestionnaire de changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Gestionnaire de changement de plage de temps
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  // Gestionnaire de changement de tri
  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };
  
  // Tri des statistiques en fonction des critères sélectionnés
  useEffect(() => {
    // Logique de tri qui serait implémentée ici
    // Dans une application réelle, cela déclencherait une requête API
  }, [timeRange, sortBy]);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Analyse Statistique
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Explorez les statistiques détaillées des tirages EuroMillions pour identifier les tendances et patterns.
      </Typography>
      
      {/* Filtres et options */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Période d'analyse</InputLabel>
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
                label="Période d'analyse"
              >
                <MenuItem value="all">Tous les tirages</MenuItem>
                <MenuItem value="year">Dernière année</MenuItem>
                <MenuItem value="6months">6 derniers mois</MenuItem>
                <MenuItem value="3months">3 derniers mois</MenuItem>
                <MenuItem value="month">Dernier mois</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortByChange}
                label="Trier par"
              >
                <MenuItem value="frequency">Fréquence (décroissante)</MenuItem>
                <MenuItem value="frequencyAsc">Fréquence (croissante)</MenuItem>
                <MenuItem value="number">Numéro</MenuItem>
                <MenuItem value="lastDrawn">Dernier tirage</MenuItem>
                <MenuItem value="gap">Écart moyen</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<TuneIcon />}
              fullWidth
            >
              Appliquer les filtres
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Onglets pour les différentes analyses */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<BarChartIcon />} label="Fréquences" />
          <Tab icon={<TimelineIcon />} label="Écarts" />
          <Tab icon={<AutoGraphIcon />} label="Combinaisons" />
        </Tabs>
      </Box>
      
      {/* Contenu de l'onglet Fréquences */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Fréquence des Numéros
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {numberStats.slice(0, 10).map((stat) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={stat.number}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: '50%', 
                              bgcolor: stat.isHot ? 'success.light' : 'background.paper',
                              border: `2px solid ${stat.isHot ? theme.palette.success.main : theme.palette.divider}`,
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center',
                              fontWeight: 'bold',
                              mr: 2
                            }}
                          >
                            {stat.number}
                          </Box>
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Fréquence
                            </Typography>
                            <Typography variant="h6">
                              {stat.frequency} ({stat.percentage}%)
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Dernier tirage: {stat.lastDrawn} tirages
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Écart moyen: {stat.averageGap}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button variant="outlined" color="primary">
                  Voir tous les numéros
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Fréquence des Étoiles
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {starStats.map((stat) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={stat.star}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: '50%', 
                              bgcolor: stat.isHot ? 'success.light' : 'background.paper',
                              border: `2px solid ${stat.isHot ? theme.palette.success.main : theme.palette.divider}`,
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center',
                              fontWeight: 'bold',
                              mb: 1
                            }}
                          >
                            {stat.star}
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            Fréquence
                          </Typography>
                          <Typography variant="h6">
                            {stat.frequency}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {stat.percentage}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Contenu de l'onglet Écarts */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Analyse des Écarts
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                L'écart représente le nombre de tirages entre deux apparitions d'un même numéro.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader title="Écarts Actuels (Numéros)" />
                    <CardContent>
                      <Typography variant="body2" paragraph>
                        Les numéros suivants n'ont pas été tirés depuis le plus longtemps :
                      </Typography>
                      
                      <Grid container spacing={1}>
                        {numberStats
                          .sort((a, b) => b.lastDrawn - a.lastDrawn)
                          .slice(0, 5)
                          .map((stat) => (
                            <Grid item xs={12} key={stat.number}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box 
                                  sx={{ 
                                    width: 36, 
                                    height: 36, 
                                    borderRadius: '50%', 
                                    bgcolor: 'background.paper',
                                    border: `1px solid ${theme.palette.divider}`,
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    fontWeight: 'bold',
                                    mr: 2
                                  }}
                                >
                                  {stat.number}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="body2">
                                    Écart actuel: {stat.lastDrawn} tirages
                                  </Typography>
                                  <Slider
                                    value={stat.lastDrawn}
                                    max={30}
                                    valueLabelDisplay="auto"
                                    disabled
                                    sx={{ 
                                      color: stat.lastDrawn > 20 ? 'error.main' : 'primary.main',
                                      height: 8
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader title="Écarts Actuels (Étoiles)" />
                    <CardContent>
                      <Typography variant="body2" paragraph>
                        Les étoiles suivantes n'ont pas été tirées depuis le plus longtemps :
                      </Typography>
                      
                      <Grid container spacing={1}>
                        {starStats
                          .sort((a, b) => b.lastDrawn - a.lastDrawn)
                          .slice(0, 5)
                          .map((stat) => (
                            <Grid item xs={12} key={stat.star}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box 
                                  sx={{ 
                                    width: 36, 
                                    height: 36, 
                                    borderRadius: '50%', 
                                    bgcolor: 'background.paper',
                                    border: `1px solid ${theme.palette.divider}`,
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    fontWeight: 'bold',
                                    mr: 2
                                  }}
                                >
                                  {stat.star}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="body2">
                                    Écart actuel: {stat.lastDrawn} tirages
                                  </Typography>
                                  <Slider
                                    value={stat.lastDrawn}
                                    max={30}
                                    valueLabelDisplay="auto"
                                    disabled
                                    sx={{ 
                                      color: stat.lastDrawn > 15 ? 'error.main' : 'primary.main',
                                      height: 8
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardHeader title="Écarts Moyens" />
                    <CardContent>
                      <Typography variant="body2" paragraph>
                        L'écart moyen représente le nombre moyen de tirages entre deux apparitions d'un même numéro.
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            Numéros avec les écarts moyens les plus courts
                          </Typography>
                          <Grid container spacing={1}>
                            {numberStats
                              .sort((a, b) => a.averageGap - b.averageGap)
                              .slice(0, 5)
                              .map((stat) => (
                                <Grid item xs={12} key={stat.number}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Box 
                                        sx={{ 
                                          width: 36, 
                                          height: 36, 
                                          borderRadius: '50%', 
                                          bgcolor: 'success.light',
                                          display: 'flex', 
                                          justifyContent: 'center', 
                                          alignItems: 'center',
                                          fontWeight: 'bold',
                                          mr: 2
                                        }}
                                      >
                                        {stat.number}
                                      </Box>
                                      <Typography>
                                        Écart moyen: {stat.averageGap} tirages
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              ))}
                          </Grid>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            Numéros avec les écarts moyens les plus longs
                          </Typography>
                          <Grid container spacing={1}>
                            {numberStats
                              .sort((a, b) => b.averageGap - a.averageGap)
                              .slice(0, 5)
                              .map((stat) => (
                                <Grid item xs={12} key={stat.number}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Box 
                                        sx={{ 
                                          width: 36, 
                                          height: 36, 
                                          borderRadius: '50%', 
                                          bgcolor: 'error.light',
                                          display: 'flex', 
                                          justifyContent: 'center', 
                                          alignItems: 'center',
                                          fontWeight: 'bold',
                                          mr: 2
                                        }}
                                      >
                                        {stat.number}
                                      </Box>
                                      <Typography>
                                        Écart moyen: {stat.averageGap} tirages
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              ))}
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Contenu de l'onglet Combinaisons */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Paires Fréquentes
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Les paires de numéros qui apparaissent le plus souvent ensemble dans les tirages.
              </Typography>
              
              <Grid container spacing={2}>
                {pairStats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          {stat.pair.map((number, idx) => (
                            <Box 
                              key={idx}
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: '50%', 
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                fontWeight: 'bold',
                                mx: 1
                              }}
                            >
                              {number}
                            </Box>
                          ))}
                        </Box>
                        <Typography variant="body1" align="center">
                          {stat.frequency} tirages ({stat.percentage})
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button variant="outlined" color="primary">
                  Voir toutes les paires
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Triplets Fréquents
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Les triplets de numéros qui apparaissent le plus souvent ensemble dans les tirages.
              </Typography>
              
              <Grid container spacing={2}>
                {tripletStats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          {stat.triplet.map((number, idx) => (
                            <Box 
                              key={idx}
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: '50%', 
                                bgcolor: 'secondary.light',
                                color: 'secondary.contrastText',
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                fontWeight: 'bold',
                                mx: 0.5
                              }}
                            >
                              {number}
                            </Box>
                          ))}
                        </Box>
                        <Typography variant="body1" align="center">
                          {stat.frequency} tirages ({stat.percentage})
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button variant="outlined" color="primary">
                  Voir tous les triplets
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default StatisticsPage;
