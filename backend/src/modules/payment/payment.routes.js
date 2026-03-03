const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
