const express = require('express');
const { register, login } = require('../controllers/authController');

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const router = express.Router();


// =========================
// AUTH ROUTES
// =========================

router.post('/register', register);
router.post('/login', login);



// =========================
// MFA SETUP ROUTE
// Generate QR Code
// =========================

router.post('/mfa/setup', async (req, res) => {

  try {

    const userId = req.body.userId;

    const secret = speakeasy.generateSecret({
      name: "SecureVault"
    });

    const db = require('../config/db');

    db.query(
      `
      UPDATE users
      SET mfaSecret = ?
      WHERE id = ?
      `,
      [secret.base32, userId],
      async (err) => {

        if (err) {
          return res.status(500).json({
            error: err.message
          });
        }

        const qrCode = await QRCode.toDataURL(
          secret.otpauth_url
        );

        res.json({
          message: "Scan QR in authenticator",
          qrCode
        });

      }
    );

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "MFA setup failed"
    });

  }

});



// =========================
// MFA VERIFY ROUTE
// Verify OTP + Enable MFA
// =========================

router.post('/mfa/verify', (req, res) => {

  try {

    const { userId, token } = req.body;

    const db = require('../config/db');

    db.query(
      `
      SELECT mfaSecret
      FROM users
      WHERE id = ?
      `,
      [userId],
      (err, rows) => {

        if (err) {
          return res.status(500).json({
            error: err.message
          });
        }

        if (rows.length === 0) {
          return res.status(404).json({
            error: 'User not found'
          });
        }

        const secret = rows[0].mfaSecret;

        const verified = speakeasy.totp.verify({
          secret,
          encoding: 'base32',
          token
        });

        if (!verified) {

          return res.status(400).json({
            error: 'Invalid OTP'
          });

        }

        db.query(
          `
          UPDATE users
          SET mfaEnabled = 1
          WHERE id = ?
          `,
          [userId],
          (updateErr) => {

            if (updateErr) {

              return res.status(500).json({
                error: updateErr.message
              });

            }

            res.json({
              message: 'MFA Enabled Successfully'
            });

          }
        );

      }
    );

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Verification failed'
    });

  }

});


module.exports = router;
