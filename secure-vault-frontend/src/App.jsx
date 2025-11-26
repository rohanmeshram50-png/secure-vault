import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VaultPage from './pages/VaultPage';
import MfaPage from './pages/MfaPage';
import LandingPage from './pages/LandingPage';
import { Container, useTheme } from '@mui/material';

function App() {
  const theme = useTheme();

  return (
    <div style={{ width: "100vw", display: "flex", justifyContent: "center", minHeight: '100vh', backgroundColor: theme.palette.background.default }} >
      <div style={{ width: "100%", maxWidth: "100%" }}>
        <AuthProvider>
          <Router>
            <Navbar />
            <Container sx={{ mt: 4 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/vault" element={<VaultPage />} />
                  <Route path="/setup-mfa" element={<MfaPage />} />
                </Route>
              </Routes>
            </Container>
          </Router>
        </AuthProvider>
      </div>
    </div>
  );
}

export default App;