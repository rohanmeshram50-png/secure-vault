import React, { useState, useEffect, useContext } from 'react';
import { getVault, updateVault } from '../services/vaultService';
import { AuthContext } from '../context/AuthContext';
import { encrypt, decrypt } from '../services/cryptoService';
import { TextField, Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Alert, Box, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const VaultPage = () => {
  const [vaultData, setVaultData] = useState([]);
  const [decryptedVault, setDecryptedVault] = useState([{ platform: '', username: '', password: '' }]);
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext);
  const [tempPassword, setTempPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const getMasterPassword = () => auth.masterPassword || tempPassword;

  useEffect(() => {
    const fetchAndDecryptVault = async () => {
      try {
        const masterPassword = getMasterPassword();
        if (!masterPassword) {
          return;
        }

        const { data } = await getVault();
        if (data.encryptedBlob) {
          try {
            const decrypted = decrypt(data.encryptedBlob, masterPassword);
            const parsedData = JSON.parse(decrypted);
            setDecryptedVault(parsedData);
          } catch (e) {
            console.error(e);
            setError('Failed to decrypt vault. The master password may be incorrect or the data corrupted.');
          }
        } else {
          setDecryptedVault([{ platform: '', username: '', password: '' }]); // Initialize with one empty row
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An unexpected error occurred while fetching the vault.');
        }
      }
    };

    if (auth.isAuthenticated) {
      fetchAndDecryptVault();
    }
  }, [auth.isAuthenticated, auth.masterPassword, tempPassword]);

  const handleUpdate = async () => {
    try {
      let masterPassword;
      try {
        masterPassword = getMasterPassword();
      } catch (e) {
        console.error("Error getting master password:", e);
        setError("An internal error occurred while retrieving the master password.");
        return;
      }

      if (!masterPassword) {
        setError('Master password is not available. Please enter it below.');
        return;
      }
      const encryptedBlob = encrypt(JSON.stringify(decryptedVault), masterPassword);
      await updateVault(encryptedBlob);
      setSnackbarMessage('Vault updated successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error during vault update:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'An unexpected error occurred while updating the vault.');
      }
    }
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password)
      .then(() => {
        setSnackbarMessage('Password copied to clipboard!');
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error('Failed to copy password: ', err);
        setSnackbarMessage('Failed to copy password.');
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // If master password is not in AuthContext, prompt the user for it
  if (auth.isAuthenticated && !auth.masterPassword && !tempPassword) {
    return (
      <Container maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
              Session Found
            </Typography>
            <Typography gutterBottom align="center" color="text.secondary" sx={{ mb: 3 }}>
              To decrypt your vault, please re-enter your master password.
            </Typography>
            <form onSubmit={(e) => { e.preventDefault(); setTempPassword(document.getElementById('temp-password').value); }} style={{ width: '100%' }}>
              <TextField
                id="temp-password"
                label="Master Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Unlock Vault
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    );
  }

  const handleCellChange = (index, field, value) => {
    const newVault = [...decryptedVault];
    newVault[index][field] = value;
    setDecryptedVault(newVault);
  };

  const handleAddRow = () => {
    setDecryptedVault([...decryptedVault, { platform: '', username: '', password: '' }]);
  };

  const handleRemoveRow = (index) => {
    const newVault = decryptedVault.filter((_, i) => i !== index);
    setDecryptedVault(newVault);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, background: 'linear-gradient(to right, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          My Vault
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            sx={{ mr: 2 }}
          >
            Add Item
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleUpdate}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="30%">Platform</TableCell>
              <TableCell width="30%">Username</TableCell>
              <TableCell width="30%">Password</TableCell>
              <TableCell width="10%" align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {decryptedVault.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <TextField
                    value={row.platform}
                    onChange={(e) => handleCellChange(index, 'platform', e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="e.g. Google"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.username}
                    onChange={(e) => handleCellChange(index, 'username', e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="email@example.com"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      value={row.password}
                      onChange={(e) => handleCellChange(index, 'password', e.target.value)}
                      type="password"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="********"
                    />
                    <Tooltip title="Copy Password">
                      <IconButton onClick={() => handleCopyPassword(row.password)} size="small" sx={{ ml: 1, color: 'primary.main' }}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete Item">
                    <IconButton color="error" onClick={() => handleRemoveRow(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', borderRadius: '8px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VaultPage;