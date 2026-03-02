import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
    persist(
        (set) => ({
            theme: 'light', // 'light' or 'dark'
            language: 'en', // 'en' or 'hi'
            notifications: [
                {
                    id: 1,
                    type: 'booking',
                    title: 'Booking Confirmed',
                    text: 'Your stay at Luxury Oceanview Villa is confirmed for March 15th.',
                    read: false,
                    time: '2 min ago',
                    icon: 'CheckCircle'
                },
                {
                    id: 2,
                    type: 'payment',
                    title: 'Payment Received',
                    text: 'We received your payment of ₹45,000 for Downtown Apartment.',
                    read: false,
                    time: '15 min ago',
                    icon: 'CreditCard'
                },
                {
                    id: 3,
                    type: 'review',
                    title: 'New Review',
                    text: 'A guest left a 5-star review for your Cozy Studio Near Metro.',
                    read: false,
                    time: '1 hour ago',
                    icon: 'Star'
                },
                {
                    id: 4,
                    type: 'admin',
                    title: 'System Update',
                    text: 'HomeHive has been updated with new security features.',
                    read: true,
                    time: '1 day ago',
                    icon: 'Shield'
                },
                {
                    id: 5,
                    type: 'message',
                    title: 'New Message',
                    text: 'Property owner of Hilltop Manor replied to your inquiry.',
                    read: false,
                    time: '2 hours ago',
                    icon: 'MessageSquare'
                },
                {
                    id: 6,
                    type: 'payment',
                    title: 'Refund Processed',
                    text: 'Refund of ₹5,000 for canceled booking at City Loft has been initiated.',
                    read: true,
                    time: '3 hours ago',
                    icon: 'CreditCard'
                },
                {
                    id: 7,
                    type: 'admin',
                    title: 'Verification Complete',
                    text: 'Your profile has been verified. You can now book premium properties.',
                    read: false,
                    time: '5 hours ago',
                    icon: 'Shield'
                },
            ],
            notificationFilter: 'all',
            notificationSettings: {
                push: true,
                email: true,
                bookings: true,
                messages: true,
                dnd: false
            },
            isAuthenticated: false, // mock auth state
            user: { name: 'Aryan Sharma', role: 'renter' }, // mock user profile
            ownerProperties: [], // properties added by owner
            savedPropertyIds: [], // newly added for wishlist

            // Messaging State
            isChatOpen: false,
            isTyping: false,
            activeChatPartner: null, // { id, name, role, avatar }
            messages: [
                { id: 1, sender: 'owner', text: 'Hi Aryan, the apartment is available for viewing tomorrow.', time: '10:30 AM' },
                { id: 2, sender: 'renter', text: 'Great! What time works best for you?', time: '10:35 AM' },
                { id: 3, sender: 'owner', text: 'How about 11 AM?', time: '10:40 AM' },
            ],

            login: (userData) => set({ isAuthenticated: true, user: userData }),
            logout: () => set({ isAuthenticated: false, user: null }),

            // Messaging Actions
            toggleChat: (partner = null) => set((state) => ({
                isChatOpen: partner ? true : !state.isChatOpen,
                activeChatPartner: partner || state.activeChatPartner
            })),

            sendMessage: (text) => {
                // 1. Send user message
                set((state) => ({
                    messages: [...state.messages, {
                        id: Date.now(),
                        sender: 'renter',
                        text,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }],
                    isTyping: true
                }));

                // 2. Trigger AI Reply after a delay
                setTimeout(() => {
                    const lowercaseText = text.toLowerCase();
                    let reply = "That sounds good! Let me check the details and get back to you shortly.";

                    if (lowercaseText.includes('price') || lowercaseText.includes('rent') || lowercaseText.includes('cost')) {
                        reply = "The current rent is non-negotiable, but it includes maintenance and water charges. Are you comfortable with that?";
                    } else if (lowercaseText.includes('visit') || lowercaseText.includes('see') || lowercaseText.includes('view')) {
                        reply = "Sure! I'm available this weekend between 10 AM and 4 PM. When would you like to drop by?";
                    } else if (lowercaseText.includes('available') || lowercaseText.includes('vacant')) {
                        reply = "Yes, the property is available for immediate move-in after a quick document verification.";
                    } else if (lowercaseText.includes('hello') || lowercaseText.includes('hi')) {
                        reply = "Hello! How can I help you regarding my property today?";
                    }

                    set((state) => ({
                        isTyping: false,
                        messages: [...state.messages, {
                            id: Date.now() + 1,
                            sender: 'owner',
                            text: reply,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]
                    }));
                }, 2000);
            },

            addOwnerProperty: (property) => set((state) => ({
                ownerProperties: [...state.ownerProperties, property]
            })),

            toggleSaveProperty: (id) => set((state) => {
                const isSaved = state.savedPropertyIds.includes(id);
                return {
                    savedPropertyIds: isSaved
                        ? state.savedPropertyIds.filter(pid => pid !== id)
                        : [...state.savedPropertyIds, id]
                };
            }),

            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                return { theme: newTheme };
            }),

            setLanguage: (lang) => set({ language: lang }),

            setNotificationFilter: (filter) => set({ notificationFilter: filter }),
            updateNotificationSettings: (newSettings) => set((state) => ({
                notificationSettings: { ...state.notificationSettings, ...newSettings }
            })),

            addNotification: (notification) => set((state) => {
                // Respect Settings
                if (state.notificationSettings.dnd) return state;
                if (!state.notificationSettings.bookings && notification.type === 'booking') return state;
                if (!state.notificationSettings.messages && notification.type === 'message') return state;

                const newNotification = {
                    id: Date.now(),
                    read: false,
                    time: 'Just now',
                    ...notification
                };
                return { notifications: [newNotification, ...state.notifications] };
            }),

            markNotificationRead: (id) => set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                )
            })),

            clearNotifications: () => set({ notifications: [] }),

            unreadNotificationsCount: () => {
                // We evaluate this in the component
                return 0; // handled via selector typically
            }
        }),
        {
            name: 'house-rent-preferences', // unique name
            partialize: (state) => ({
                theme: state.theme,
                language: state.language,
                savedPropertyIds: state.savedPropertyIds
            }), // only persist these
        }
    )
);

// Helper to initialize theme on app load
export const initTheme = () => {
    const state = useAppStore.getState();
    if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

export default useAppStore;
