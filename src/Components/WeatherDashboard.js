import React, { useState } from 'react';
import WeatherCard from './WeatherCard';
import HourlySnowForecast from './HourlySnowForecast';
import 'leaflet/dist/leaflet.css';
import './WeatherDashboard.css';

const WeatherDashboard = ({ weatherData }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleToggleDetails = (location) => {
    setSelectedLocation(selectedLocation === location ? null : location);
  };

  const locations = [
    { 
      name: 'Breckenridge', 
      data: weatherData.breckenridge, 
      coordinates: [39.4817, -106.0384] 
    },
    { 
      name: 'Aspen', 
      data: weatherData.aspen, 
      coordinates: [39.1911, -106.8175] 
    },
    { 
      name: 'Vail', 
      data: weatherData.vail, 
      coordinates: [39.6403, -106.3742] 
    },
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
        />
      ))}
    </div>
  );
};

export default WeatherDashboard;