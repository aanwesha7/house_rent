import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

export function Modal({ isOpen, onClose, title, children }) {
    // Listen for custom global close event
    useEffect(() => {
        const handleClose = () => onClose();
        document.addEventListener('closeModals', handleClose);
        return () => document.removeEventListener('closeModals', handleClose);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Blurred background overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal panel */}
            <div className="relative z-10 w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Modal content */}
                <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}
