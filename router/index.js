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
const deleteIndividualWork = require('../controller/admin/deleteIndividualWork');
const addNewVehicle = require('../controller/admin/addNewVehicle');
const getAllVehicles = require('../controller/common/getAllVehicles');
const addNewSpare = require('../controller/admin/addNewSpare');
const getAllSpare = require('../controller/common/getAllSpare');
const deleteSpare = require('../controller/admin/deleteSpare');
const updateSpare = require('../controller/admin/updateSpare');
const addCustomerVehicle = require('../controller/customer/addCustomerVehicle');
const getAllCustomerVehicles = require('../controller/admin/getAllCustomerVehicles');
const getCustomerVehicles = require('../controller/customer/getCustomerVehicles');
const applyLeave = require('../controller/mechanic/applyLeave');
const getMechanicLeaves = require('../controller/mechanic/getMechanicLeaves');
const addNewUser = require('../controller/admin/addNewUser');
const getUsers = require('../controller/admin/getUsers');
const getAllLeaves = require('../controller/admin/getAllLeaves');

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
// Get all vehicles
router.get('/get-all-vehicles',authMiddleware,getAllVehicles);
// Get all spare
router.get('/get-all-spare',authMiddleware,getAllSpare);

// Routes for customer 
// User registration
router.post('/registration', signup);
// Add vehicle
router.post('/add-vehicle',authMiddleware,addCustomerVehicle);
// Get cutomer vehicles by customer id
router.get('/get-vehicles/:customerId',authMiddleware,getCustomerVehicles);

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
// Delete individual work
router.delete('/delete-individual-work',authMiddleware,deleteIndividualWork);
// Add new vehicle
router.post('/add-new-vehicle',authMiddleware,addNewVehicle);
// Add new spare
router.post('/add-new-spare',authMiddleware,addNewSpare);
// Delete spare
router.delete('/delete-spare/:spareId',authMiddleware,deleteSpare);
// Update spare
router.put('/update-spare/:spareId',authMiddleware,updateSpare);
// Get all customer vehicles
router.get('/get-all-customer-vehicles',authMiddleware,getAllCustomerVehicles);
// Add new user
router.post('/add-new-user',authMiddleware,addNewUser);
// Get users by role
router.get('/get-users/:role',authMiddleware,getUsers);
// Get all leave
router.get('/get-all-leaves',authMiddleware,getAllLeaves);

// Routes for mechanic
// Apply leave
router.post('/apply-leave',authMiddleware,applyLeave);
// Get mechanic leaves
router.get('/get-mechanic-leaves',authMiddleware,getMechanicLeaves);

module.exports = router;