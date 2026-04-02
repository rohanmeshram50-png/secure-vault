const db = require('../config/db');

exports.getVault = (req, res) => {
  db.query(
    'SELECT encryptedBlob FROM vaults WHERE userId = ?',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(404).json({ message: 'Vault not found' });
      }

      res.json({ encryptedBlob: results[0].encryptedBlob });
    }
  );
};

exports.updateVault = (req, res) => {
  const { encryptedBlob } = req.body;

  db.query(
    'UPDATE vaults SET encryptedBlob = ? WHERE userId = ?',
    [encryptedBlob, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: 'Vault updated successfully' });
    }
  );
};
