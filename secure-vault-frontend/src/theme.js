import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ef4444', // Crimson Red
            light: '#f87171',
            dark: '#dc2626',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f97316', // Burnt Orange
            light: '#fb923c',
            dark: '#ea580c',
            contrastText: '#ffffff',
        },
        background: {
            default: '#18181b', // Gunmetal Grey (Zinc 900)
            paper: '#27272a',   // Zinc 800
        },
        text: {
            primary: '#f4f4f5', // Zinc 100
            secondary: '#a1a1aa', // Zinc 400
        },
        action: {
            hover: 'rgba(239, 68, 68, 0.08)',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: "#52525b #18181b",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "#18181b",
                        width: '8px',
                        height: '8px',
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#52525b",
                        minHeight: 24,
                        border: "2px solid #18181b",
                    },
                    "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                        backgroundColor: "#71717a",
                    },
                    "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                        backgroundColor: "#71717a",
                    },
                    "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#71717a",
                    },
                },
            },
        },
    },
});

export default theme;
