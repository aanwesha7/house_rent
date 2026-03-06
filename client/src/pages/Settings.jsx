import { useState } from 'react';
import useAppStore from '../store/useAppStore';

export default function Settings() {
    const { language, setLanguage, notificationSettings, updateNotificationSettings } = useAppStore();
    const [saved, setSaved] = useState(false);

    const handleToggle = (key) => {
        updateNotificationSettings({ [key]: !notificationSettings[key] });
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    return (
        <div className="min-h-screen bg-[#0B0B13] p-6 text-white">
            <div className="max-w-2xl mx-auto bg-[#15161E]/90 border border-gray-800/60 rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-6">Settings</h1>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Language</label>
                        <select
                            value={language}
                            onChange={(event) => setLanguage(event.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[#1A1C26] border border-gray-700"
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        {['push', 'email', 'bookings', 'messages', 'dnd'].map((key) => (
                            <button
                                key={key}
                                onClick={() => handleToggle(key)}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#1A1C26] border border-gray-700 hover:border-purple-500/40"
                            >
                                <span className="capitalize">{key}</span>
                                <span className={notificationSettings[key] ? 'text-green-400' : 'text-gray-500'}>
                                    {notificationSettings[key] ? 'On' : 'Off'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {saved ? <p className="text-green-400 text-sm mt-6">Settings updated</p> : null}
            </div>
        </div>
    );
}
