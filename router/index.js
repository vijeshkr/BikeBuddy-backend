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
const userPasswordChange = require('../controller/common/userPasswordChange');
const updateProfile = require('../controller/common/updateProfile');
const removeProfilePicture = require('../controller/common/removeProfilePicture');
const addServicePackage = require('../controller/admin/addServicePackage');
const updateServicePackage = require('../controller/admin/updateServicePackage');
const deleteServicePackage = require('../controller/admin/deleteServicePackage');
const getAllServicePackages = require('../controller/common/getAllServicePackages');
const addIndividualWork = require('../controller/admin/addIndividualWork');
const getIndividualWorks = require('../controller/common/getIndividualWorks');
const updateIndividualWork = require('../controller/admin/updateIndividualWork');

// Router object
const router = express.Router();

// Common routes
// Email verification
router.get('/verify-email/:token', verifyEmail);
// User login
router.post('/login', userLogin);
// User logout
router.post('/logout', logout)
// Forgot password email verification
router.post('/forgot-password', resetPassword);
// Validate reset token
router.get('/validate-reset/:token', validateResetToken);
// Reset password
router.post('/reset-password', newPassword);
// User detais
router.get('/user-details', authMiddleware, userDetails);
// User password change
router.post('/user-password-change', authMiddleware, userPasswordChange);
// Update profile
router.put('/update-profile', authMiddleware, updateProfile);
// Remove profile picture only
router.patch('/remove-profile-picture',authMiddleware,removeProfilePicture);
// Get all service packages
router.get('/get-packages',authMiddleware,getAllServicePackages);
// Get all individual works
router.get('/get-individual-works',authMiddleware,getIndividualWorks);

// Routes for customer 
// User registration
router.post('/registration', signup);

// Routes for admin
// Add service packages
router.post('/add-package',authMiddleware,addServicePackage);
// Update service packages
router.put('/update-package',authMiddleware,updateServicePackage);
// Delete service packages
router.delete('/delete-package',authMiddleware,deleteServicePackage);
// Add individual works
router.post('/add-individual-work',authMiddleware,addIndividualWork);
// Update individual work
router.put('/update-individual-work',authMiddleware,updateIndividualWork);

// Routes for mechanic

module.exports = router;