const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('../modules/auth/auth.routes');
const propertyRoutes = require('../modules/property/property.routes');
const bookingRoutes = require('../modules/booking/booking.routes');
const savedPropertyRoutes = require('../modules/savedProperty/savedProperty.routes');
const paymentRoutes = require('../modules/payment/payment.routes');
const contactRoutes = require('../modules/contact/contact.routes');
const adminRoutes = require('../modules/admin/admin.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/bookings', bookingRoutes);
router.use('/saved-properties', savedPropertyRoutes);
router.use('/payments', paymentRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
