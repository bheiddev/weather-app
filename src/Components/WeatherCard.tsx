import React from 'react';
import HourlySnowForecast from './HourlySnowForecast.tsx';
import { getContrastColor } from '../utils/colors.ts';
import { LocationWeather } from '../types/weather.ts';
import './WeatherCard.css';
import { calculateDailySnowfall } from '../utils/calculations.ts';

interface WeatherCardProps {
  location: string;
  weatherData: LocationWeather;
  isExpanded: boolean;
  onToggleDetails: () => void;
  coordinates: [number, number];
  color: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  weatherData,
  isExpanded,
  onToggleDetails,
  color
}) => {
  const contrastColor = getContrastColor(color);
  const today = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const dailySnowTotals = calculateDailySnowfall(weatherData.hourly);

  if (!weatherData) {
    return (
      <div className="loading-card">
        <h2 className="weather-card-title">{location}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div 
      className="weather-card" 
      onClick={onToggleDetails}
      style={{ backgroundColor: color }}
    >
      <h2 className="weather-card-title">{location}</h2>
      <div className="weather-card-content">
        {weatherData.daily && weatherData.daily[0] && (
          <>
            <p className="weather-info">
              Average Daily Temperature:{' '}
              {(weatherData.daily[0].temperatureAvg * 9/5 + 32).toFixed(1)} °F
            </p>
            <p className="weather-info">
              Min: {(weatherData.daily[0].temperatureMin * 9/5 + 32).toFixed(1)} °F |
              Max: {(weatherData.daily[0].temperatureMax * 9/5 + 32).toFixed(1)} °F
            </p>
            <p className="weather-info">
              Next 24hr Snow Forecast: {dailySnowTotals[0].toFixed(1)} inches
            </p>
          </>
        )}

        <div className={`expanded-content ${isExpanded ? 'visible' : 'hidden'}`}>
          <div className="forecast-section">
            <div className="forecast-grid" style={{ backgroundColor: contrastColor }}>
              <div>
                <h3 className="forecast-title">6-Day Forecast:</h3>
                <ul className="forecast-list">
                  {weatherData.daily?.map((day, index) => {
                    const date = new Date(today);
                    date.setDate(today.getDate() + index);
                    const dayName = daysOfWeek[date.getDay()];
                    return (
                      <li key={index} className="forecast-item">
                        {dayName}: Min: {(day.temperatureMin * 9/5 + 32).toFixed(1)}°F -
                        Max: {(day.temperatureMax * 9/5 + 32).toFixed(1)}°F
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <h3 className="forecast-title">6-Day Snowfall</h3>
                <ul className="forecast-list">
                  {dailySnowTotals.map((snowfall, index) => {
                    const date = new Date(today);
                    date.setDate(today.getDate() + index);
                    const dayName = daysOfWeek[date.getDay()];
                    return (
                      <li key={index} className="forecast-item">
                        {dayName}: {snowfall.toFixed(1)} inches
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            {isExpanded && (
              <HourlySnowForecast 
                weatherData={weatherData} 
                isLoading={false} 
                color={color}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;