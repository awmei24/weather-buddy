import { useState, useEffect } from 'react';

const WEATHER_API_KEY =
    import.meta.env.VITE_WEATHER_API_KEY;

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

    useEffect(() => {
        async function fetchLocation() {
            try {
                const res = await fetch('https://free.freeipapi.com/api/json/');
                const data = await res.json();
                setLocation(data);
                console.log('Location data:', data);
            } catch (err) {
                setError(err);
                console.error('Location error:', err);
            }
        }
        fetchLocation();
    }, []);

    return { location, error };
}

export function useWeather(latitude, longitude) {
    const [allWeather, setAllWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!latitude || !longitude) return;

        async function fetchAllWeather() {
            try {
                const query = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}`;
                console.log('Weather query:', query);

                const res = await fetch(query);
                const data = await res.json();
                setAllWeather(data);
            } catch (err) {
                setError(err);
                console.error('Weather error:', err);
            }
        }

        fetchAllWeather();
    }, [latitude, longitude]);

    console.log('Weather state:', allWeather, error);

    return { allWeather, error };
}