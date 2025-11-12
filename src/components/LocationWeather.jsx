import React from 'react';
import { useLocation, useWeather } from '../hook.js';

export function LocationWeather() {
  const { location, error: locationError } = useLocation();

  // location?.latitude might be undefined
  console.log('Location info:', location);

  const latitude = location?.latitude;
  const longitude = location?.longitude;

  const { allWeather, error: weatherError } = useWeather(latitude, longitude);
  console.log('Weather info:', allWeather);

  // handle loading/error states first
  if (locationError) return <div>Failed to load location.</div>;
  if (!location) return <div>Loading location...</div>;

  if (weatherError) return <div>Failed to load weather.</div>;
  if (!allWeather) return <div>Loading weather...</div>;

  const city = allWeather.location.name
  const region = allWeather.location.region

  const tempC = allWeather.current.temp_c + '°C';
  const tempF = allWeather.current.temp_f + '°F';
  const temp = tempC ? tempC : tempF  // TODO: change condition for settings options
  
  const conditionText = allWeather.current.condition.text;
  const isDay = allWeather.current.is_day === 1;

  if (isDay) {
    document.body.style.backgroundColor = '#87CEEB'; // light blue for day; TODO: change for day theme
  } else {
    document.body.style.backgroundColor = '#2c3e50'; // dark blue for night; TODO: change for night theme
  }

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
