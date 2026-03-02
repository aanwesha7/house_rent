import React from 'react';
import { translations } from '../data/translations';
import useAppStore from '../store/useAppStore';
import { Shield, Users, Target } from 'lucide-react';

export default function AboutUs() {
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
                        About <span className="text-[#A855F7] drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">HomeHive</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        {language === 'en'
                            ? 'We are on a mission to revolutionize the way people find their perfect homes. Making renting simple, secure, and transparent.'
                            : 'हम लोगों के अपने आदर्श घर खोजने के तरीके में क्रांति लाने के मिशन पर हैं। किराये को सरल, सुरक्षित और पारदर्शी बनाना।'}
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-[#15161E] rounded-[2rem] border border-gray-800/60 shadow-2xl p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 backdrop-blur-3xl">

                    {/* Left Form Side - Our Story & Features */}
                    <div className="flex-1 p-2 md:p-6 flex flex-col justify-center">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4 tracking-wide">{language === 'en' ? 'Our Story' : 'हमारी कहानी'}</h2>
                            <p className="text-gray-400 text-[15px] leading-relaxed mb-6">
                                {language === 'en'
                                    ? 'Founded in 2026, HomeHive started with a simple idea finding a home should be exciting, not exhausting. We built a platform that connects verified owners with genuine renters, eliminating the friction and anxiety traditionally associated with property rentals.'
                                    : '2026 में स्थापित, होम-हाइव एक सरल विचार के साथ शुरू हुआ: घर खोजना रोमांचक होना चाहिए, थकाऊ नहीं। हमने एक ऐसा मंच बनाया जो सत्यापित मालिकों को वास्तविक किरायेदारों से जोड़ता है।'}
                            </p>
                        </div>

                        <div className="space-y-4 pt-2 border-t border-gray-800/60">
                            {[
                                { icon: Shield, title: language === 'en' ? 'Trust & Safety' : 'विश्वास और सुरक्षा', desc: language === 'en' ? 'Every user and property is verified.' : 'हर उपयोगकर्ता और संपत्ति का सत्यापन किया जाता है।' },
                                { icon: Users, title: language === 'en' ? 'Community First' : 'समुदाय प्रथम', desc: language === 'en' ? 'Prioritizing the needs of renters and owners.' : 'किरायेदारों और मालिकों की जरूरतों को प्राथमिकता देना।' },
                                { icon: Target, title: language === 'en' ? 'Innovation' : 'नवाचार', desc: language === 'en' ? 'Evolving tech for the best rental experience.' : 'सर्वोत्तम किराये के अनुभव के लिए तकनीक विकसित करना।' },
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-[#1A1C26]/80 text-white border border-gray-700/30 hover:bg-[#1E202A] transition-colors">
                                    <div className="p-3 rounded-lg bg-purple-900/30 border border-purple-500/20">
                                        <feature.icon className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[15px] text-gray-200 mb-1">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image Side */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[450px] lg:min-h-full bg-[#111218] border border-gray-800/50 shadow-inner group">
                        {/* Modern Architecture Image */}
                        <img
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000"
                            alt="Modern architecture"
                            className="absolute inset-0 w-full h-[110%] object-cover object-center opacity-70 animate-float mix-blend-screen"
                        />
                        {/* Overlay to dim edges and highlight text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B13] via-[#0B0B13]/40 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-10 transition-transform duration-500">
                            <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed mb-5 drop-shadow-md pr-4">
                                {language === 'en' ? '"A home is not a place, it\'s a feeling. We are here to help you find that feeling every single day."' : '"घर कोई जगह नहीं है, यह एक एहसास है। हम उस एहसास को हर दिन खोजने में आपकी मदद करने आए हैं।"'}
                            </p>
                            <span className="text-white text-sm font-semibold flex items-center gap-3">
                                <div className="w-6 h-[2px] bg-purple-500/80 shadow-[0_0_5px_rgba(168,85,247,0.8)]"></div> The HomeHive Vision
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
