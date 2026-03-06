import React from 'react';
import { translations } from '../data/translations';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import { LogOut, Heart, Clock, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

export default function RenterHome() {
    const { language, savedPropertyIds } = useAppStore();
    const { user, logout } = useAuthStore();
    const t = translations[language];
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0B0B13] relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-500 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 p-6 bg-[#15161E]/60 backdrop-blur-md rounded-3xl border border-[#A855F7]/20 shadow-[0_0_20px_rgba(168,85,247,0.05)] gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {language === 'en' ? `Welcome back, ${user?.name || 'Renter'}!` : `वापसी पर स्वागत है, ${user?.name || 'किरायेदार'}!`}
                        </h1>
                        <p className="text-gray-400">
                            {language === 'en' ? 'Manage your bookings and saved properties here.' : 'अपनी बुकिंग और सहेजी गई संपत्तियों को प्रबंधित करें।'}
                        </p>
                    </div>
                    <Button onClick={handleLogout} variant="destructive" className="gap-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border border-red-500/30 rounded-xl px-6 py-2.5 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        <LogOut className="w-4 h-4" /> {language === 'en' ? 'Logout' : 'लॉग आउट'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[#15161E]/80 backdrop-blur-xl border border-gray-800/60 p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Clock className="w-24 h-24 text-blue-500" />
                        </div>
                        <div className="w-14 h-14 bg-blue-900/30 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]">
                            <Clock className="w-7 h-7 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">0</h3>
                        <p className="text-blue-400 text-sm font-semibold tracking-wide uppercase">{language === 'en' ? 'Active Bookings' : 'सक्रिय बुकिंग'}</p>
                    </div>

                    <div className="bg-[#15161E]/80 backdrop-blur-xl border border-gray-800/60 p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Heart className="w-24 h-24 text-pink-500" />
                        </div>
                        <div className="w-14 h-14 bg-pink-900/30 text-pink-400 rounded-2xl flex items-center justify-center mb-6 border border-pink-500/20 shadow-[inset_0_0_15px_rgba(236,72,153,0.1)]">
                            <Heart className="w-7 h-7 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]" />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">{savedPropertyIds?.length || 0}</h3>
                        <p className="text-pink-400 text-sm font-semibold tracking-wide uppercase">{language === 'en' ? 'Saved Properties' : 'सहेजी गई संपत्तियाँ'}</p>
                    </div>

                    <div className="bg-[#15161E]/80 backdrop-blur-xl border border-gray-800/60 p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <HomeIcon className="w-24 h-24 text-green-500" />
                        </div>
                        <div className="w-14 h-14 bg-green-900/30 text-green-400 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 shadow-[inset_0_0_15px_rgba(34,197,94,0.1)]">
                            <HomeIcon className="w-7 h-7 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">2</h3>
                        <p className="text-green-400 text-sm font-semibold tracking-wide uppercase">{language === 'en' ? 'Past Stays' : 'पिछले प्रवास'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#15161E]/80 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative">
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#A855F7]/10 blur-2xl rounded-full pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800/60">
                            <h2 className="text-2xl font-bold text-white">
                                {language === 'en' ? 'Recent Bookings' : 'हाल की बुकिंग'}
                            </h2>
                        </div>
                        <div className="text-center py-16 bg-[#1A1C26]/50 rounded-2xl border border-gray-800/60">
                            <p className="text-gray-400 mb-6 text-lg">{language === 'en' ? "You don't have any bookings right now." : "आपके पास अभी कोई बुकिंग नहीं है।"}</p>
                            <Link to="/properties">
                                <Button className="bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#A855F7] hover:to-[#9333EA] text-white rounded-xl px-8 py-6 text-base shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] font-bold transition-all group">
                                    {t.browseProperties} <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[#15161E]/80 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative">
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-500/10 blur-2xl rounded-full pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800/60">
                            <h2 className="text-2xl font-bold text-white">
                                {language === 'en' ? 'Saved Properties' : 'सहेजी गई संपत्तियाँ'}
                            </h2>
                            {savedPropertyIds?.length > 0 && (
                                <Link to="/compare" className="text-[#A855F7] hover:text-purple-400 text-sm font-semibold transition-colors flex items-center gap-1">
                                    {language === 'en' ? 'Compare All' : 'तुलना करें'} <ChevronRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                        {savedPropertyIds?.length > 0 ? (
                            <div className="space-y-4">
                                <div className="bg-[#1A1C26]/50 p-6 rounded-2xl border border-gray-800/60 text-center">
                                    <Heart className="w-12 h-12 text-pink-500/50 mx-auto mb-4" />
                                    <p className="text-gray-300 text-lg">
                                        {language === 'en'
                                            ? `You have ${savedPropertyIds.length} properties saved.`
                                            : `आपने ${savedPropertyIds.length} संपत्तियां सहेजी हैं।`}
                                    </p>
                                    <p className="text-gray-500 mt-2 text-sm">
                                        Go to the Compare page to view them in detail side-by-side.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-[#1A1C26]/50 rounded-2xl border border-gray-800/60">
                                <Heart className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">{language === 'en' ? "No saved properties yet." : "अभी तक कोई संपत्तियां सहेजी नहीं गई हैं।"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
