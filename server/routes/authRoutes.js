const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyTurnstile } = require('../middlewares/turnstileMiddleware');

// POST /api/auth/register — Turnstile CAPTCHA required
router.post('/register', verifyTurnstile, register);

// POST /api/auth/login — No CAPTCHA required
router.post('/login', login);

module.exports = router;
