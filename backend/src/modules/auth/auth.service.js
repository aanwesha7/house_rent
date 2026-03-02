const User = require('./auth.model');
const generateToken = require('../../utils/generateToken');
const generateOTP = require('../../utils/generateOTP');
const { sendEmail } = require('../../config/mail');
const axios = require('axios');

const verifyTurnstile = async (token) => {
  try {
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }
    );
    return response.data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error.message);
    return false;
  }
};

const signup = async (userData, turnstileToken) => {
  const { name, mobile, email, password } = userData;

  // Verify Turnstile token
  if (process.env.NODE_ENV !== 'test') {
    const isValidTurnstile = await verifyTurnstile(turnstileToken);
    if (!isValidTurnstile) {
      throw new Error('Turnstile verification failed');
    }
  }

  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
  if (userExists) {
    throw new Error('User already exists with this email or mobile');
  }

  // Create user
  const user = await User.create({
    name,
    mobile,
    email,
    password,
  });

  // Send welcome email
  const welcomeHtml = `
    <h1>Welcome to House Rent!</h1>
    <p>Hi ${name},</p>
    <p>Thank you for signing up. We're excited to have you on board!</p>
    <p>You can now log in and start exploring available properties.</p>
  `;

  try {
    await sendEmail(email, 'Welcome to House Rent', welcomeHtml);
  } catch (error) {
    console.error('Failed to send welcome email:', error.message);
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    token: generateToken(user._id),
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid email or password');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    token: generateToken(user._id),
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  const otpHtml = `
    <h1>Password Reset Request</h1>
    <p>Hi ${user.name},</p>
    <p>Your OTP for password reset is: <strong>${otp}</strong></p>
    <p>This OTP will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail(email, 'Password Reset OTP', otpHtml);

  return { message: 'OTP sent to your email' };
};

const verifyOTP = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.otp || !user.otpExpiry) {
    throw new Error('No OTP request found');
  }

  if (user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  if (new Date() > user.otpExpiry) {
    throw new Error('OTP has expired');
  }

  return { message: 'OTP verified successfully' };
};

const resetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.otp || user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  if (new Date() > user.otpExpiry) {
    throw new Error('OTP has expired');
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return { message: 'Password reset successfully' };
};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
