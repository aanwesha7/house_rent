const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../booking/booking.model');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

class PaymentController {
  // Create Razorpay order
  async createOrder(req, res, next) {
    try {
      const { amount, bookingId, propertyId, propertyTitle } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount',
        });
      }

      // Create Razorpay order
      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `booking_${bookingId || Date.now()}`,
        notes: {
          bookingId: bookingId || '',
          propertyId: propertyId || '',
          propertyTitle: propertyTitle || '',
          userId: req.user._id.toString(),
        },
      };

      const order = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
        },
      });
    } catch (error) {
      console.error('Razorpay Order Creation Error:', error);
      next(error);
    }
  }

  // Verify Razorpay payment
  async verifyPayment(req, res, next) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

      // Verify signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      if (!isAuthentic) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed',
        });
      }

      // Update booking payment status
      if (bookingId) {
        const booking = await Booking.findById(bookingId);
        if (booking) {
          booking.paymentStatus = 'paid';
          booking.paymentId = razorpay_payment_id;
          booking.orderId = razorpay_order_id;
          booking.status = 'confirmed';
          await booking.save();
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        },
      });
    } catch (error) {
      console.error('Payment Verification Error:', error);
      next(error);
    }
  }
}

module.exports = new PaymentController();
