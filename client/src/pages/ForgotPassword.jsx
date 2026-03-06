import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        email: '',
        otp: '',
        newPassword: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const sendOtp = async () => {
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await api.forgotPassword(form.email);
            setMessage(response?.message || 'OTP sent to your email');
            setStep(2);
        } catch (err) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await api.verifyOTP(form.email, form.otp);
            setMessage(response?.message || 'OTP verified');
            setStep(3);
        } catch (err) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await api.resetPassword(form.email, form.otp, form.newPassword);
            setMessage(response?.message || 'Password reset successful. You can now login.');
            setStep(4);
        } catch (err) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B13] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[#15161E]/90 border border-gray-800/60 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                <p className="text-gray-400 text-sm mb-6">Step {step} of 4</p>

                {message ? <div className="mb-4 p-3 rounded-lg bg-green-900/20 border border-green-500/40 text-green-300 text-sm">{message}</div> : null}
                {error ? <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-500/40 text-red-300 text-sm">{error}</div> : null}

                <div className="space-y-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={step > 1}
                        className="w-full px-4 py-3 bg-[#1A1C26] border border-gray-700 rounded-xl"
                    />

                    {step >= 2 ? (
                        <input
                            name="otp"
                            type="text"
                            placeholder="OTP"
                            value={form.otp}
                            onChange={handleChange}
                            disabled={step > 2}
                            className="w-full px-4 py-3 bg-[#1A1C26] border border-gray-700 rounded-xl"
                        />
                    ) : null}

                    {step >= 3 ? (
                        <input
                            name="newPassword"
                            type="password"
                            placeholder="New Password"
                            value={form.newPassword}
                            onChange={handleChange}
                            disabled={step > 3}
                            className="w-full px-4 py-3 bg-[#1A1C26] border border-gray-700 rounded-xl"
                        />
                    ) : null}

                    {step === 1 ? (
                        <button onClick={sendOtp} disabled={loading || !form.email} className="w-full py-3 rounded-xl bg-[#9333EA] hover:bg-[#A855F7] font-bold disabled:opacity-60">
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    ) : null}

                    {step === 2 ? (
                        <button onClick={verifyOtp} disabled={loading || !form.otp} className="w-full py-3 rounded-xl bg-[#9333EA] hover:bg-[#A855F7] font-bold disabled:opacity-60">
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    ) : null}

                    {step === 3 ? (
                        <button onClick={resetPassword} disabled={loading || !form.newPassword} className="w-full py-3 rounded-xl bg-[#9333EA] hover:bg-[#A855F7] font-bold disabled:opacity-60">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    ) : null}

                    <Link to="/login" className="block text-center text-sm text-purple-300 hover:text-purple-200">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
