import { useEffect, useRef, useState } from 'react';

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks = [];

function loadTurnstileScript() {
    return new Promise((resolve) => {
        if (scriptLoaded) return resolve();
        loadCallbacks.push(resolve);
        if (scriptLoading) return;
        scriptLoading = true;

        const script = document.createElement('script');
        script.src = TURNSTILE_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            scriptLoaded = true;
            loadCallbacks.forEach((cb) => cb());
            loadCallbacks.length = 0;
        };
        document.head.appendChild(script);
    });
}

export default function TurnstileWidget({ onVerify, onExpire, onError }) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        loadTurnstileScript().then(() => setReady(true));
    }, []);

    useEffect(() => {
        if (!ready || !containerRef.current || !window.turnstile) return;

        // Clean up previous widget if exists
        if (widgetIdRef.current !== null) {
            try { window.turnstile.remove(widgetIdRef.current); } catch (_) { }
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: SITE_KEY,
            theme: 'dark',
            callback: (token) => onVerify?.(token),
            'expired-callback': () => onExpire?.(),
            'error-callback': () => onError?.(),
        });

        return () => {
            if (widgetIdRef.current !== null) {
                try { window.turnstile.remove(widgetIdRef.current); } catch (_) { }
                widgetIdRef.current = null;
            }
        };
    }, [ready]);

    // Expose reset via imperative handle
    useEffect(() => {
        TurnstileWidget.reset = () => {
            if (widgetIdRef.current !== null && window.turnstile) {
                window.turnstile.reset(widgetIdRef.current);
            }
        };
    }, [ready]);

    return (
        <div
            ref={containerRef}
            className="flex items-center justify-center"
            style={{ minHeight: 65 }}
        />
    );
}
