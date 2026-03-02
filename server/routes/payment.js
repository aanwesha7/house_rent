const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Booking = require('../models/Booking');

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── POST /api/payment/create-order ───
// Creates a Razorpay order and saves an initial booking record
router.post('/create-order', async (req, res) => {
    try {
        const { amount, propertyId, propertyTitle, userId } = req.body;

        if (!amount || !propertyId) {
            return res.status(400).json({ error: 'amount and propertyId are required' });
        }

        // Create Razorpay order (amount is in paise → multiply by 100)
        const options = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: `receipt_${propertyId}_${Date.now()}`,
            notes: {
                propertyId,
                propertyTitle: propertyTitle || '',
                userId: userId || 'guest',
            },
        };

        const order = await razorpay.orders.create(options);

        // Save initial booking record (if MongoDB is connected)
        try {
            const booking = new Booking({
                userId: userId || 'guest',
                propertyId,
                propertyTitle: propertyTitle || '',
                amount,
                razorpayOrderId: order.id,
                status: 'created',
            });
            await booking.save();
        } catch (dbError) {
            console.warn('⚠️ Could not save booking to DB:', dbError.message);
        }

        res.json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
});

// ─── POST /api/payment/verify ───
// Verifies Razorpay payment signature and updates booking status
router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment verification fields' });
        }

        // Generate expected signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update booking to 'paid'
            const booking = await Booking.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    status: 'paid',
                },
                { new: true }
            );

            res.json({ success: true, message: 'Payment verified successfully', booking });
        } else {
            // Update booking to 'failed'
            await Booking.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'failed' }
            );

            res.status(400).json({ success: false, error: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ error: 'Verification failed', details: error.message });
    }
});

// ─── GET /api/payment/bookings/:userId ───
// Fetch all bookings for a specific user
router.get('/bookings/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Fetch Bookings Error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

module.exports = router;
