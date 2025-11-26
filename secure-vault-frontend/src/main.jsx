import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff', // Pure White for high contrast
      light: '#f8fafc', // Slate 50
      dark: '#e2e8f0', // Slate 200
      contrastText: '#0f172a', // Slate 900
    },
    secondary: {
      main: '#94a3b8', // Slate 400
      light: '#cbd5e1', // Slate 300
      dark: '#64748b', // Slate 500
      contrastText: '#ffffff',
    },
    background: {
      default: '#000000', // Pure Black (Apple style)
      paper: '#1c1c1e', // Apple Dark Gray
    },
    text: {
      primary: '#f5f5f7', // Apple Off-White
      secondary: '#86868b', // Apple Grey
    },
    error: {
      main: '#ff453a', // Apple Red
    },
    success: {
      main: '#30d158', // Apple Green
    },
    warning: {
      main: '#ff9f0a', // Apple Orange
    },
    info: {
      main: '#0a84ff', // Apple Blue
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          backgroundImage: 'none', // Remove gradient for cleaner look
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Slightly tighter radius
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#e5e5e5',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1c1c1e',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)', // Deeper, softer shadow
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff',
            },
            '& input': {
              color: '#ffffff',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#86868b',
            '&.Mui-focused': {
              color: '#ffffff',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#f5f5f7',
        },
        head: {
          fontWeight: 600,
          color: '#86868b',
          backgroundColor: '#1c1c1e',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(28, 28, 30, 0.8)', // Translucent
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
