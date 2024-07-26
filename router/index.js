const express = require('express');
const signup = require('../controller/customer/userRegistration');
const verifyEmail = require('../controller/common/verifyEmail');
const userLogin = require('../controller/common/userLogin');
const resetPassword = require('../controller/common/resetPassword');
const validateResetToken = require('../controller/common/validateResetToken');
const newPassword = require('../controller/common/newPassword');

// Router object
const router = express.Router();

// Common routes
// Email verification
router.get('/verify-email/:token',verifyEmail);
// User login
router.post('/login',userLogin);
// Forgot password email verification
router.post('/forgot-password',resetPassword);
// Validate reset token
router.get('/validate-reset/:token',validateResetToken);
// Reset password
router.post('/reset-password',newPassword);

// Routes for customer 
// User registration
router.post('/registration',signup);

// Routes for admin

// Routes for mechanic

module.exports = router;