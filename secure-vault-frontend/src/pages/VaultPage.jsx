import React, { useState, useEffect, useContext } from 'react';
import { getVault, updateVault } from '../services/vaultService';
import { AuthContext } from '../context/AuthContext';
import { encrypt, decrypt } from '../services/cryptoService';
import { TextField, Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
            console.log(parsedData);
            
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
      console.log("under update");
      let masterPassword;
      try {
        masterPassword = getMasterPassword();
        console.log("Master password retrieved.");
      } catch (e) {
        console.error("Error getting master password:", e);
        setError("An internal error occurred while retrieving the master password.");
        return;
      }

      if (!masterPassword) {
        setError('Master password is not available. Please enter it below.');
        console.log("under update1");
        return;
      }
      const encryptedBlob = encrypt(JSON.stringify(decryptedVault), masterPassword);
      console.log("under update2");
      await updateVault(encryptedBlob);
      alert('Vault updated successfully!');
      console.log("under update3");
    } catch (err) {
      // --- THIS IS THE CORRECTED PART ---
      // 1. Log the actual error to the console for debugging.
      console.error("Error during vault update:", err);

      // 2. Set a more informative error message for the user.
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // For network/API errors
      } else {
        // For other errors (like from the encrypt function), use err.message
        setError(err.message || 'An unexpected error occurred while updating the vault.');
      }
      // --- END OF CORRECTION ---
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
        <Typography variant="h5" gutterBottom>
          Session Found
        </Typography>
        <Typography gutterBottom>
          To decrypt your vault, please re-enter your master password.
        </Typography>
        <form onSubmit={(e) => { e.preventDefault(); setTempPassword(document.getElementById('temp-password').value); }}>
          <TextField
            id="temp-password"
            label="Master Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Unlock Vault
          </Button>
        </form>
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
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Vault
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Platform</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {decryptedVault.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    value={row.platform}
                    onChange={(e) => handleCellChange(index, 'platform', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.username}
                    onChange={(e) => handleCellChange(index, 'username', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell style={{display:"flex"}}>
                  <TextField
                    value={row.password}
                    onChange={(e) => handleCellChange(index, 'password', e.target.value)}
                    type="password"
                    variant="outlined"
                    size="small"
                  />
                  <IconButton onClick={() => handleCopyPassword(row.password)} size="small" sx={{ ml: 1 }}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Button color="secondary" onClick={() => handleRemoveRow(index)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleAddRow} style={{ marginTop: '1rem', marginRight: '1rem' }}>
        Add Row
      </Button>
      <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginTop: '1rem' }}>
        Update Vault
      </Button>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VaultPage;