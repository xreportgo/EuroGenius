// Thème EuroGenius basé sur le design minimaliste suisse
import { createTheme } from '@mui/material/styles';

// Palette de couleurs définie dans le concept
const colors = {
  black: '#121212',
  white: '#FFFFFF',
  orange: '#FF6D00',
  blue: '#1976D2',
  green: '#2E7D32',
  // Couleurs supplémentaires pour l'interface
  lightGrey: '#F5F5F5',
  darkGrey: '#333333',
  mediumGrey: '#9E9E9E',
  errorRed: '#D32F2F',
  warningYellow: '#FFC107',
};

// Création du thème clair
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.orange,
      light: '#FF9E40',
      dark: '#C43C00',
      contrastText: colors.white,
    },
    secondary: {
      main: colors.blue,
      light: '#63A4FF',
      dark: '#004BA0',
      contrastText: colors.white,
    },
    success: {
      main: colors.green,
      light: '#60AD5E',
      dark: '#005005',
      contrastText: colors.white,
    },
    background: {
      default: colors.white,
      paper: colors.lightGrey,
    },
    text: {
      primary: colors.black,
      secondary: colors.darkGrey,
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '0.0075em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '0.01071em',
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#FF8124',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
  },
});

// Création du thème sombre
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.orange,
      light: '#FF9E40',
      dark: '#C43C00',
      contrastText: colors.black,
    },
    secondary: {
      main: colors.blue,
      light: '#63A4FF',
      dark: '#004BA0',
      contrastText: colors.black,
    },
    success: {
      main: colors.green,
      light: '#60AD5E',
      dark: '#005005',
      contrastText: colors.black,
    },
    background: {
      default: colors.black,
      paper: colors.darkGrey,
    },
    text: {
      primary: colors.white,
      secondary: colors.lightGrey,
    },
  },
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  components: {
    ...lightTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: 8,
          backgroundColor: '#1E1E1E',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
        },
      },
    },
  },
});

export { lightTheme, darkTheme, colors };
