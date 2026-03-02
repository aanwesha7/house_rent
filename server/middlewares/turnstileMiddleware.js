const { verifyTurnstileToken } = require('../utils/turnstile');

/**
 * Express middleware to verify Cloudflare Turnstile token.
 * Expects `turnstileToken` in the request body.
 */
async function verifyTurnstile(req, res, next) {
    const { turnstileToken } = req.body;

    if (!turnstileToken) {
        return res.status(400).json({
            success: false,
            message: 'CAPTCHA verification is required.',
        });
    }

    const remoteip = req.ip || req.connection?.remoteAddress;
    const result = await verifyTurnstileToken(turnstileToken, remoteip);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'CAPTCHA verification failed. Please try again.',
        });
    }

    next();
}

module.exports = { verifyTurnstile };
