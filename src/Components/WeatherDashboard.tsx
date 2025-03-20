import React, { useState } from 'react';
import WeatherCard from './WeatherCard.tsx';
import { WeatherData, LocationWeather } from '../types/weather';
import { colors } from '../utils/colors.ts';
import './WeatherDashboard.scss';

interface Location {
  name: string;
  data: LocationWeather;
  coordinates: [number, number];
  color: string;
}

interface WeatherDashboardProps {
  weatherData: WeatherData | null;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ weatherData }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleToggleDetails = (location: string) => {
    setSelectedLocation(selectedLocation === location ? null : location);
  };

  if (!weatherData) {
    return <div className="weather-dashboard">Loading weather data...</div>;
  }

  const locations: Location[] = [
    {
      name: 'Breckenridge',
      data: weatherData.breckenridge,
      coordinates: [39.4817, -106.0384],
      color: colors.lightPurple
    },
    {
      name: 'Aspen',
      data: weatherData.aspen,
      coordinates: [39.1911, -106.8175],
      color: colors.Purple
    },
    {
      name: 'Vail',
      data: weatherData.vail,
      coordinates: [39.6403, -106.3742],
      color: colors.lightPurple
    },
    {
      name: 'Crested Butte',
      data: weatherData.crestedButte,
      coordinates: [38.8697, -106.9878],
      color: colors.Purple
    },
    {
      name: 'Telluride',
      data: weatherData.telluride,
      coordinates: [37.9375, -107.8123],
      color: colors.lightPurple
    },
    {
      name: 'Beaver Creek',
      data: weatherData.beaverCreek,
      coordinates: [39.6042, -106.5165],
      color: colors.Purple
    }
  ];

  return (
    <div className="weather-dashboard">
      {locations.map((loc) => (
        <WeatherCard
          key={loc.name}
          location={loc.name}
          weatherData={loc.data}
          onToggleDetails={() => handleToggleDetails(loc.name)}
          isExpanded={selectedLocation === loc.name}
          coordinates={loc.coordinates}
          color={loc.color}
        />
      ))}
    </div>
  );
};

export default WeatherDashboard;