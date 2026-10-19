import { useTime } from '../hook.js';

export function Clock({ timeFormat = '12hr', timeZone }) {
    const time = useTime();

    const options = {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: timeFormat === '12hr' ? true : false,
    };

    // Show the time where the displayed weather is; fall back to local time
    let formattedTime;
    try {
        formattedTime = time.toLocaleTimeString([], { ...options, timeZone });
    } catch {
        formattedTime = time.toLocaleTimeString([], options);
    }

    return <div>{formattedTime}</div>
}
