import React from 'react'; 
import { useLocation, useWeather } from '../hook.js';

export default function LocationWeather() {
    const location = useLocation();
    const weather = useWeather();
}