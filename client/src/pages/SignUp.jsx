import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { Eye, EyeOff } from 'lucide-react';
import { translations } from '../data/translations';
import TurnstileWidget from '../components/TurnstileWidget';

export default function SignUp() {
    const { login, language } = useAppStore();
    const t = translations[language];
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('renter'); // renter, owner, admin
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');

    const handleEmailLogin = (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) { setError(language === 'en' ? 'Please enter your email' : 'कृपया अपना ईमेल दर्ज करें'); return; }
        if (!password.trim()) { setError(language === 'en' ? 'Please enter your password' : 'कृपया अपना पासवर्ड दर्ज करें'); return; }
        if (password.length < 6) { setError(language === 'en' ? 'Password must be at least 6 characters' : 'पासवर्ड कम से कम 6 वर्णों का होना चाहिए'); return; }
        if (!turnstileToken) { setError(language === 'en' ? 'Please complete the CAPTCHA verification' : 'कृपया CAPTCHA सत्यापन पूरा करें'); return; }

        setLoading(true);
        setTimeout(() => {
            const mockName = email.split('@')[0];
            login({ name: mockName, provider: 'Email', email, role });
            navigate(role === 'admin' ? '/admin' : role === 'owner' ? '/owner' : '/');
        }, 1200);
    };

    const handleSocialLogin = (provider) => {
        setLoading(true);
        setTimeout(() => {
            login({ name: 'Demo User', provider, role });
            navigate(role === 'admin' ? '/admin' : role === 'owner' ? '/owner' : '/');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex bg-[#0B0B13] font-sans">

            {/* ===== LEFT PANEL — Branding + Illustration ===== */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #15161E 0%, #0B0B13 100%)' }}
            >
                {/* Floating animated glowing orbs */}
                <div className="absolute top-16 left-12 w-32 h-32 bg-purple-600/20 blur-[60px] rounded-full" style={{ animation: 'float 6s ease-in-out infinite' }} />
                <div className="absolute top-40 right-16 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full" style={{ animation: 'float 8s ease-in-out infinite 1s' }} />
                <div className="absolute bottom-32 left-20 w-48 h-48 bg-purple-900/30 blur-[100px] rounded-full" style={{ animation: 'float 7s ease-in-out infinite 2s' }} />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full border-r border-gray-800/60 bg-[#0B0B13]/30 backdrop-blur-sm">

                    {/* Logo */}
                    <div className="flex items-center gap-3" style={{ animation: 'slideDown 0.8s ease-out' }}>
                        <div className="w-10 h-10 bg-purple-900/50 border border-purple-500/50 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">HomeHive</span>
                    </div>

                    {/* Tagline */}
                    <div style={{ animation: 'slideUp 1s ease-out 0.3s both' }}>
                        <h2 className="text-[32px] font-bold text-white leading-snug mb-4">
                            {language === 'en' ? <>Find your cosmic<br />space with ease.</> : <>आसानी से अपनी<br />ब्रह्मांडीय जगह खोजें।</>}
                        </h2>
                        <p className="text-purple-200/80 text-base leading-relaxed max-w-[320px]">
                            {language === 'en'
                                ? "Browse thousands of verified rental properties. Trusted by 10,000+ tenants and owners across India."
                                : "हजारों सत्यापित रेंटल प्रॉपर्टीज ब्राउज़ करें। भारत भर में 10,000+ किरायेदारों और मालिकों द्वारा भरोसा किया गया।"}
                        </p>
                    </div>

                    {/* Illustration Image */}
                    <div className="flex-1 flex items-end justify-center pb-4" style={{ animation: 'slideUp 1s ease-out 0.6s both' }}>
                        <div className="relative w-full max-w-[380px] h-[280px]">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B13] to-transparent z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800"
                                alt="Beautiful homes"
                                className="w-full h-full rounded-2xl shadow-[0_0_30px_rgba(147,51,234,0.3)] object-cover border border-purple-500/20"
                                style={{ animation: 'scaleIn 1.2s ease-out 0.8s both' }}
                            />
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center gap-8 pt-4" style={{ animation: 'slideUp 1s ease-out 1s both' }}>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0B0B13] shadow-md z-30">R</div>
                                <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0B0B13] shadow-md z-20">A</div>
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0B0B13] shadow-md z-10">S</div>
                            </div>
                            <span className="text-sm text-gray-400 font-medium ml-1">{language === 'en' ? '10k+ users' : '10k+ उपयोगकर्ता'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                            </div>
                            <span className="text-sm text-gray-400 font-medium ml-1">{language === 'en' ? '4.9 rating' : '4.9 रेटिंग'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== RIGHT PANEL — Sign In Form ===== */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden" style={{ animation: 'fadeIn 0.6s ease-out' }}>
                <div className="absolute right-0 bottom-0 w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />

                <div className="w-full max-w-[420px] bg-[#15161E]/80 backdrop-blur-xl p-8 rounded-[32px] border border-gray-800/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10" style={{ animation: 'slideUp 0.8s ease-out 0.2s both' }}>

                    {/* Mobile Logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-purple-900/50 border border-purple-500/50 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        </div>
                        <span className="text-xl font-bold text-white shadow-sm">HomeHive</span>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{language === 'en' ? 'Sign in' : 'साइन इन करें'}</h1>
                    <p className="text-gray-400 text-sm mb-6">{language === 'en' ? 'Welcome back! Please enter your details.' : 'वापस स्वागत है! कृपया अपना विवरण दर्ज करें।'}</p>

                    {/* Role Selection */}
                    <div className="flex bg-[#1A1C26]/80 p-1.5 rounded-xl border border-gray-800/60 mb-6 relative">
                        {['renter', 'owner', 'admin'].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 relative ${role === r ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-300'
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

                    {/* Error */}
                    {error && (
                        <div className="mb-6 px-4 py-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium backdrop-blur-sm" style={{ animation: 'shake 0.4s ease-in-out' }}>
                            {error}
                        </div>
                    )}

                    {/* Email + Password Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-5 mb-8">
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
                                <button type="button" className="text-sm text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors drop-shadow-sm">
                                    {language === 'en' ? 'Forgot password?' : 'पासवर्ड भूल गए?'}
                                </button>
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

                        {/* Cloudflare Turnstile CAPTCHA */}
                        <div className="mt-2">
                            <TurnstileWidget
                                onVerify={(token) => setTurnstileToken(token)}
                                onExpire={() => setTurnstileToken('')}
                                onError={() => setTurnstileToken('')}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !turnstileToken}
                            className="w-full bg-[#9333EA] hover:bg-[#A855F7] disabled:bg-gray-700 disabled:text-gray-400 disabled:shadow-none text-white font-bold py-3.5 rounded-2xl transition-all duration-300 text-sm shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] active:scale-[0.98] mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" /></svg>
                                    {language === 'en' ? 'Signing in...' : 'साइन इन हो रहा है...'}
                                </span>
                            ) : (language === 'en' ? 'Sign in' : 'साइन इन करें')}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-gray-800/80" />
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{language === 'en' ? 'or continue with' : 'या इसके साथ जारी रखें'}</span>
                        <div className="flex-1 h-px bg-gray-800/80" />
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleSocialLogin('Google')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-700/50 bg-[#1A1C26]/50 rounded-2xl hover:bg-[#1A1C26] hover:border-gray-600 transition-all duration-300 font-semibold text-gray-200 text-sm active:scale-[0.98] disabled:opacity-50"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            {language === 'en' ? 'Sign in with Google' : 'गूगल के साथ साइन इन करें'}
                        </button>

                        <button
                            onClick={() => handleSocialLogin('Apple')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-700/50 bg-[#1A1C26]/50 rounded-2xl hover:bg-[#1A1C26] hover:border-gray-600 transition-all duration-300 font-semibold text-gray-200 text-sm active:scale-[0.98] disabled:opacity-50"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M16.365 21.442c-1.127 0-2.082-.44-3.152-1.05-1.077-.62-2.188-1.258-3.415-1.258-1.22 0-2.316.634-3.353 1.238-1.074.62-2.094 1.082-3.18 1.05-1.218-.035-2.45-.487-3.473-1.637C-2.27 17.51.528 10.957 2.457 7.923c.96-1.503 2.505-2.388 4.192-2.366 1.033.013 2.043.435 3.016 1.026.837.512 1.54 1.002 2.21 1.01.625.01 1.343-.455 2.226-.98 1.04-.616 2.152-1.18 3.322-1.164 1.83.02 3.454.854 4.542 2.152-3.465 1.944-2.88 5.922.565 7.42-.816 2.102-1.928 4.49-3.486 6.15-.99.943-1.896 1.616-2.678 1.61zM11.964 5.378c-.287-2.203 1.527-4.103 3.655-4.377.34 2.225-1.602 4.144-3.655 4.377z" /></svg>
                            {language === 'en' ? 'Sign in with Apple' : 'एप्पल के साथ साइन इन करें'}
                        </button>
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-gray-400 mt-8">
                        {language === 'en' ? "Don't have an account?" : "खाता नहीं है?"}{' '}
                        <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-colors">
                            {language === 'en' ? 'Sign up for free' : 'फ्री में साइन अप करें'}
                        </Link>
                    </p>

                    {/* Terms */}
                    <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed">
                        {language === 'en' ? "By continuing, you agree to HomeHive's" : "जारी रखकर, आप HomeHive की"}{' '}
                        <span className="text-gray-400 hover:text-purple-400 hover:underline cursor-pointer transition-colors">{language === 'en' ? 'Terms of Service' : 'सेवा की शर्तों'}</span> {language === 'en' ? 'and' : 'और'}{' '}
                        <span className="text-gray-400 hover:text-purple-400 hover:underline cursor-pointer transition-colors">{language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}</span> {language === 'en' ? '.' : 'से सहमत हैं।'}
                    </p>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-4px); }
                    80% { transform: translateX(4px); }
                }
            `}</style>
        </div>
    );
}
