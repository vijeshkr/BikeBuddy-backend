const express = require('express');
const signup = require('../controller/customer/userRegistration');
const verifyEmail = require('../controller/common/verifyEmail');
const userLogin = require('../controller/common/userLogin');
const resetPassword = require('../controller/common/resetPassword');
const validateResetToken = require('../controller/common/validateResetToken');
const newPassword = require('../controller/common/newPassword');
const authMiddleware = require('../middlewares/authMiddleware');
const userDetails = require('../controller/common/userDetails');
const logout = require('../controller/common/userLogout');

// Router object
const router = express.Router();

// Common routes
// Email verification
router.get('/verify-email/:token',verifyEmail);
// User login
router.post('/login',userLogin);
// User logout
router.post('/logout',logout)
// Forgot password email verification
router.post('/forgot-password',resetPassword);
// Validate reset token
router.get('/validate-reset/:token',validateResetToken);
// Reset password
router.post('/reset-password',newPassword);
// User detais
router.get('/user-details',authMiddleware,userDetails);

// Routes for customer 
// User registration
router.post('/registration',signup);

// Routes for admin

// Routes for mechanic

module.exports = router;