import React from 'react';
import { translations } from '../data/translations';
import useAppStore from '../store/useAppStore';

export default function TermsAndConditions() {
    const { language } = useAppStore();
    const t = translations[language];

    return (
        <div className="relative min-h-screen bg-[#0B0B13] flex flex-col items-center pt-24 pb-16 px-4 font-sans text-gray-200">
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(1deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(168, 85, 247, 0.3);
                    border-radius: 20px;
                }
            `}</style>

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-900/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl animate-in fade-in zoom-in-95 duration-700">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-white">
                        Legal <span className="text-[#A855F7] drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">Terms</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        {language === 'en'
                            ? 'Please read these terms and conditions carefully before using HomeHive.'
                            : 'कृपया होम-हाइव का उपयोग करने से पहले इन नियमों और शर्तों को ध्यान से पढ़ें।'}
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-[#15161E] rounded-[2rem] border border-gray-800/60 shadow-2xl p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 backdrop-blur-3xl overflow-hidden">

                    {/* Left Form Side - Scrollable Terms Content */}
                    <div className="flex-1 p-2 md:p-6 flex flex-col justify-start max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                        <div className="mb-8 border-b border-gray-800/60 pb-6">
                            <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">{language === 'en' ? 'Terms & Conditions' : 'नियम और शर्तें'}</h2>
                            <p className="text-purple-400 text-sm font-semibold tracking-wider uppercase">Last updated: October 15, 2026</p>
                        </div>

                        <div className="space-y-8 text-[15px] leading-relaxed text-gray-400">
                            <section>
                                <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">1</div>
                                    Introduction
                                </h3>
                                <p>Welcome to HomeHive. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions.</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">2</div>
                                    Intellectual Property Rights
                                </h3>
                                <p>Other than the content you own, under these Terms, HomeHive and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">3</div>
                                    Restrictions
                                </h3>
                                <p>You are specifically restricted from all of the following: publishing any Website material in any other media; selling, sublicensing and/or otherwise commercializing any Website material; publicly performing and/or showing any Website material; using this Website in any way that is or may be damaging to this Website.</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">4</div>
                                    Your Content
                                </h3>
                                <p>In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant HomeHive a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">5</div>
                                    No warranties
                                </h3>
                                <p>This Website is provided "as is," with all faults, and HomeHive express no representations or warranties, of any kind related to this Website or the materials contained on this Website.</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">6</div>
                                    Limitation of liability
                                </h3>
                                <p>In no event shall HomeHive, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">7</div>
                                    Variation of Terms
                                </h3>
                                <p>HomeHive is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.</p>
                            </section>
                        </div>
                    </div>

                    {/* Right Image Side */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[450px] lg:min-h-full bg-[#111218] border border-gray-800/50 shadow-inner group hidden md:block">
                        {/* Modern Architecture/Legal Image */}
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
                            alt="Modern architecture luxury home"
                            className="absolute inset-0 w-full h-[110%] object-cover object-center opacity-60 animate-float mix-blend-screen"
                        />
                        {/* Overlay to dim edges and highlight text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B13] via-[#0B0B13]/40 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-10 transition-transform duration-500">
                            <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed mb-5 drop-shadow-md pr-4">
                                {language === 'en' ? '"Clear agreements make for strong foundations. We believe in transparency at every step of your journey."' : '"स्पष्ट समझौते मजबूत नींव बनाते हैं। हम आपकी यात्रा के हर कदम पर पारदर्शिता में विश्वास करते हैं।"'}
                            </p>
                            <span className="text-white text-sm font-semibold flex items-center gap-3">
                                <div className="w-6 h-[2px] bg-purple-500/80 shadow-[0_0_5px_rgba(168,85,247,0.8)]"></div> The HomeHive Trust Team
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
