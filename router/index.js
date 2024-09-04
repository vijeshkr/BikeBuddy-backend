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
const leaveStatusUpdate = require('../controller/admin/leaveStatusUpdate');
const getNotifications = require('../controller/common/getNotifications');
const markAsRead = require('../controller/common/markAsRead');
const markAllAsRead = require('../controller/common/markAllAsRead');
const addNewBooking = require('../controller/common/addNewBooking');
const getCurrentBooking = require('../controller/customer/getCurrentBooking');
const cancelBooking = require('../controller/customer/cancelBooking');
const getAllBookings = require('../controller/admin/getAllBookings');
const allocateWork = require('../controller/admin/allocateWork');
const addNewBreakdown = require('../controller/common/addNewBreakdown');
const getAllocationsByMechanic = require('../controller/mechanic/getAllocationsByMechanic');
const statusUpdate = require('../controller/mechanic/statusUpdate');
const requestExtraWork = require('../controller/mechanic/requsetExtraWork');
const completeWork = require('../controller/mechanic/completeWork');
const updateCustomerApproval = require('../controller/customer/updateCustomerApproval');
const getAllocationById = require('../controller/admin/getAllocationById');
const addServiceHistory = require('../controller/admin/addServiceHistory');
const getServiceHistoryByAllocation = require('../controller/customer/getServiceHistoryByAllocation');
const getAllServiceHistory = require('../controller/common/getAllServiceHistory');

// Router object
const router = express.Router();

// --- Common routes ---
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
router.patch('/remove-profile-picture', authMiddleware, removeProfilePicture);
// Get all service packages
router.get('/get-packages', authMiddleware, getAllServicePackages);
// Get all individual works
router.get('/get-individual-works', authMiddleware, getIndividualWorks);
// Get all vehicles
router.get('/get-all-vehicles', authMiddleware, getAllVehicles);
// Get all spare
router.get('/get-all-spare', authMiddleware, getAllSpare);
// Notifications
router.get('/get-notifications', authMiddleware, getNotifications);
router.patch('/mark-as-read/:notificationId', authMiddleware, markAsRead);
router.patch('/mark-all-as-read', authMiddleware, markAllAsRead);
// New booking
router.post('/add-new-booking', authMiddleware, addNewBooking);
// New breakdown
router.post('/add-new-breakdown', authMiddleware, addNewBreakdown);
// Get all service history
router.get('/get-all-service-history',authMiddleware,getAllServiceHistory);

// --- Routes for customer ---
// User registration
router.post('/registration', signup);
// Add vehicle
router.post('/add-vehicle', authMiddleware, addCustomerVehicle);
// Get cutomer vehicles by customer id
router.get('/get-vehicles/:customerId', authMiddleware, getCustomerVehicles);
// Get current booking
router.get('/get-current-booking/:customerId', authMiddleware, getCurrentBooking);
// Cancel booking
router.patch('/cancel-booking/:bookingId', authMiddleware, cancelBooking);
// Update customer approval field in the allocation
router.patch('/update-customer-approval/:id', authMiddleware, updateCustomerApproval);
// Get service history by allocation
router.get('/get-service-history-by-allocation/:allocationId',authMiddleware,getServiceHistoryByAllocation);

// --- Routes for admin ---
// Service packages
router.post('/add-package', authMiddleware, addServicePackage);
router.put('/update-package', authMiddleware, updateServicePackage);
router.delete('/delete-package', authMiddleware, deleteServicePackage);
// Individual works
router.post('/add-individual-work', authMiddleware, addIndividualWork);
router.put('/update-individual-work', authMiddleware, updateIndividualWork);
router.delete('/delete-individual-work', authMiddleware, deleteIndividualWork);
// Vehicle
router.post('/add-new-vehicle', authMiddleware, addNewVehicle);
// Spare parts
router.post('/add-new-spare', authMiddleware, addNewSpare);
router.delete('/delete-spare/:spareId', authMiddleware, deleteSpare);
router.put('/update-spare/:spareId', authMiddleware, updateSpare);
// Get all customer vehicles
router.get('/get-all-customer-vehicles', authMiddleware, getAllCustomerVehicles);
// Add new user
router.post('/add-new-user', authMiddleware, addNewUser);
// Get users by role
router.get('/get-users/:role', authMiddleware, getUsers);
// Leave management
router.get('/get-all-leaves', authMiddleware, getAllLeaves);
router.patch('/update-leave-status/:id', authMiddleware, leaveStatusUpdate);
// Get all booking
router.get('/get-all-booking', authMiddleware, getAllBookings);
// Work allocation
router.post('/allocate-work', authMiddleware, allocateWork);
// Get allocation by ID
router.get('/get-allocation-by/:allocationId',authMiddleware, getAllocationById);
// Add new service history
router.post('/add-service-history',authMiddleware,addServiceHistory);

// --- Routes for mechanic ---
// Apply leave
router.post('/apply-leave', authMiddleware, applyLeave);
// Get mechanic leaves
router.get('/get-mechanic-leaves', authMiddleware, getMechanicLeaves);
// Get allocations by mechanic ID
router.get('/get-allocations/:mechanicId', authMiddleware, getAllocationsByMechanic);
// Update booking status
router.patch('/update-status', authMiddleware, statusUpdate);
// Request extra work
router.patch('/request-work/:id', authMiddleware, requestExtraWork);
// Update work completion
router.put('/work-completion/:id', authMiddleware, completeWork);

module.exports = router;