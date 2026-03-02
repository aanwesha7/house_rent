import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    X,
    Minimize2,
    User,
    MoreVertical,
    Phone,
    Video,
    Smile,
    Paperclip
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function ChatWindow() {
    const { isChatOpen, toggleChat, activeChatPartner, messages, sendMessage, user, isTyping } = useAppStore();
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isChatOpen, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            sendMessage(inputText);
            setInputText('');
        }
    };

    if (!isChatOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-[60] w-full max-w-[400px] h-[500px] bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center border-2 border-white/20">
                                <User size={20} />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm leading-tight">
                                {activeChatPartner?.name || 'Property Owner'}
                            </h4>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider font-bold">
                                    Owner
                                </span>
                                <span className="text-[10px] opacity-80 italic">
                                    {isTyping ? 'Typing...' : 'Active now'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Phone size={18} />
                        </button>
                        <button onClick={() => toggleChat()} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50 custom-scrollbar"
                >
                    {messages.map((msg) => {
                        const isMe = msg.sender === 'renter';
                        return (
                            <motion.div
                                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-sm relative group
                  ${isMe
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700'}`}
                                >
                                    <p>{msg.text}</p>
                                    <span className={`text-[10px] mt-1 block opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-xl p-1.5">
                        <button type="button" className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 dark:text-white"
                        />
                        <button type="button" className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <Smile size={20} />
                        </button>
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-blue-500/30"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
    );
}
