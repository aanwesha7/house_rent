import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { Moon, Sun, Bell, Globe, ArrowRight, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { motion } from 'framer-motion';

import { translations } from '../../data/translations';

export default function Header() {
    const { theme, toggleTheme, language, setLanguage, notifications, isAuthenticated, user, logout } = useAppStore();
    const unreadCount = notifications.filter(n => !n.read).length;
    const [showNotifs, setShowNotifs] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

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
                            <>
                                <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'owner' ? '/owner' : '/renter'}>
                                    <Button variant="outline" size="sm" className="border-gray-700/50 text-gray-300 hover:text-white hover:bg-purple-900/20 hover:border-purple-500/30">Dashboard</Button>
                                </Link>
                                <div className="flex items-center gap-2 ml-2 border-l pl-4 border-gray-800/60">
                                    <div className="w-8 h-8 rounded-full bg-purple-900/30 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(147,51,234,0.1)]">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={logout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                        Log Out
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/signup">
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

