import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../../store/useAppStore';
import NotificationItem from './NotificationItem';
import { BellOff, Settings, ArrowLeft, Shield, MessageSquare, Calendar, Mail, Bell, Moon, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { translations } from '../../data/translations';

export default function NotificationPanel({ isOpen, onClose }) {
    const {
        notifications,
        markNotificationRead,
        clearNotifications,
        notificationFilter,
        setNotificationFilter,
        notificationSettings,
        updateNotificationSettings,
        language
    } = useAppStore();

    const t = translations[language];
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const filteredNotifications = notifications.filter(n => {
        if (notificationFilter === 'all') return true;
        return n.type === notificationFilter;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const toggleSetting = (key) => {
        updateNotificationSettings({ [key]: !notificationSettings[key] });
    };

    const filters = [
        { id: 'all', label: t.allFilter, icon: SlidersHorizontal },
        { id: 'booking', label: t.bookingsFilter, icon: Calendar },
        { id: 'message', label: t.messagesFilter, icon: MessageSquare },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 md:hidden bg-black/20 backdrop-blur-[2px]" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="absolute right-0 top-full mt-2 w-screen max-w-[400px] sm:w-[400px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[600px]"
                    >
                        <AnimatePresence mode="wait">
                            {!isSettingsOpen ? (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex flex-col h-full"
                                >
                                    {/* Header */}
                                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                {t.inbox} {unreadCount > 0 && <span className="w-5 h-5 bg-blue-600 text-[10px] text-white rounded-full flex items-center justify-center animate-pulse">{unreadCount}</span>}
                                            </h3>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{t.manageAlerts}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                                                <Settings size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Filter Chips */}
                                    <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50">
                                        {filters.map(filter => (
                                            <button
                                                key={filter.id}
                                                onClick={() => setNotificationFilter(filter.id)}
                                                className={cn(
                                                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                                                    notificationFilter === filter.id
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none"
                                                        : "bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
                                                )}
                                            >
                                                <filter.icon size={12} />
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Scrollable List */}
                                    <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar bg-white dark:bg-gray-950">
                                        {filteredNotifications.length > 0 ? (
                                            <div className="divide-y divide-gray-50 dark:divide-gray-900">
                                                {filteredNotifications.map((notification) => (
                                                    <NotificationItem
                                                        key={notification.id}
                                                        notification={notification}
                                                        onRead={markNotificationRead}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-20 flex flex-col items-center text-center px-10">
                                                <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-6 relative">
                                                    <BellOff className="text-gray-300 dark:text-gray-700" size={36} />
                                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute inset-0 bg-blue-400/5 rounded-full blur-xl" />
                                                </div>
                                                <h4 className="text-gray-900 dark:text-white font-bold tracking-tight text-lg">{t.allCaughtUp}</h4>
                                                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                                                    {t.noNotificationsType.replace('{type}', notificationFilter !== 'all' ? (language === 'en' ? notificationFilter + ' ' : (notificationFilter === 'booking' ? 'बुकिंग ' : 'संदेश ')) : '')}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    {notifications.length > 0 && (
                                        <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                                            <button onClick={clearNotifications} className="w-full py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-colors">
                                                {t.clearArchive}
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col h-full"
                                >
                                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                        <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                                            <ArrowLeft size={18} />
                                        </button>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{t.settings}</h3>
                                            <p className="text-[11px] text-gray-500">{t.preferencesDesc}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <section>
                                            <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4">{t.deliveryChannels}</h4>
                                            <div className="space-y-3">
                                                <SettingToggle
                                                    icon={Bell}
                                                    title={t.pushNotifications}
                                                    desc={t.pushDesc}
                                                    active={notificationSettings.push}
                                                    onToggle={() => toggleSetting('push')}
                                                />
                                                <SettingToggle
                                                    icon={Mail}
                                                    title={t.emailDigests}
                                                    desc={t.emailDesc}
                                                    active={notificationSettings.email}
                                                    onToggle={() => toggleSetting('email')}
                                                />
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4">{t.contentControls}</h4>
                                            <div className="space-y-3">
                                                <SettingToggle
                                                    icon={Calendar}
                                                    title={t.bookingUpdates}
                                                    desc={t.bookingDesc}
                                                    active={notificationSettings.bookings}
                                                    onToggle={() => toggleSetting('bookings')}
                                                />
                                                <SettingToggle
                                                    icon={MessageSquare}
                                                    title={t.directMessages}
                                                    desc={t.messagesDesc}
                                                    active={notificationSettings.messages}
                                                    onToggle={() => toggleSetting('messages')}
                                                />
                                            </div>
                                        </section>

                                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                                            <button
                                                onClick={() => toggleSetting('dnd')}
                                                className={cn(
                                                    "w-full p-4 rounded-2xl border transition-all flex items-center justify-between",
                                                    notificationSettings.dnd
                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none"
                                                        : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-2 rounded-xl", notificationSettings.dnd ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800")}>
                                                        <Moon size={18} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-bold">{t.dnd}</p>
                                                        <p className={cn("text-[10px] font-medium", notificationSettings.dnd ? "text-indigo-100/70" : "text-gray-500")}>{t.pauseAlerts}</p>
                                                    </div>
                                                </div>
                                                <div className={cn("w-10 h-6 rounded-full relative transition-colors p-1", notificationSettings.dnd ? "bg-white" : "bg-gray-200 dark:bg-gray-700")}>
                                                    <motion.div animate={{ x: notificationSettings.dnd ? 16 : 0 }} className={cn("w-4 h-4 rounded-full shadow-sm", notificationSettings.dnd ? "bg-indigo-600" : "bg-white")} />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function SettingToggle({ icon: Icon, title, desc, active, onToggle }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-transparent group-hover:border-blue-100 dark:group-hover:border-blue-900/30">
                    <Icon size={18} />
                </div>
                <div>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h5>
                    <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
                </div>
            </div>
            <button onClick={onToggle} className={cn("w-10 h-6 rounded-full relative transition-colors p-1", active ? "bg-blue-600" : "bg-gray-100 dark:bg-gray-700")}>
                <motion.div animate={{ x: active ? 16 : 0 }} className="w-4 h-4 rounded-full bg-white shadow-sm shadow-black/5" />
            </button>
        </div>
    );
}
