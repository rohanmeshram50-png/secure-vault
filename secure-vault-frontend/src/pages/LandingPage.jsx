import React from 'react';

import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Paper, useTheme } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import SpeedIcon from '@mui/icons-material/Speed';

const LandingPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    py: 8,
                    background: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}1A 0%, ${theme.palette.background.default}00 50%)`,
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" component="h1" gutterBottom sx={{
                        background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2
                    }}>
                        Secure Your Digital Life
                    </Typography>
                    <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                        The most advanced and secure vault for your passwords and sensitive data.
                        Encrypted with military-grade algorithms and accessible anywhere.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => navigate('/register')}
                            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                        >
                            Login
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <SecurityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>Military-Grade Encryption</Typography>
                            <Typography color="text.secondary">
                                Your data is encrypted using AES-256 before it ever leaves your device. Only you hold the key.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <LockIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>Zero-Knowledge Architecture</Typography>
                            <Typography color="text.secondary">
                                We can't see your data even if we wanted to. Your master password never reaches our servers.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <SpeedIcon sx={{ fontSize: 60, color: 'primary.light', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>Lightning Fast Access</Typography>
                            <Typography color="text.secondary">
                                Access your credentials instantly from any device with our optimized and responsive interface.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Footer */}
            <Box sx={{ py: 4, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Secure Vault. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default LandingPage;
