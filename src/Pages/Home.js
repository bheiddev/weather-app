import React from 'react';
import WeatherDashboard from '../Components/WeatherDashboard';
import HourlySnowForecast from '../Components/HourlySnowForecast';
import './Home.css';  // Import the CSS file

const Home = ({ weatherData }) => {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Colorado Weather Forecast
      </h1>
      <WeatherDashboard weatherData={weatherData} />
      <HourlySnowForecast weatherData={weatherData} />
    </div>
  );
};

export default Home;