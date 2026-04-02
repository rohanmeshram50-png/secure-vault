const speakeasy = require('speakeasy');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// SETUP MFA
exports.setupMfa = (req, res) => {
  const secret = speakeasy.generateSecret({
    name: `SecureVault (${req.user.email})`,
  });

  db.query(
    'UPDATE users SET mfaSecret = ? WHERE id = ?',
    [secret.ascii, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      res.json({
        secret: secret.base32,
        otpauth_url: secret.otpauth_url,
      });
    }
  );
};

// VERIFY MFA
exports.verifyAndEnableMfa = (req, res) => {
  const { token } = req.body;

  const verified = speakeasy.totp.verify({
    secret: req.user.mfaSecret,
    encoding: 'ascii',
    token,
  });

  if (verified) {
    db.query(
      'UPDATE users SET mfaEnabled = true WHERE id = ?',
      [req.user.id],
      (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        res.json({ message: 'MFA enabled successfully' });
      }
    );
  } else {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// VALIDATE LOGIN MFA
exports.validateLoginMfa = (req, res) => {
  const { email, token } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, users) => {
    if (err || users.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = users[0];

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'ascii',
      token,
      window: 1,
    });

    if (verified) {
      const jwtToken = generateToken(user.id);
      res.json({ token: jwtToken });
    } else {
      res.status(401).json({ message: 'Invalid MFA token' });
    }
  });
};
