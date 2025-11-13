const express = require('express');
const { setupMfa, verifyAndEnableMfa, validateLoginMfa } = require('../controllers/mfaController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

// This endpoint is used for the second step of login, so it's not protected by JWT
router.post('/validate', authLimiter, validateLoginMfa);

// These endpoints require a user to be logged in (to have a valid JWT)
router.post('/setup', protect, setupMfa);
router.post('/verify', protect, verifyAndEnableMfa);

module.exports = router;
