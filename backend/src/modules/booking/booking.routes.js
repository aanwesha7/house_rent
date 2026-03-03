const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

// All booking routes require authentication
router.use(protect);

// Renter routes
router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/cancel', bookingController.cancelBooking);

// Owner routes
router.get('/owner/bookings', restrictTo('owner', 'admin'), bookingController.getOwnerBookings);
router.put('/:id/status', restrictTo('owner', 'admin'), bookingController.updateBookingStatus);

// Admin routes
router.get('/admin/all', restrictTo('admin'), bookingController.getAllBookings);

module.exports = router;
