import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Eye, EyeOff } from 'lucide-react';
import TurnstileWidget from '../components/TurnstileWidget';

export default function SignUp() {
    const { signup, loading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('renter');
    const [localError, setLocalError] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear errors when user types
        if (localError) setLocalError('');
        if (error) clearError();
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        console.log('🚀 Signup attempt:', { ...formData, role, hasTurnstileToken: !!turnstileToken });

        // Validation
        if (!formData.name.trim()) {
            setLocalError('Please enter your name');
            return;
        }
        if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile)) {
            setLocalError('Please enter a valid 10-digit mobile number');
            return;
        }
        if (!formData.email.trim()) {
            setLocalError('Please enter your email');
            return;
        }
        if (!formData.password.trim()) {
            setLocalError('Please enter your password');
            return;
        }
        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        // If no turnstile token, generate one (for development)
        const tokenToUse = turnstileToken || 'dev_bypass_' + Date.now();
        
        if (!turnstileToken) {
            console.log('⚠️ No Turnstile token, using development bypass');
        }

        try {
            const result = await signup({
                ...formData,
                role,
                turnstileToken: tokenToUse,
            });
            
            console.log('✅ Signup successful:', result);
            
            // Navigate based on role
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'owner') {
                navigate('/owner');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('❌ Signup failed:', err);
            setLocalError(err.message || 'Signup failed');
        }
    };

    const displayError = localError || error;

    return (
        <div className="min-h-screen flex bg-gray-900 font-sans">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 to-indigo-900 p-12 flex-col justify-center">
                <div className="max-w-md">
                    <h1 className="text-4xl font-bold text-white mb-4">HomeHive</h1>
                    <p className="text-xl text-purple-200 mb-8">
                        Find your perfect home with ease. Join thousands of users already using our platform.
                    </p>
                    <div className="space-y-4 text-purple-100">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>10,000+ verified properties</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Trusted by thousands of users</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Secure and easy to use</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400 mb-6">Sign up to get started</p>

                        {/* Role Selection */}
                        <div className="flex gap-2 mb-6 bg-gray-700 p-1 rounded-lg">
                            {['renter', 'owner', 'admin'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                        role === r
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Error Message */}
                        {displayError && (
                            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
                                {displayError}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    maxLength="10"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="9876543210"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Turnstile Widget */}
                            <div className="flex justify-center">
                                <TurnstileWidget
                                    onVerify={(token) => {
                                        console.log('🔐 Turnstile token received');
                                        setTurnstileToken(token);
                                    }}
                                    onExpire={() => {
                                        console.log('⏰ Turnstile token expired');
                                        setTurnstileToken('');
                                    }}
                                    onError={() => {
                                        console.log('❌ Turnstile error');
                                        setTurnstileToken('');
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>

                            {/* Development Note */}
                            <p className="text-xs text-center text-gray-500 mt-2">
                                Development mode: CAPTCHA verification is optional
                            </p>
                        </form>

                        <p className="text-center text-gray-400 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
