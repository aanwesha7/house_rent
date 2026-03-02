const API_BASE = 'http://127.0.0.1:5000/api/payment';

/**
 * Create a Razorpay order via backend
 */
export async function createOrder(amount, propertyId, propertyTitle, userId = 'guest') {
    const response = await fetch(`${API_BASE}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, propertyId, propertyTitle, userId }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to create order');
    return data;
}

/**
 * Verify payment signature via backend
 */
export async function verifyPayment(paymentData) {
    const response = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    return data;
}

/**
 * Open the Razorpay checkout popup
 * @param {Object} orderData - { order, key } from createOrder
 * @param {Object} property - { title, price, location }
 * @param {Function} onSuccess - callback with payment response
 * @param {Function} onFailure - callback with error
 */
export function openRazorpayCheckout(orderData, property, onSuccess, onFailure) {
    const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'HomeHive',
        description: `Booking: ${property.title}`,
        order_id: orderData.order.id,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&fit=crop',
        handler: async function (response) {
            try {
                // Verify payment on backend
                const verifyResult = await verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                });

                if (verifyResult.success) {
                    onSuccess(verifyResult);
                } else {
                    onFailure(new Error('Payment verification failed'));
                }
            } catch (err) {
                onFailure(err);
            }
        },
        prefill: {
            name: 'Test User',
            email: 'test@example.com',
            contact: '9999999999',
        },
        theme: {
            color: '#2563eb',
        },
        modal: {
            ondismiss: function () {
                onFailure(new Error('Payment cancelled by user'));
            },
        },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
}
