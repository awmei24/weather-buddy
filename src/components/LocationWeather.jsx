import { useLocation, useWeather } from '../hook.js';
import React, { useEffect } from 'react';

export function LocationWeather({ lat: propLat, lon: propLon }) {
  const { location, error: locationError } = useLocation();
  const latitude = propLat ?? location?.latitude;
  const longitude = propLon ?? location?.longitude;
  const { allWeather, error: weatherError } = useWeather(latitude, longitude);

  const isDay = allWeather?.current?.is_day === 1;

  useEffect(() => {
    if (isDay) {
      document.body.classList.remove('night');
    } else {
      document.body.classList.add('night');
    }
  }, [isDay]);

  if (locationError) return <div>Failed to load location.</div>;
  if (!location) return <div>Loading location...</div>;
  if (weatherError) return <div>Failed to load weather.</div>;
  if (!allWeather) return <div>Loading weather...</div>;

  const city = allWeather.location.name;
  const region = allWeather.location.region;
  const tempC = allWeather.current.temp_c + '°C';
  const tempF = allWeather.current.temp_f + '°F';
  const temp = tempC ? tempC : tempF;
  const conditionText = allWeather.current.condition.text;

  return (
    <>
      <div className='info-left'>
        <div className='location'>
          {city}, {region}
        </div>
        <div className='condition'>
          Condition: {conditionText}
        </div>
      </div>
      <div className='info-right'>
        <div className='temperature'>
          Temperature: {temp}
        </div>
      </div>
    </>
  );
}
