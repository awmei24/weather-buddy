import { useState, useEffect } from 'react';

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
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setLocation(data);
      } catch (err) {
        setError(err);
      }
    }
    fetchLocation();
  }, []);

  return { location, error };
}

export function useWeather(city) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = 'API_KEY';

  useEffect(() => {
    if (!city) return;

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError(err);
      }
    }

    fetchWeather();
  }, [city]);

  return { weather, error };
}