import React, { useState, useRef, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import useAuthStore from '../../store/useAuthStore';
import { Moon, Sun, Bell, Globe, ArrowRight, Home, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { motion, AnimatePresence } from 'framer-motion';

import { translations } from '../../data/translations';

export default function Header() {
    const { theme, toggleTheme, language, setLanguage, notifications } = useAppStore();
    const { user, isAuthenticated, logout } = useAuthStore();
    const unreadCount = notifications.filter(n => !n.read).length;
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const t = translations[language];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-800/60 bg-[#0B0B13]/80 backdrop-blur-md font-sans">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Home className="h-7 w-7 text-[#A855F7] group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        <span className="font-bold text-xl text-white tracking-tight">
                            {t.title || 'HomeHive'}
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link to="/" className="text-gray-400 hover:text-[#A855F7] transition-colors">{language === 'en' ? 'Home' : 'होम'}</Link>
                        <Link to="/about" className="text-gray-400 hover:text-[#A855F7] transition-colors">{t.aboutUs}</Link>
                        <Link to="/contact" className="text-gray-400 hover:text-[#A855F7] transition-colors">{t.contactUs}</Link>
                        <Link to="/properties" className="text-gray-400 hover:text-[#A855F7] transition-colors">{t.properties}</Link>
                        <Link to="/compare" className="text-gray-400 hover:text-[#A855F7] transition-colors">{t.compare}</Link>
                    </nav>
                </div>

                {/* Global Search Focus Target */}
                <div className="hidden md:flex max-w-sm w-full mx-4">
                    <form onSubmit={handleSearch} className="relative w-full flex items-center group">
                        <input
                            id="global-search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t.searchPlaceholder}
                            className="w-full bg-[#1A1C26]/80 border border-gray-700/50 rounded-xl py-2 pl-4 pr-10 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-[#A855F7]/50 focus:bg-[#1E202A] transition-all placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 group-focus-within:text-[#A855F7] hover:text-[#A855F7] transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2">

                    {/* Language Toggle */}
                    <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="gap-2 text-gray-400 hover:text-white hover:bg-purple-900/20">
                        <Globe className="h-4 w-4" />
                        <span className="text-xs font-semibold">{language === 'en' ? 'English' : 'हिंदी'}</span>
                    </Button>

                    {/* Theme Toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-gray-400 hover:text-[#A855F7] hover:bg-purple-900/20">
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    {/* Notifications */}
                    <div className="relative">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowNotifs(!showNotifs)}
                                className="relative hover:bg-purple-900/20 text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-[#A855F7]' : 'text-gray-400'}`} />
                                {unreadCount > 0 && (
                                    <Badge
                                        className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 rounded-full text-[9px] border-2 border-[#0B0B13] shadow-[0_0_5px_rgba(168,85,247,0.5)] bg-[#9333EA] text-white"
                                        variant="destructive"
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Badge>
                                )}
                            </Button>
                        </motion.div>

                        <NotificationPanel
                            isOpen={showNotifs}
                            onClose={() => setShowNotifs(false)}
                        />
                    </div>

                    {/* User actions */}
                    <div className="hidden sm:flex ml-2 gap-2 border-l border-gray-800/60 pl-4 items-center">
                        {isAuthenticated ? (
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-900/20 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-0.5">
                                        <div className="w-full h-full rounded-full bg-[#1A1C26] flex items-center justify-center">
                                            {user?.profileImage ? (
                                                <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <span className="text-purple-400 font-bold text-sm">
                                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-white transition-all ${showProfileMenu ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-56 bg-[#15161E]/95 backdrop-blur-xl border border-gray-800/60 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                                        >
                                            <div className="p-4 border-b border-gray-800/60">
                                                <p className="text-white font-semibold">{user?.name || 'User'}</p>
                                                <p className="text-gray-400 text-sm">{user?.email}</p>
                                                <p className="text-purple-400 text-xs mt-1 capitalize">{user?.role || 'renter'}</p>
                                            </div>
                                            
                                            <div className="py-2">
                                                <Link
                                                    to={user?.role === 'admin' ? '/admin' : user?.role === 'owner' ? '/owner' : '/renter'}
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-purple-900/20 transition-colors"
                                                >
                                                    <Home className="w-4 h-4" />
                                                    <span className="text-sm">Dashboard</span>
                                                </Link>
                                                
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-purple-900/20 transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span className="text-sm">{language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}</span>
                                                </Link>
                                                
                                                <Link
                                                    to="/settings"
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-purple-900/20 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span className="text-sm">{language === 'en' ? 'Settings' : 'सेटिंग्स'}</span>
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-800/60 py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="text-sm">{language === 'en' ? 'Log Out' : 'लॉग आउट'}</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outline" size="sm" className="ml-2 border-gray-700/50 text-gray-300 hover:text-white hover:bg-purple-900/20 hover:border-purple-500/30">
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm" className="bg-[#9333EA] hover:bg-[#A855F7] text-white font-semibold transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] border border-purple-400/20">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

