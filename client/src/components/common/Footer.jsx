import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { translations } from '../../data/translations';

export default function Footer() {
    const { language } = useAppStore();
    const t = translations[language];

    return (
        <footer className="bg-[#0B0B13] border-t border-gray-800/60 pt-16 pb-8 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
                <div className="absolute bottom-[-50%] left-1/4 w-[50%] h-[100%] bg-purple-900/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand & About */}
                    <div className="md:col-span-1 border-r-0 md:border-r border-gray-800/60 pr-8">
                        <Link to="/" className="flex items-center space-x-2 mb-6 group">
                            <Home className="h-8 w-8 text-[#A855F7] group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            <span className="font-bold text-2xl text-white tracking-tight">
                                {t.title || 'HomeHive'}
                            </span>
                        </Link>
                        <p className="text-gray-400 text-[15px] leading-relaxed mb-6">
                            {t.findPerfectHome}
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 hover:text-white hover:border-purple-400 hover:bg-purple-600/40 transition-all shadow-[0_0_10px_rgba(147,51,234,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 hover:text-white hover:border-purple-400 hover:bg-purple-600/40 transition-all shadow-[0_0_10px_rgba(147,51,234,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 hover:text-white hover:border-purple-400 hover:bg-purple-600/40 transition-all shadow-[0_0_10px_rgba(147,51,234,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-gray-200 mb-6 uppercase text-sm tracking-wider">{t.footerLinks}</h4>
                        <ul className="space-y-4 text-[15px]">
                            <li><Link to="/" className="text-gray-400 hover:text-[#A855F7] transition-colors inline-block">{t.home}</Link></li>
                            <li><Link to="/properties" className="text-gray-400 hover:text-[#A855F7] transition-colors inline-block">{t.properties}</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-[#A855F7] transition-colors inline-block">{t.aboutUs}</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-[#A855F7] transition-colors inline-block">{t.contactUs}</Link></li>
                        </ul>
                    </div>

                    {/* Legal Info */}
                    <div>
                        <h4 className="font-semibold text-gray-200 mb-6 uppercase text-sm tracking-wider">Legal</h4>
                        <ul className="space-y-4 text-[15px]">
                            <li><Link to="/terms" className="text-gray-400 hover:text-[#A855F7] transition-colors inline-block">{t.termsAndConditions}</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-[#A855F7] transition-colors inline-block">{t.privacyPolicy}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-gray-200 mb-6 uppercase text-sm tracking-wider">Contact</h4>
                        <ul className="space-y-4 text-[15px] text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-purple-400/80 flex-shrink-0 mt-0.5" />
                                <span>123 Realty Street, Suite 100<br />New York, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-purple-400/80 flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 hover:text-[#A855F7] transition-colors cursor-pointer group">
                                <Mail className="w-4 h-4 text-purple-400/80 group-hover:text-[#A855F7] flex-shrink-0 transition-colors" />
                                <span>support@homehive.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800/60 mt-4 pt-8 flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">
                        {t.footerRights}
                    </p>
                </div>
            </div>
        </footer>
    );
}
