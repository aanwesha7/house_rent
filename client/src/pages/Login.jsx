import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Eye, EyeOff } from 'lucide-react';
import { translations } from '../data/translations';
import useAppStore from '../store/useAppStore';

export default function Login() {
    const { login, loading, error, clearError } = useAuthStore();
    const { language } = useAppStore();
    const t = translations[language];
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('renter');
    const [localError, setLocalError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        if (!email.trim()) {
            setLocalError(language === 'en' ? 'Please enter your email' : 'कृपया अपना ईमेल दर्ज करें');
            return;
        }
        if (!password.trim()) {
            setLocalError(language === 'en' ? 'Please enter your password' : 'कृपया अपना पासवर्ड दर्ज करें');
            return;
        }

        try {
            await login({ email, password, role });
            // Navigate based on role
            navigate(role === 'admin' ? '/admin' : role === 'owner' ? '/owner' : '/renter');
        } catch (err) {
            setLocalError(err.message || 'Login failed');
        }
    };

    const displayError = localError || error;

    return (
        <div className="min-h-screen flex bg-[#0B0B13] font-sans">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #15161E 0%, #0B0B13 100%)' }}
            >
                <div className="absolute top-16 left-12 w-32 h-32 bg-purple-600/20 blur-[60px] rounded-full" style={{ animation: 'float 6s ease-in-out infinite' }} />
                <div className="absolute top-40 right-16 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full" style={{ animation: 'float 8s ease-in-out infinite 1s' }} />
                <div className="absolute bottom-32 left-20 w-48 h-48 bg-purple-900/30 blur-[100px] rounded-full" style={{ animation: 'float 7s ease-in-out infinite 2s' }} />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full border-r border-gray-800/60 bg-[#0B0B13]/30 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-900/50 border border-purple-500/50 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">HomeHive</span>
                    </div>

                    <div>
                        <h2 className="text-[32px] font-bold text-white leading-snug mb-4">
                            {language === 'en' ? <>Welcome back to<br />your home search</> : <>अपनी घर खोज में<br />वापस स्वागत है</>}
                        </h2>
                        <p className="text-purple-200/80 text-base leading-relaxed max-w-[320px]">
                            {language === 'en'
                                ? "Access your saved properties and continue your journey to find the perfect home."
                                : "अपनी सहेजी गई संपत्तियों तक पहुंचें और सही घर खोजने की अपनी यात्रा जारी रखें।"}
                        </p>
                    </div>

                    <div className="flex-1 flex items-end justify-center pb-4">
                        <div className="relative w-full max-w-[380px] h-[280px]">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B13] to-transparent z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800"
                                alt="Beautiful homes"
                                className="w-full h-full rounded-2xl shadow-[0_0_30px_rgba(147,51,234,0.3)] object-cover border border-purple-500/20"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />

                <div className="w-full max-w-[420px] bg-[#15161E]/80 backdrop-blur-xl p-8 rounded-[32px] border border-gray-800/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-purple-900/50 border border-purple-500/50 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        </div>
                        <span className="text-xl font-bold text-white">HomeHive</span>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {language === 'en' ? 'Sign in' : 'साइन इन करें'}
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">
                        {language === 'en' ? 'Welcome back! Please enter your details.' : 'वापस स्वागत है! कृपया अपना विवरण दर्ज करें।'}
                    </p>

                    {/* Role Selection */}
                    <div className="flex bg-[#1A1C26]/80 p-1.5 rounded-xl border border-gray-800/60 mb-6 relative">
                        {['renter', 'owner', 'admin'].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 relative ${
                                    role === r ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {role === r && (
                                    <div className="absolute inset-0 bg-[#A855F7]/80 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                                )}
                                <span className="relative z-10 capitalize">
                                    {r === 'renter' ? (language === 'en' ? 'User' : 'उपयोगकर्ता') :
                                        r === 'owner' ? (language === 'en' ? 'Owner' : 'मालिक') :
                                            (language === 'en' ? 'Admin' : 'एडमिन')}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Error Message */}
                    {displayError && (
                        <div className="mb-6 px-4 py-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium backdrop-blur-sm">
                            {displayError}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5 mb-8">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">{t.emailAddress}</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 border border-gray-700/50 rounded-2xl text-sm focus:outline-none focus:border-[#A855F7]/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 bg-[#1A1C26]/80 text-white placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-300">{t.password}</label>
                                <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors">
                                    {language === 'en' ? 'Forgot password?' : 'पासवर्ड भूल गए?'}
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3.5 pr-12 border border-gray-700/50 rounded-2xl text-sm focus:outline-none focus:border-[#A855F7]/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 bg-[#1A1C26]/80 text-white placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#9333EA] hover:bg-[#A855F7] disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 text-sm shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                                    </svg>
                                    {language === 'en' ? 'Signing in...' : 'साइन इन हो रहा है...'}
                                </span>
                            ) : (language === 'en' ? 'Sign in' : 'साइन इन करें')}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-8">
                        {language === 'en' ? "Don't have an account?" : "खाता नहीं है?"}{' '}
                        <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-colors">
                            {language === 'en' ? 'Sign up for free' : 'फ्री में साइन अप करें'}
                        </Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                }
            `}</style>
        </div>
    );
}
