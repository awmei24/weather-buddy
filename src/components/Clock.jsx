import React from 'react'; 
import { useTime } from '../hook.js';

export default function Clock(timeFormat = '12hr') {
    const time = useTime();
}