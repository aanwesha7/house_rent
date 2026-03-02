import React from 'react';
import {
    CheckCircle,
    CreditCard,
    Star,
    Shield,
    AlertTriangle,
    Info,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const icons = {
    booking: CheckCircle,
    payment: CreditCard,
    review: Star,
    admin: Shield,
    warning: AlertTriangle,
    info: Info
};

const colors = {
    booking: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    payment: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    review: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    admin: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    warning: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    info: 'text-gray-500 bg-gray-50 dark:bg-gray-900/20'
};

export default function NotificationItem({ notification, onRead }) {
    const Icon = icons[notification.type] || Info;
    const colorClass = colors[notification.type] || colors.info;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => onRead(notification.id)}
            className={`group relative flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all duration-300
        ${!notification.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
        >
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon size={20} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm truncate transition-colors ${!notification.read ? 'font-bold text-gray-900 dark:text-gray-100' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
                        <Clock size={10} />
                        {notification.time}
                    </span>
                </div>
                <p className={`text-xs line-clamp-2 leading-relaxed ${!notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'}`}>
                    {notification.text}
                </p>
            </div>

            {!notification.read && (
                <div className="absolute right-2 top-11">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
            )}
        </motion.div>
    );
}
