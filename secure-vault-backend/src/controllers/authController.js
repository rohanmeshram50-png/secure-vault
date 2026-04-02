const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, users) => {
    if (err) return res.status(500).json({ error: err.message });

    if (users.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const authKeyHash = await bcrypt.hash(password, salt);

    db.query(
      'INSERT INTO users (email, authKeyHash, salt, mfaEnabled) VALUES (?, ?, ?, ?)',
      [email, authKeyHash, salt, false],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const userId = result.insertId;

        db.query(
          'INSERT INTO vaults (userId, encryptedBlob) VALUES (?, ?)',
          [userId, ''],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({
              id: userId,
              email,
              message: 'Registration successful',
            });
          }
        );
      }
    );
  });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, users) => {
    if (err) return res.status(500).json({ error: err.message });

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.authKeyHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.mfaEnabled) {
      return res.status(200).json({ mfaRequired: true, email });
    }

    const token = generateToken(user.id);
    res.status(200).json({ token });
  });
};
