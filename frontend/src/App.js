import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Switch, 
  useTheme, 
  ThemeProvider, 
  CssBaseline 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { lightTheme, darkTheme } from './styles/theme';
import HomePage from './pages/HomePage';
import StatisticsPage from './pages/StatisticsPage';
import PredictionPage from './pages/PredictionPage';

// Composant principal de l'application
const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  
  // Thème actuel
  const theme = darkMode ? darkTheme : lightTheme;
  
  // Gestionnaire de changement de thème
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };
  
  // Gestionnaire d'ouverture/fermeture du drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  // Gestionnaire de changement de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setDrawerOpen(false);
  };
  
  // Rendu de la page actuelle
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'prediction':
        return <PredictionPage />;
      default:
        return <HomePage />;
    }
  };
  
  // Contenu du drawer
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          EuroGenius
        </Typography>
        <IconButton color="inherit" onClick={handleThemeChange}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => handlePageChange('home')} selected={currentPage === 'home'}>
          <ListItemIcon>
            <HomeIcon color={currentPage === 'home' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Accueil" />
        </ListItem>
        <ListItem button onClick={() => handlePageChange('statistics')} selected={currentPage === 'statistics'}>
          <ListItemIcon>
            <BarChartIcon color={currentPage === 'statistics' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Statistiques" />
        </ListItem>
        <ListItem button onClick={() => handlePageChange('prediction')} selected={currentPage === 'prediction'}>
          <ListItemIcon>
            <PsychologyIcon color={currentPage === 'prediction' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Prédictions IA" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Historique" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
      </List>
    </Box>
  );
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              EuroGenius
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={handleThemeChange}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <Button color="inherit">Connexion</Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          {drawerContent}
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          {renderCurrentPage()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
