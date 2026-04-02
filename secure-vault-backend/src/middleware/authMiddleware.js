const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, users) => {
      if (err || users.length === 0) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const user = users[0];
      delete user.authKeyHash;
      delete user.mfaSecret;

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'No token' });
  }
};

module.exports = { protect };
