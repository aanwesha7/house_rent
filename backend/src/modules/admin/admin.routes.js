const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Property management
router.get('/properties', adminController.getAllProperties);
router.delete('/properties/:id', adminController.deleteProperty);

// Booking management
router.get('/bookings', adminController.getAllBookings);

module.exports = router;
