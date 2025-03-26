import React from 'react';
import { Box, Typography, Container, Grid, Paper, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

// Composant stylisé pour les cartes de numéros
const NumberBall = styled(Paper)(({ theme, selected, isHot }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  backgroundColor: selected 
    ? theme.palette.primary.main 
    : isHot 
      ? theme.palette.success.light
      : theme.palette.mode === 'dark' 
        ? theme.palette.background.paper 
        : theme.palette.background.default,
  color: selected 
    ? theme.palette.primary.contrastText 
    : isHot 
      ? theme.palette.success.contrastText
      : theme.palette.text.primary,
  border: `2px solid ${selected 
    ? theme.palette.primary.main 
    : isHot 
      ? theme.palette.success.main
      : theme.palette.divider}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[3],
  },
}));

// Composant stylisé pour les cartes d'étoiles
const StarBall = styled(Paper)(({ theme, selected, isHot }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  backgroundColor: selected 
    ? theme.palette.secondary.main 
    : isHot 
      ? theme.palette.success.light
      : theme.palette.mode === 'dark' 
        ? theme.palette.background.paper 
        : theme.palette.background.default,
  color: selected 
    ? theme.palette.secondary.contrastText 
    : isHot 
      ? theme.palette.success.contrastText
      : theme.palette.text.primary,
  border: `2px solid ${selected 
    ? theme.palette.secondary.main 
    : isHot 
      ? theme.palette.success.main
      : theme.palette.divider}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[3],
  },
}));

// Composant pour afficher une grille de numéros
const NumberGrid = ({ title, numbers, selectedNumbers, hotNumbers, onNumberClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Génération de tous les numéros de 1 à 50
  const allNumbers = Array.from({ length: 50 }, (_, i) => i + 1);
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Grid container spacing={1} justifyContent="center">
        {allNumbers.map((number) => (
          <Grid item key={number}>
            <NumberBall 
              selected={selectedNumbers?.includes(number)} 
              isHot={hotNumbers?.includes(number)}
              onClick={() => onNumberClick && onNumberClick(number)}
            >
              {number}
            </NumberBall>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Composant pour afficher une grille d'étoiles
const StarGrid = ({ title, stars, selectedStars, hotStars, onStarClick }) => {
  const theme = useTheme();
  
  // Génération de toutes les étoiles de 1 à 12
  const allStars = Array.from({ length: 12 }, (_, i) => i + 1);
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Grid container spacing={1} justifyContent="center">
        {allStars.map((star) => (
          <Grid item key={star}>
            <StarBall 
              selected={selectedStars?.includes(star)} 
              isHot={hotStars?.includes(star)}
              onClick={() => onStarClick && onStarClick(star)}
            >
              {star}
            </StarBall>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Composant pour afficher une combinaison complète
const Combination = ({ numbers, stars, confidence }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mb: 2, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        borderLeft: confidence ? `4px solid ${theme.palette.success.main}` : 'none'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        {numbers.map((number, index) => (
          <NumberBall key={index} selected sx={{ mx: 0.5 }}>
            {number}
          </NumberBall>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        {stars.map((star, index) => (
          <StarBall key={index} selected sx={{ mx: 0.5 }}>
            {star}
          </StarBall>
        ))}
      </Box>
      {confidence && (
        <Typography variant="body2" color="textSecondary">
          Indice de confiance: {confidence}/5
        </Typography>
      )}
    </Paper>
  );
};

export { NumberGrid, StarGrid, NumberBall, StarBall, Combination };
