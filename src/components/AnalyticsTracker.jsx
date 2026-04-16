'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const lastTrackedPath = useRef(null);

    useEffect(() => {
        // Debounce or check uniqueness to prevent double-firing in React Strict Mode
        if (lastTrackedPath.current === pathname) return;

        // Ignore api routes or admin dashboards to keep data clean?
        // User asked for "all analytics for all pages", so we probably track everything 
        // but maybe flag them differently. For now, track all.

        const trackPage = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: pathname })
                });
                lastTrackedPath.current = pathname;
            } catch (error) {
                // Silent fail
            }
        };

        trackPage();
    }, [pathname]);

    return null;
}
