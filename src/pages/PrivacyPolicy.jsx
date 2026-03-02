import React from 'react';
import { translations } from '../data/translations';
import useAppStore from '../store/useAppStore';

export default function PrivacyPolicy() {
    const { language } = useAppStore();
    const t = translations[language];

    return (
        <div className="min-h-screen bg-[#0B0B13] relative overflow-hidden py-24 font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[40%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="bg-[#15161E]/80 backdrop-blur-xl border border-gray-800/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-[32px] p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 border-b border-gray-800/60 pb-6 tracking-tight drop-shadow-sm">
                        {language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
                    </h1>
                    <div className="prose prose-invert max-w-none text-gray-300 space-y-6 leading-relaxed">
                        <p className="text-purple-400 font-bold uppercase tracking-wider text-sm mb-8">Last updated: October 15, 2026</p>

                        <h3 className="text-2xl font-bold text-white mt-12 mb-4 flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-900/30 text-purple-400 text-sm border border-purple-500/20 shadow-inner">1</span>
                            Information We Collect
                        </h3>
                        <p className="pl-14 text-lg">We collect information you provide directly to us when you create an account, update your profile, use our services, converse with property owners or renters, and otherwise communicate with us.</p>

                        <h3 className="text-2xl font-bold text-white mt-12 mb-4 flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-900/30 text-blue-400 text-sm border border-blue-500/20 shadow-inner">2</span>
                            How We Use Information
                        </h3>
                        <p className="pl-14 text-lg">We use the information we collect to provide, maintain, and improve our services, communicate with you, monitor and analyze trends and usage, and personalize the HomeHive experience.</p>

                        <h3 className="text-2xl font-bold text-white mt-12 mb-4 flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-900/30 text-green-400 text-sm border border-green-500/20 shadow-inner">3</span>
                            Information Sharing
                        </h3>
                        <p className="pl-14 text-lg">We may share your information with property owners if you make an inquiry or booking. We do not sell your personal data to third parties. We may also share information to comply with legal obligations.</p>

                        <h3 className="text-2xl font-bold text-white mt-12 mb-4 flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-900/30 text-yellow-400 text-sm border border-yellow-500/20 shadow-inner">4</span>
                            Data Security
                        </h3>
                        <p className="pl-14 text-lg">We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet transmission is ever fully secure.</p>

                        <h3 className="text-2xl font-bold text-white mt-12 mb-4 flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-900/30 text-orange-400 text-sm border border-orange-500/20 shadow-inner">5</span>
                            Cookies
                        </h3>
                        <p className="pl-14 text-lg">Our website uses "cookies" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. You may choose to set your web browser to refuse cookies.</p>

                        <h3 className="text-2xl font-bold text-white mt-12 mb-4 flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-900/30 text-red-400 text-sm border border-red-500/20 shadow-inner">6</span>
                            Contact Us
                        </h3>
                        <p className="pl-14 text-lg">If you have any questions about this Privacy Policy, please contact us securely via our Contact Us page.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
