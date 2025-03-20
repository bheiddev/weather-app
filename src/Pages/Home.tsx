import React from 'react';
import WeatherDashboard from '../Components/WeatherDashboard.tsx';
import { WeatherData } from '../types/weather';
import './Home.scss';

interface HomeProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error?: string | null;
}

const Home: React.FC<HomeProps> = ({ weatherData, isLoading, error }) => {
  console.log('Weather data in Home:', weatherData);

  if (isLoading) {
    return (
      <div className="home-container">
        <h1 className="home-title">Colorado Weather Forecast</h1>
        <div>Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <h1 className="home-title">Colorado Weather Forecast</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Colorado Weather Forecast</h1>
      <WeatherDashboard weatherData={weatherData} />
    </div>
  );
};

export default Home;