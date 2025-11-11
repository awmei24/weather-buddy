import { useLocation, useWeather } from '../hook.js';

export function LocationWeather() {
  const location = useLocation();
  const weather = useWeather();
  const temperature = '74°F';

  return (
    <>
      <div>
        <div>
            {location}
        </div>
        <div>
            {weather}
        </div>
      </div>
      <div>
        {temperature}
      </div>
    </>
  )
}