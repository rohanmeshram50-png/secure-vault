const express = require('express');
const { getVault, updateVault } = require('../controllers/vaultController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getVault).put(protect, updateVault);

module.exports = router;
