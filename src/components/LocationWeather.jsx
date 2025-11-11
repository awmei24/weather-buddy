import React from 'react';
import { useLocation, useWeather } from '../hook.js';

export function LocationWeather() {
  const { location, error: locationError } = useLocation();

  // location?.latitude might be undefined depending on API shape — log to check
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

  const tempC = allWeather.current.temp_c;
  const tempF = allWeather.current.temp_f;
  const conditionText = allWeather.current.condition.text;
  const isDay = allWeather.current.is_day === 1;

  if (isDay) {
    document.body.style.backgroundColor = '#87CEEB'; // light blue for day
  } else {
    document.body.style.backgroundColor = '#2c3e50'; // dark blue for night
  }

  return (
    <>
      <div>
        <p>
          {location.city}, {location.region}, {location.country}
        </p>
        <p>Temperature (C): {tempC}°C</p>
        <p>Temperature (F): {tempF}°F</p>
        <p>Condition: {conditionText}</p>
      </div>
    </>
  );
}
