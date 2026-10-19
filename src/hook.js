import { useState, useEffect, useCallback } from 'react';

// Where the weather proxy lives. Empty means same origin (local dev and the Vercel
// deployment); the GitHub Pages build sets VITE_API_BASE to the Vercel URL.
const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');

// useState that is saved to localStorage, so it survives reloads
export function useStoredState(key, getDefault) {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            if (stored !== null) return JSON.parse(stored);
        } catch {
            // Storage unavailable (e.g. private mode) or bad data; use the default
        }
        return getDefault();
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Storage unavailable; the setting just won't persist
        }
    }, [key, value]);

    return [value, setValue];
}

export function useTime() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return time;
}

export function useLocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [attempt, setAttempt] = useState(0);

    const retry = useCallback(() => setAttempt((n) => n + 1), []);

    useEffect(() => {
        setError(null);

        async function fetchLocation() {
            try {
                const res = await fetch('https://free.freeipapi.com/api/json/');
                const data = await res.json();
                if (!res.ok || data.latitude == null || data.longitude == null) {
                    throw new Error(`Location lookup failed (${res.status})`);
                }
                setLocation(data);
            } catch (err) {
                setError(err);
                console.error('Location error:', err);
            }
        }
        fetchLocation();
    }, [attempt]);

    return { location, error, retry };
}

export function useWeather(latitude, longitude) {
    const [allWeather, setAllWeather] = useState(null);
    const [error, setError] = useState(null);
    const [attempt, setAttempt] = useState(0);

    const retry = useCallback(() => setAttempt((n) => n + 1), []);

    useEffect(() => {
        if (latitude == null || longitude == null) return;
        setError(null);

        // Abort the previous request if the location changes mid-flight
        const controller = new AbortController();

        async function fetchAllWeather() {
            try {
                const query = `${API_BASE}/api/current?q=${encodeURIComponent(`${latitude},${longitude}`)}`;

                const res = await fetch(query, { signal: controller.signal });
                const data = await res.json();
                if (!res.ok || data.error) {
                    throw new Error(data.error?.message ?? `Weather request failed (${res.status})`);
                }
                setAllWeather(data);
                setError(null);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError(err);
                console.error('Weather error:', err);
            }
        }

        fetchAllWeather();
        return () => controller.abort();
    }, [latitude, longitude, attempt]);

    return { allWeather, error, retry };
}

export function useAutocomplete(query) {
    // Remember which query the results belong to, so stale results are never
    // mistaken for the current query's results
    const [result, setResult] = useState({ query: '', suggestions: [], error: null });

    useEffect(() => {
        if (!query) return;

        const controller = new AbortController();

        // Debounce so we only search once the user pauses typing
        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
                const data = await res.json();
                if (!res.ok || !Array.isArray(data)) {
                    throw new Error(data.error?.message ?? `Search failed (${res.status})`);
                }
                setResult({ query, suggestions: data, error: null });
            } catch (err) {
                if (err.name === 'AbortError') return;
                setResult({ query, suggestions: [], error: err });
                console.error('Autocomplete error:', err);
            }
        }, 250);

        // Cancel the pending search and any in-flight request when the query changes
        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [query]);

    const loading = Boolean(query) && result.query !== query;

    return {
        suggestions: query ? result.suggestions : [],
        error: loading ? null : result.error,
        loading,
    };
}