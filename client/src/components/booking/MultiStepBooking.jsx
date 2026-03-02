import React, { useState, useEffect } from 'react';
import { Calendar, Users, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Modal } from '../common/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import useAppStore from '../../store/useAppStore';
import { translations } from '../../data/translations';

export default function MultiStepBooking({ isOpen, onClose, property, initialRange }) {
    const [step, setStep] = useState(1);
    const { addNotification, language } = useAppStore();
    const t = translations[language];

    const [formData, setFormData] = useState({
        startDate: initialRange?.from ? format(initialRange.from, 'yyyy-MM-dd') : '',
        endDate: initialRange?.to ? format(initialRange.to, 'yyyy-MM-dd') : '',
        guests: 1,
        cardNumber: '',
        cvv: '',
        expiry: ''
    });

    useEffect(() => {
        if (initialRange?.from) setFormData(prev => ({ ...prev, startDate: format(initialRange.from, 'yyyy-MM-dd') }));
        if (initialRange?.to) setFormData(prev => ({ ...prev, endDate: format(initialRange.to, 'yyyy-MM-dd') }));
    }, [initialRange]);

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleConfirm = () => {
        // Mock API call
        setTimeout(() => {
            addNotification({
                type: 'booking',
                title: language === 'en' ? 'Booking Confirmed!' : 'बुकिंग की पुष्टि हो गई!',
                text: language === 'en'
                    ? `Your stay at ${property?.title} has been booked successfully.`
                    : `${property?.title} पर आपका प्रवास सफलतापूर्वक बुक हो गया है।`,
                icon: 'CheckCircle'
            });
            setStep(4);
        }, 1500);
    };

    const steps = [
        { id: 1, label: t.stayDates, icon: Calendar },
        { id: 2, label: t.guestInfo, icon: Users },
        { id: 3, label: t.checkout, icon: CreditCard },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.secureReservation}>
            <div className="max-w-2xl mx-auto">
                {step < 4 ? (
                    <div className="flex flex-col h-full">
                        {/* Progress Stepper */}
                        <div className="flex items-center justify-between mb-10 px-4">
                            {steps.map((s, idx) => (
                                <React.Fragment key={s.id}>
                                    <div className="flex flex-col items-center gap-2 relative">
                                        <motion.div
                                            animate={{
                                                scale: step === s.id ? 1.1 : 1,
                                                backgroundColor: step >= s.id ? 'rgb(37, 99, 235)' : 'rgb(243, 244, 246)'
                                            }}
                                            className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
                                                step >= s.id ? "border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" : "bg-gray-100 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 font-bold"
                                            )}
                                        >
                                            <s.icon size={22} />
                                        </motion.div>
                                        <span className={cn("text-[10px] uppercase tracking-tighter font-bold", step >= s.id ? "text-blue-600" : "text-gray-400")}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className={cn("h-0.5 flex-1 mx-2 rounded-full transition-all duration-500", step > s.id ? "bg-blue-600" : "bg-gray-100 dark:bg-gray-800")} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="min-h-[350px] relative px-2">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                                            <Info className="text-blue-600 w-5 h-5 flex-shrink-0" />
                                            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                                                {t.datePreFilled}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.checkIn}</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="date"
                                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                                        value={formData.startDate}
                                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.checkOut}</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="date"
                                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                                        value={formData.endDate}
                                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                                            <h4 className="font-bold flex items-center gap-2 mb-4">
                                                <Users className="text-blue-600 w-5 h-5" /> {t.whosComing}
                                            </h4>
                                            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                <div>
                                                    <p className="font-bold text-sm">{t.totalGuestsLabel}</p>
                                                    <p className="text-xs text-gray-500">{t.maxGuestsAllowed}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => setFormData(f => ({ ...f, guests: Math.max(1, f.guests - 1) }))}
                                                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 hover:border-blue-500"
                                                    >-</button>
                                                    <span className="font-bold w-4 text-center">{formData.guests}</span>
                                                    <button
                                                        onClick={() => setFormData(f => ({ ...f, guests: Math.min(6, f.guests + 1) }))}
                                                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 hover:border-blue-500"
                                                    >+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 text-white overflow-hidden shadow-xl">
                                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                                            <div className="flex justify-between items-start mb-10">
                                                <CreditCard className="w-10 h-10 opacity-60" />
                                                <span className="text-lg font-bold tracking-widest italic opacity-80">VISA</span>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="text-xl font-bold tracking-[0.2em]">{formData.cardNumber || '•••• •••• •••• ••••'}</div>
                                                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest opacity-60">
                                                    <div>{t.cardHolder}</div>
                                                    <div>{t.expires}</div>
                                                </div>
                                                <div className="flex justify-between text-sm uppercase font-bold tracking-wider">
                                                    <div>ARYAN SHARMA</div>
                                                    <div>12/28</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase text-gray-400">{t.cardNumber}</label>
                                            <input
                                                type="text"
                                                placeholder="XXXX XXXX XXXX XXXX"
                                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                                value={formData.cardNumber}
                                                onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Section */}
                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{t.totalPrice}</p>
                                <p className="text-xl font-black text-blue-600">₹{property?.price || 0}</p>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={step === 1 ? onClose : handleBack} className="rounded-2xl px-6">
                                    {step === 1 ? t.cancel : t.goBack}
                                </Button>
                                <Button
                                    onClick={step === 3 ? handleConfirm : handleNext}
                                    className={cn(
                                        "rounded-2xl px-8 min-w-[140px] h-12 shadow-lg shadow-blue-100 dark:shadow-none transition-all",
                                        step === 3 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                                    )}
                                >
                                    {step === 3 ? t.confirmPay : t.nextStep}
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-12 flex flex-col items-center text-center"
                    >
                        <div className="relative mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                                className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center relative z-10"
                            >
                                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-green-400/20 rounded-full blur-xl"
                            />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">{t.successBooking}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm leading-relaxed">
                            {t.packBags.replace('{title}', property?.title)}
                        </p>
                        <div className="flex flex-col gap-3 w-full max-w-[280px]">
                            <Button onClick={onClose} className="w-full rounded-2xl h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold">
                                {t.done}
                            </Button>
                            <Button variant="ghost" onClick={onClose} className="w-full rounded-2xl h-12 text-blue-600">
                                {t.viewBookingDetails}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </Modal>
    );
}
