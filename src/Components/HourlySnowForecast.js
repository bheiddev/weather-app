import React, { useEffect, useState } from 'react';
import './HourlySnowForecast.css';

const HourlySnowForecast = ({ weatherData }) => {
  const [snowForecast, setSnowForecast] = useState([]);

  useEffect(() => {
    if (!weatherData?.hourly) {
      console.log('No hourly data available:', { hasWeatherData: !!weatherData });
      return;
    }

    try {
      const now = new Date();
      const forecast = weatherData.hourly
        .slice(0, 24)
        .map((hour, index) => {
          const forecastTime = new Date(now.getTime());
          forecastTime.setHours(forecastTime.getHours() + index);

          const snowAccumulationCm = hour.values?.snowAccumulation || 0;
          const snowAccumulationInches = snowAccumulationCm * 0.393701;

          return {
            timestamp: forecastTime,
            snowAccumulation: snowAccumulationInches,
          };
        });

      setSnowForecast(forecast);
    } catch (error) {
      console.error('Error processing snow forecast data:', error);
      setSnowForecast([]);
    }
  }, [weatherData]);

  if (!weatherData?.hourly) {
    return null;
  }

  const formatDateTime = (date) => {
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
    <div className="snow-forecast-container">
      <h2 className="snow-forecast-title">
        Hourly Snow Accumulation (Next 24 Hours)
      </h2>
      {snowForecast.length > 0 ? (
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