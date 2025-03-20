import React, { useEffect, useState } from 'react';
import { getContrastColor } from '../utils/colors.ts';
import './HourlySnowForecast.scss';

interface HourlyData {
  time: string;
  values: {
    snowAccumulation: number;
  };
}

interface WeatherData {
  hourly: HourlyData[];
}

interface HourlySnowForecastProps {
  weatherData: WeatherData;
  isLoading: boolean;
  color: string; 
}

interface ForecastItem {
  timestamp: Date;
  snowAccumulation: number;
}

const HourlySnowForecast: React.FC<HourlySnowForecastProps> = ({ 
  weatherData, 
  isLoading,
  color 
}) => {
  const [snowForecast, setSnowForecast] = useState<ForecastItem[]>([]);
  const contrastColor = getContrastColor(color); // Get contrast color

  useEffect(() => {
    if (isLoading) return;

    if (!weatherData?.hourly || weatherData.hourly.length === 0) {
      console.log('No hourly data available:', { hasWeatherData: !!weatherData });
      return;
    }

    try {
      console.log('Weather data passed to hourlyforecast component', { weatherData });
      const forecast = weatherData.hourly.slice(0, 120).map((hour) => ({
        timestamp: new Date(hour.time),
        snowAccumulation: hour.values.snowAccumulation * 0.393701,
      }));

      setSnowForecast(forecast);
    } catch (error) {
      console.error('Error processing snow forecast data:', error);
      setSnowForecast([]);
    }
  }, [weatherData, isLoading]);

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div 
      className="snow-forecast-container"
      style={{ backgroundColor: contrastColor }} // Apply contrast color
    >
      <h2 className="snow-forecast-title">Hourly Snow Accumulation</h2>
      {isLoading ? (
        <p>Loading forecast data...</p>
      ) : snowForecast.length > 0 ? (
        <div className="snow-forecast-list">
          {snowForecast.map((forecast, index) => (
            <div key={index} className="snow-forecast-item">
              <span className="snow-forecast-timestamp">
                {formatDateTime(forecast.timestamp)}
              </span>
              <span className="snow-forecast-value">
                {forecast.snowAccumulation.toFixed(2)} inches
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data-message">No snow forecast data available</p>
      )}
    </div>
  );
};

export default HourlySnowForecast;