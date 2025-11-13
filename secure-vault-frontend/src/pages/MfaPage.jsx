
import React, { useState, useEffect } from 'react';
import { setupMfa, verifyAndEnableMfa } from '../services/mfaService';
import { Button, Container, Typography, TextField, Box } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

const MfaPage = () => {
  const [qrCode, setQrCode] = useState(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSetupMfa = async () => {
    try {
      const { data } = await setupMfa();
      setQrCode(data.qrCode);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleVerifyMfa = async () => {
    try {
      await verifyAndEnableMfa(token);
      setSuccess('MFA enabled successfully!');
      setQrCode(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" gutterBottom>
        Setup MFA
      </Typography>
      {!qrCode ? (
        <Button variant="contained" color="primary" onClick={handleSetupMfa}>
          Setup MFA
        </Button>
      ) : (
        <Box>
          <Typography>Scan this QR code with your authenticator app:</Typography>
          <QRCodeSVG value={qrCode} />
          <TextField
            label="MFA Token"
            variant="outlined"
            fullWidth
            margin="normal"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleVerifyMfa}>
            Verify and Enable MFA
          </Button>
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success">{success}</Typography>}
    </Container>
  );
};

export default MfaPage;
