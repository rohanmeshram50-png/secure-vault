const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/mfa', require('./mfa'));
router.use('/vault', require('./vault'));

module.exports = router;
