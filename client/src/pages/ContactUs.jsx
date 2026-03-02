import React, { useState } from 'react';
import { translations } from '../data/translations';
import useAppStore from '../store/useAppStore';
import { Send, CheckCircle2, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ContactUs() {
    const { language } = useAppStore();
    const t = translations[language];

    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    };

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
                        Get in <span className="text-[#A855F7] drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">touch</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400">
                        {language === 'en' ? "Reach out, and let's find the perfect place to call home!" : "हमसे संपर्क करें, और आइए घर कहने के लिए एक सही जगह खोजें!"}
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-[#15161E] rounded-[2rem] border border-gray-800/60 shadow-2xl p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 backdrop-blur-3xl">

                    {/* Left Form Side */}
                    <div className="flex-1 p-2 md:p-6 flex flex-col justify-center">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-3 tracking-wide">{language === 'en' ? 'Contact HomeHive' : 'होम-हाइव से संपर्क करें'}</h2>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                {language === 'en' ? "Whether you are looking for your dream home or have a question about our services, our real estate experts are here to help." : "चाहे आप अपने सपनों का घर ढूंढ रहे हों या हमारी सेवाओं के बारे में कोई प्रश्न हों, हमारे रियल एस्टेट विशेषज्ञ आपकी मदद करने के लिए यहाँ हैं।"}
                            </p>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-gray-300">123 Realty Street, Suite 100, New York</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-gray-300">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-gray-300">support@homehive.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {submitted ? (
                                <div className="flex flex-col items-center justify-center py-16 bg-[#1A1C26] rounded-2xl border border-purple-500/20 text-center animate-in zoom-in duration-300 shadow-inner">
                                    <CheckCircle2 className="w-16 h-16 text-purple-400 mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    <h3 className="text-xl font-bold text-white mb-2">{language === 'en' ? 'Message Sent!' : 'संदेश भेजा गया!'}</h3>
                                    <p className="text-purple-300/80">{language === 'en' ? 'Thank you for reaching out. We will respond shortly.' : 'संपर्क करने के लिए धन्यवाद। हम शीघ्र ही उत्तर देंगे।'}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full px-5 py-3.5 rounded-xl border border-gray-700/50 bg-[#1A1C26]/80 text-white focus:bg-[#1E202A] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500 transition-all outline-none placeholder-gray-500 text-sm"
                                                placeholder="First Name" />
                                        </div>
                                        <div className="space-y-1">
                                            <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full px-5 py-3.5 rounded-xl border border-gray-700/50 bg-[#1A1C26]/80 text-white focus:bg-[#1E202A] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500 transition-all outline-none placeholder-gray-500 text-sm"
                                                placeholder="Last Name" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-xl border border-gray-700/50 bg-[#1A1C26]/80 text-white focus:bg-[#1E202A] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500 transition-all outline-none placeholder-gray-500 text-sm"
                                            placeholder="Email" />
                                    </div>
                                    <div className="space-y-1">
                                        <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-xl border border-gray-700/50 bg-[#1A1C26]/80 text-white focus:bg-[#1E202A] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500 transition-all outline-none placeholder-gray-500 text-sm"
                                            placeholder="Phone Number" />
                                    </div>
                                    <div className="space-y-1">
                                        <textarea required rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-xl border border-gray-700/50 bg-[#1A1C26]/80 text-white focus:bg-[#1E202A] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500 transition-all outline-none resize-none placeholder-gray-500 text-sm"
                                            placeholder="Message"></textarea>
                                    </div>
                                    <div className="pt-3">
                                        <Button type="submit" className="w-full py-6 bg-[#9333EA] hover:bg-[#A855F7] text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] border border-purple-400/20 group">
                                            {language === 'en' ? 'Send Message' : 'संदेश भेजें'} <Send className="w-5 h-5 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>

                    {/* Right Image Side */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[450px] lg:min-h-full bg-[#111218] border border-gray-800/50 shadow-inner group">
                        {/* A beautiful dark modern house stock image fitting for real estate */}
                        <img
                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000"
                            alt="Modern dark architecture"
                            className="absolute inset-0 w-full h-[110%] object-cover object-center opacity-70 animate-float mix-blend-screen"
                        />
                        {/* Overlay to dim edges and highlight text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B13] via-[#0B0B13]/40 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-10 transition-transform duration-500">
                            <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed mb-5 drop-shadow-md pr-4">
                                {language === 'en' ? '"Finding the right home is more than just a search; it\'s discovering the place where your next chapter begins."' : '"सही घर ढूंढना सिर्फ एक खोज से कहीं अधिक है; यह उस जगह की खोज है जहां से आपका अगला अध्याय शुरू होता है।"'}
                            </p>
                            <span className="text-white text-sm font-semibold flex items-center gap-3">
                                <div className="w-6 h-[2px] bg-purple-500/80 shadow-[0_0_5px_rgba(168,85,247,0.8)]"></div> The HomeHive Team
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
