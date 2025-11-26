
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Toolbar>
        <Typography variant="h5" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'primary.main', fontWeight: 700 }}>
          Secure Vault
        </Typography>
        {auth.isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/vault" sx={{ mr: 2 }}>
              My Vault
            </Button>
            <Button variant="outlined" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login" sx={{ mr: 2 }}>
              Login
            </Button>
            <Button variant="contained" color="primary" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
