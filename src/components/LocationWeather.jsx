import { useLocation, useWeather } from '../hook.js';
import React, { useEffect } from 'react';
import {
  InfoLeft,
  InfoRight,
  Location,
  Condition,
  Temperature,
  TempUnit,
  Skeleton,
  InfoMessage,
  Hint,
  Button,
  TextButton,
  VisuallyHidden
} from '../styles.js'

function InfoSkeleton() {
  return (
    <>
      <InfoLeft aria-hidden='true' style={{ gap: 8 }}>
        <Skeleton $width='160px' />
        <Skeleton $width='220px' $height='28px' />
      </InfoLeft>
      <InfoRight aria-hidden='true'>
        <Skeleton $width='104px' $height='72px' />
      </InfoRight>
      <VisuallyHidden role='status'>Loading the weather</VisuallyHidden>
    </>
  );
}

function InfoError({ message, onRetry, children }) {
  return (
    <InfoMessage role='alert'>
      <InfoLeft>
        <Condition>{message}</Condition>
        <Hint>Check your connection, then try again.</Hint>
        {children}
      </InfoLeft>
      <Button type='button' onClick={onRetry}>Try again</Button>
    </InfoMessage>
  );
}

export function LocationWeather({
  lat: propLat,
  lon: propLon,
  onDayChange,
  onConditionChange,
  onTimeZoneChange,
  onUseMyLocation,
  isCelsius
}) {
  const { location, error: locationError, retry: retryLocation } = useLocation();
  const latitude = propLat ?? location?.latitude;
  const longitude = propLon ?? location?.longitude;
  const { allWeather, error: weatherError, retry: retryWeather } = useWeather(latitude, longitude);

  // null until weather has loaded, so the theme doesn't flip before we know
  const isDay = allWeather ? allWeather.current.is_day === 1 : null;
  const conditionCode = allWeather?.current?.condition?.code;
  const timeZone = allWeather?.location?.tz_id;

  useEffect(() => {
    if (isDay !== null && onDayChange) {
      onDayChange(isDay);
    }
  }, [isDay, onDayChange]);

  useEffect(() => {
    if (conditionCode != null && onConditionChange) {
      onConditionChange(conditionCode);
    }
  }, [conditionCode, onConditionChange]);

  useEffect(() => {
    if (timeZone && onTimeZoneChange) {
      onTimeZoneChange(timeZone);
    }
  }, [timeZone, onTimeZoneChange]);

  // Only wait on IP location when the user hasn't searched for a city
  const hasSearchedLocation = propLat != null && propLon != null;

  const myLocationButton = hasSearchedLocation && !locationError && onUseMyLocation && (
    <TextButton type='button' onClick={onUseMyLocation}>Use my location</TextButton>
  );

  if (!hasSearchedLocation) {
    if (locationError) {
      return (
        <InfoError message='Couldn’t find your location.' onRetry={retryLocation}>
          <Hint>Or search for a city above.</Hint>
        </InfoError>
      );
    }
    if (!location) return <InfoSkeleton />;
  }
  if (weatherError) {
    return (
      <InfoError message='Couldn’t load the weather.' onRetry={retryWeather}>
        {myLocationButton}
      </InfoError>
    );
  }
  if (!allWeather) return <InfoSkeleton />;

  const city = allWeather.location.name;
  const region = allWeather.location.region;
  // Skip the region when it's empty or repeats the city ("Tokyo, Tokyo")
  const placeName = region && region !== city ? `${city}, ${region}` : city;

  const temp = Math.round(isCelsius ? allWeather.current.temp_c : allWeather.current.temp_f);
  const tempType = isCelsius ? '°C' : '°F';
  const spokenTemp = `${temp} degrees ${isCelsius ? 'Celsius' : 'Fahrenheit'}`;

  const conditionText = allWeather.current.condition.text;

  return (
    <>
      <InfoLeft>
        <Location>
          {placeName}
        </Location>
        <Condition>
          {conditionText}
        </Condition>
        {myLocationButton}
      </InfoLeft>
      <InfoRight>
        {/* Read as one phrase ("58 degrees Fahrenheit") instead of "58", "°F" */}
        <Temperature aria-hidden='true'>
          {temp}
        </Temperature>
        <TempUnit aria-hidden='true'>
          {tempType}
        </TempUnit>
        <VisuallyHidden>{spokenTemp}</VisuallyHidden>
      </InfoRight>
    </>
  );
}
