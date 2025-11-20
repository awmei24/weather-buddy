import { useLocation, useWeather } from '../hook.js';
import React, { useEffect } from 'react';
import { 
  InfoLeft, 
  InfoRight, 
  Location, 
  Condition, 
  Temperature 
} from '../styles.js'

export function LocationWeather({ lat: propLat, lon: propLon, onDayChange, isCelsius }) {
  const { location, error: locationError } = useLocation();
  const latitude = propLat ?? location?.latitude;
  const longitude = propLon ?? location?.longitude;
  const { allWeather, error: weatherError } = useWeather(latitude, longitude);

  const isDay = allWeather?.current?.is_day === 1;

  useEffect(() => {
    if (typeof isDay === 'boolean' && onDayChange) {
      onDayChange(isDay);
    }

    // Update body theme class too
    if (isDay) {
      document.body.classList.remove('night');
    } else {
      document.body.classList.add('night');
    }
  }, [isDay, onDayChange]);

  if (locationError) return <div>Failed to load location.</div>;
  if (!location) return <div>Loading location...</div>;
  if (weatherError) return <div>Failed to load weather.</div>;
  if (!allWeather) return <div>Loading weather...</div>;

  const city = allWeather.location.name;
  const region = allWeather.location.region;

  const tempC = allWeather.current.temp_c;
  const tempF = allWeather.current.temp_f;
  const temp = isCelsius ? tempC : tempF;
  const tempType = isCelsius ? '°C' : '°F';
  
  const conditionText = allWeather.current.condition.text;

  return (
    <>
      <InfoLeft>
        <Location>
          {city}, {region}
        </Location>
        <Condition>
          {conditionText}
        </Condition>
      </InfoLeft>
      <InfoRight>
        <Temperature>
          {temp}
        </Temperature>
        <div className='temp-type'>
          {tempType}
        </div>
      </InfoRight>
    </>
  );
}
