import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import ChatWindow from './ChatWindow';

import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import useAppStore, { initTheme } from '../../store/useAppStore';

export default function Layout() {
    // Initialize keyboard shortcuts globally
    useKeyboardShortcuts();

    // Initialize theme
    React.useEffect(() => {
        initTheme();
    }, []);

    return (
        <div className="min-h-screen flex flex-col pt-[max(env(safe-area-inset-top),_0px)] pb-[max(env(safe-area-inset-bottom),_0px)]">
            <Header />
            <main className="flex-grow w-full">
                {/* Render child routes here */}
                <Outlet />
            </main>
            <Footer />
            <ScrollToTop />
            <ChatWindow />

        </div>
    );
}
