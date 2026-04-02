const express = require('express');
const {
  setupMfa,
  verifyAndEnableMfa,
  validateLoginMfa,
} = require('../controllers/mfaController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/validate', validateLoginMfa);
router.post('/setup', protect, setupMfa);
router.post('/verify', protect, verifyAndEnableMfa);

module.exports = router;
