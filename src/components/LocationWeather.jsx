import { useLocation, useWeather } from '../hook.js';

export function LocationWeather() {
    const location = useLocation();
    const weather = useWeather();
}