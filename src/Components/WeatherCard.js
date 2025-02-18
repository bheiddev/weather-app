import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import HourlySnowForecast from './HourlySnowForecast';
import './WeatherCard.css';

const customMarkerIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const WeatherCard = ({ location, weatherData, isExpanded, onToggleDetails }) => {
  const today = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (!weatherData) {
    return (
      <div className="loading-card">
        <h2 className="weather-card-title">{location}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="weather-card" onClick={onToggleDetails}>
      <h2 className="weather-card-title">{location}</h2>
      <div className="weather-card-content">
        {weatherData.daily && weatherData.daily[0] && (
          <>
            <p className="weather-info">
              Average Daily Temperature: {(weatherData.daily[0].temperatureAvg * 9 / 5 + 32).toFixed(1)} °F
            </p>
            <p className="weather-info">
              Min: {(weatherData.daily[0].temperatureMin * 9 / 5 + 32).toFixed(1)} °F | 
              Max: {(weatherData.daily[0].temperatureMax * 9 / 5 + 32).toFixed(1)} °F
            </p>
          </>
        )}

        <div className={`expanded-content ${isExpanded ? 'visible' : 'hidden'}`}>
          <div className="forecast-section">
            <div className="forecast-grid">
              <div>
                <h3 className="forecast-title">7-Day Forecast:</h3>
                <ul className="forecast-list">
                  {weatherData.daily?.map((day, index) => {
                    const date = new Date(today);
                    date.setDate(today.getDate() + index);
                    const dayName = daysOfWeek[date.getDay()];
                    return (
                      <li key={index} className="forecast-item">
                        {dayName}: Min: {(day.temperatureMin * 9 / 5 + 32).toFixed(1)}°F - 
                        Max: {(day.temperatureMax * 9 / 5 + 32).toFixed(1)}°F
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            {isExpanded && (
              <HourlySnowForecast weatherData={weatherData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;