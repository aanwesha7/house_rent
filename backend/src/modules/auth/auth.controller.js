const authService = require('./auth.service');
const { validateSignup, validateLogin } = require('./auth.validation');

const signup = async (req, res) => {
  try {
    const { name, mobile, email, password, role, turnstileToken } = req.body;

    console.log('📝 Signup request received:', { name, email, mobile, role });

    const errors = validateSignup({ name, mobile, email, password });
    if (errors.length > 0) {
      console.log('❌ Validation failed:', errors);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors 
      });
    }

    const user = await authService.signup(
      { name, mobile, email, password, role },
      turnstileToken
    );

    console.log('✅ User registered successfully:', user.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login request received:', { email });

    const errors = validateLogin({ email, password });
    if (errors.length > 0) {
      console.log('❌ Validation failed:', errors);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors 
      });
    }

    const user = await authService.login(email, password);

    console.log('✅ Login successful:', user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: user,
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(401).json({ 
      success: false,
      message: error.message 
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    const result = await authService.forgotPassword(email);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and OTP are required' 
      });
    }

    const result = await authService.verifyOTP(email, otp);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const result = await authService.resetPassword(email, otp, newPassword);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: `Welcome ${req.user.name}!`,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        mobile: req.user.mobile,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateProfile(req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getProfile,
  updateProfile,
};
