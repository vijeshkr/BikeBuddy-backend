const express = require('express');
const signup = require('../controller/userRegistration');

// Router object
const router = express.Router();

// User registration
router.post('/registration',signup);

module.exports = router;