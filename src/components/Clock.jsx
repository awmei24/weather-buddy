import { useTime } from '../hook.js';

export function Clock({ timeFormat = '12hr' }) {
    const time = useTime();

    const formattedTime = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: timeFormat === '12hr' ? true : false,
    });

    return <div>{formattedTime}</div>
}