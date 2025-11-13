import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VaultPage from './pages/VaultPage';
import MfaPage from './pages/MfaPage';
import { Container } from '@mui/material';

function App() {
  return (
    <div style={{width:"100vw", display:"flex", justifyContent:"center"}} >
      <div style={{maxWidth:"fit"}}>
    <AuthProvider>
      <Router>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<VaultPage />} />
              <Route path="/vault" element={<VaultPage />} />
              <Route path="/setup-mfa" element={<MfaPage />} />
            </Route>
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
    </div></div>
  );
}

export default App;