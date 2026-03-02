/**
 * Cloudflare Turnstile server-side verification utility.
 * Sends the client token to Cloudflare's siteverify endpoint
 * and returns { success: boolean }.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyTurnstileToken(token, remoteip) {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
        console.error('⚠️  TURNSTILE_SECRET_KEY is not set in .env');
        return { success: false, error: 'Server configuration error' };
    }

    try {
        const body = new URLSearchParams({
            secret: secretKey,
            response: token,
        });
        if (remoteip) body.append('remoteip', remoteip);

        const res = await fetch(VERIFY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });

        const data = await res.json();
        return { success: data.success === true, data };
    } catch (err) {
        console.error('Turnstile verification error:', err.message);
        return { success: false, error: err.message };
    }
}

module.exports = { verifyTurnstileToken };
