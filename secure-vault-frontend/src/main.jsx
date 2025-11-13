import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00E0FF', // Electric Blue
    },
    secondary: {
      main: '#00FF80', // Neon Green
    },
    background: {
      default: '#0A1929', // Very dark blue
      paper: '#132F4C',   // Slightly lighter dark blue for surfaces
    },
    text: {
      primary: '#E0E0E0', // Light gray
      secondary: '#00E0FF', // Use primary for secondary text for techy feel
    },
  },
  typography: {
    fontFamily: [
      'Share Tech Mono', // A sci-fi monospace font (if available)
      'Roboto Mono',     // Another monospace option
      'monospace',       // Generic monospace fallback
      'sans-serif',      // General sans-serif fallback
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Slightly rounded buttons
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // More rounded corners for cards/surfaces
          boxShadow: '0px 0px 15px rgba(0, 224, 255, 0.3)', // Subtle glow
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: '0px 0px 15px rgba(0, 224, 255, 0.3)', // Subtle glow for table
          borderRadius: '12px',
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
