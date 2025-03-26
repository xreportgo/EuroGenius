import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { NumberBall, StarBall, Combination } from '../components/LotteryComponents';

// Composant de la page de prédiction IA
const PredictionPage = () => {
  const theme = useTheme();
  const [strategy, setStrategy] = useState('balanced');
  const [confidence, setConfidence] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [combinations, setCombinations] = useState([]);
  
  // Données fictives pour la démo
  const modelInfo = {
    lastUpdate: '25 Mars 2025',
    accuracy: '68%',
    dataPoints: '2,345 tirages',
    modelType: 'LSTM + Transformer + Algorithme Génétique'
  };
  
  // Stratégies disponibles
  const strategies = [
    { 
      value: 'conservative', 
      label: 'Conservatrice', 
      description: 'Favorise les numéros fréquents et les patterns établis pour maximiser les chances de gains.',
      icon: <LightbulbIcon />
    },
    { 
      value: 'balanced', 
      label: 'Équilibrée', 
      description: 'Mélange de numéros fréquents et rares pour un équilibre entre probabilité et potentiel de gain.',
      icon: <AutoFixHighIcon />
    },
    { 
      value: 'risky', 
      label: 'Risquée', 
      description: 'Privilégie les numéros rares et les combinaisons peu communes pour des gains potentiels plus élevés.',
      icon: <PsychologyIcon />
    }
  ];
  
  // Gestionnaire de changement de stratégie
  const handleStrategyChange = (event) => {
    setStrategy(event.target.value);
  };
  
  // Gestionnaire de changement de niveau de confiance
  const handleConfidenceChange = (event, newValue) => {
    setConfidence(newValue);
  };
  
  // Fonction pour générer des combinaisons
  const generateCombinations = () => {
    setIsGenerating(true);
    
    // Simulation d'un appel API avec un délai
    setTimeout(() => {
      // Génération de combinaisons fictives
      const newCombinations = [];
      
      for (let i = 0; i < 5; i++) {
        // Génération de 5 numéros aléatoires entre 1 et 50
        const numbers = [];
        while (numbers.length < 5) {
          const num = Math.floor(Math.random() * 50) + 1;
          if (!numbers.includes(num)) {
            numbers.push(num);
          }
        }
        numbers.sort((a, b) => a - b);
        
        // Génération de 2 étoiles aléatoires entre 1 et 12
        const stars = [];
        while (stars.length < 2) {
          const star = Math.floor(Math.random() * 12) + 1;
          if (!stars.includes(star)) {
            stars.push(star);
          }
        }
        stars.sort((a, b) => a - b);
        
        // Calcul d'un score de confiance basé sur la stratégie et le niveau de confiance
        let baseConfidence;
        if (strategy === 'conservative') {
          baseConfidence = 3.5 + Math.random();
        } else if (strategy === 'balanced') {
          baseConfidence = 3.0 + Math.random() * 1.5;
        } else {
          baseConfidence = 2.5 + Math.random() * 2;
        }
        
        // Ajustement en fonction du niveau de confiance demandé
        const adjustedConfidence = (baseConfidence + confidence) / 2;
        const finalConfidence = Math.min(5, Math.max(1, adjustedConfidence)).toFixed(1);
        
        newCombinations.push({
          numbers,
          stars,
          confidence: parseFloat(finalConfidence),
          strategy
        });
      }
      
      // Tri par niveau de confiance
      newCombinations.sort((a, b) => b.confidence - a.confidence);
      
      setCombinations(newCombinations);
      setIsGenerating(false);
    }, 2000);
  };
  
  // Génération initiale de combinaisons
  useEffect(() => {
    generateCombinations();
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Prédictions IA
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Utilisez notre système d'intelligence artificielle avancé pour générer des combinaisons optimisées pour EuroMillions.
      </Typography>
      
      {/* Informations sur le modèle */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              <PsychologyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Système d'IA EuroGenius
            </Typography>
            <Typography variant="body2" paragraph>
              Notre système d'intelligence artificielle combine plusieurs modèles avancés pour analyser les tirages historiques et identifier des patterns subtils. Il utilise des réseaux de neurones récurrents (LSTM), des Transformers pour la détection de motifs complexes, et des algorithmes génétiques pour explorer l'espace des combinaisons possibles.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Dernière mise à jour
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {modelInfo.lastUpdate}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Précision historique
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {modelInfo.accuracy}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Données analysées
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {modelInfo.dataPoints}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Type de modèle
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  Ensemble
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SettingsSuggestIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Paramètres Avancés
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Accédez aux paramètres avancés pour personnaliser les algorithmes selon vos préférences.
                </Typography>
                <Button variant="outlined" color="primary">
                  Mode Expert
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Options de génération */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Stratégie de Génération
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Stratégie</InputLabel>
              <Select
                value={strategy}
                onChange={handleStrategyChange}
                label="Stratégie"
              >
                {strategies.map((strat) => (
                  <MenuItem value={strat.value} key={strat.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {React.cloneElement(strat.icon, { sx: { mr: 1 } })}
                      {strat.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                {strategies.find(s => s.value === strategy)?.description}
              </Typography>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Niveau de Confiance Minimum
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={confidence}
                min={1}
                max={5}
                step={0.5}
                marks={[
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' }
                ]}
                valueLabelDisplay="auto"
                onChange={handleConfidenceChange}
              />
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 3 }}>
              Sélectionnez le niveau de confiance minimum pour les combinaisons générées.
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
              onClick={generateCombinations}
              disabled={isGenerating}
            >
              {isGenerating ? 'Génération en cours...' : 'Générer des Combinaisons'}
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Combinaisons Recommandées
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Voici les combinaisons générées par notre système d'intelligence artificielle, classées par niveau de confiance.
            </Typography>
            
            {isGenerating ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {combinations.map((combo, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined" sx={{ 
                      borderLeft: `4px solid ${
                        combo.confidence >= 4.5 ? theme.palette.success.main :
                        combo.confidence >= 3.5 ? theme.palette.primary.main :
                        combo.confidence >= 2.5 ? theme.palette.warning.main :
                        theme.palette.error.main
                      }`
                    }}>
                      <CardContent>
                        <Grid container alignItems="center">
                          <Grid item xs={12} md={7}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: { xs: 2, md: 0 } }}>
                              <Box sx={{ display: 'flex', mb: { xs: 2, sm: 0 } }}>
                                {combo.numbers.map((number, idx) => (
                                  <NumberBall key={idx} selected sx={{ mx: 0.5 }}>
                                    {number}
                                  </NumberBall>
                                ))}
                              </Box>
                              <Box sx={{ display: 'flex', mx: { xs: 0, sm: 2 } }}>
                                {combo.stars.map((star, idx) => (
                                  <StarBall key={idx} selected sx={{ mx: 0.5 }}>
                                    {star}
                                  </StarBall>
                                ))}
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                <Chip 
                                  label={`Confiance: ${combo.confidence}/5`} 
                                  color={
                                    combo.confidence >= 4.5 ? 'success' :
                                    combo.confidence >= 3.5 ? 'primary' :
                                    combo.confidence >= 2.5 ? 'warning' :
                                    'error'
                                  }
                                  size="small"
                                />
                                <Chip 
                                  label={strategies.find(s => s.value === combo.strategy)?.label} 
                                  variant="outlined"
                                  size="small"
                                  icon={React.cloneElement(strategies.find(s => s.value === combo.strategy)?.icon, { fontSize: 'small' })}
                                />
                              </Stack>
                              <Button variant="outlined" size="small">
                                Sauvegarder
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {!isGenerating && combinations.length > 0 && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={generateCombinations}
                >
                  Générer Plus de Combinaisons
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Informations supplémentaires */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          À propos des Prédictions IA
        </Typography>
        <Typography variant="body2" paragraph>
          Notre système d'intelligence artificielle analyse des milliers de tirages historiques pour identifier des patterns et tendances. Cependant, il est important de noter que les tirages EuroMillions sont fondamentalement aléatoires, et aucun système ne peut garantir des gains.
        </Typography>
        <Typography variant="body2" paragraph>
          Le score de confiance indique la cohérence de la combinaison avec les patterns historiques et les prédictions de nos modèles, mais ne représente pas une probabilité de gain. Utilisez ces prédictions comme un outil complémentaire à votre propre stratégie de jeu.
        </Typography>
        <Typography variant="body2" color="error">
          Jouez de manière responsable. EuroGenius encourage le jeu modéré et responsable.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PredictionPage;
