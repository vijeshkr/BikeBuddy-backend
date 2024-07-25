const express = require('express');
const signup = require('../controller/customer/userRegistration');
const verifyEmail = require('../controller/common/verifyEmail');
const userLogin = require('../controller/common/userLogin');

// Router object
const router = express.Router();

// Common routes
// Email verification
router.get('/verify-email/:token',verifyEmail);
// User login
router.post('/login',userLogin);

// Routes for customer 
// User registration
router.post('/registration',signup);

// Routes for admin

// Routes for mechanic

module.exports = router;