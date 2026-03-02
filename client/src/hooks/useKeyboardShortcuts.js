import { useEffect } from 'react';

export function useKeyboardShortcuts() {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Cmd/Ctrl + K for quick search (we'll just focus a search bar if it exists or trigger an event)
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('global-search');
                if (searchInput) {
                    searchInput.focus();
                } else {
                    // Dispatch a custom event to open a search modal if preferred
                    document.dispatchEvent(new CustomEvent('openQuickSearch'));
                }
            }

            // '/' for focusing search
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const searchInput = document.getElementById('global-search');
                if (searchInput) searchInput.focus();
            }

            // 'Escape' is usually handled by modals natively or we can trigger close modal event
            if (e.key === 'Escape') {
                document.dispatchEvent(new CustomEvent('closeModals'));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}
