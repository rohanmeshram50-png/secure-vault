
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../services/authService';
import { deriveAuthKey } from '../services/cryptoService';
import { AuthContext } from '../context/AuthContext'; // Assuming AuthContext is available
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from '@mui/material';


const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // We might want to auto-login later, but for now just cleanup
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiRegister({ email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            Register
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Master Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
