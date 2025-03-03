import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.tsx';
import { WeatherData, LocationWeather } from './types/weather';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

interface ProcessedData {
  daily: Array<{
    temperatureAvg: number;
    temperatureMin: number;
    temperatureMax: number;
    snowAccumulation: number;
  }>;
  hourly: Array<{
    time: string;
    values: {
      snowAccumulation: number;
    };
  }>;
}

const fetchAndCacheWeatherData = async (location: string): Promise<ProcessedData | null> => {
  const cacheKey = `weatherData-${location}`;
  const cacheExpiryKey = `${cacheKey}-expiry`;
  const cacheExpiryTime = 1000 * 60 * 60; 
  const cachedData = localStorage.getItem(cacheKey);
  const cachedExpiry = localStorage.getItem(cacheExpiryKey);

  if (cachedData && cachedExpiry && Date.now() < parseInt(cachedExpiry, 10)) {
    return JSON.parse(cachedData);
  }

  const apiKey = 'I8PyaiKQQ7PBckcZI4ET9wsmRYBJbWmv';
  const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${location}&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data.timelines) {
      const processedData: ProcessedData = {
        daily: response.data.timelines.daily.map((day: any) => ({
          temperatureAvg: day.values.temperatureAvg,
          temperatureMin: day.values.temperatureMin,
          temperatureMax: day.values.temperatureMax,
          snowAccumulation: day.values.snowAccumulation || 0,
        })),
        hourly: response.data.timelines.hourly.map((hour: any) => ({
          time: hour.time,
          values: {
            snowAccumulation: hour.values.snowAccumulation || 0,
          }
        })),
      };

      localStorage.setItem(cacheKey, JSON.stringify(processedData));
      localStorage.setItem(cacheExpiryKey, (Date.now() + cacheExpiryTime).toString());

      return processedData;
    }
    return null;
  } catch (err) {
    console.error('Error fetching weather data:', {
      location,
      error: err instanceof Error ? err.message : 'Unknown error',
      response: axios.isAxiosError(err) ? err.response?.data : null,
    });
    return null;
  }
};

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateWeatherData = async () => {
      setIsLoading(true);
      try {
        const breckenridgeData = await fetchAndCacheWeatherData('39.4817,-106.0384');
        const aspenData = await fetchAndCacheWeatherData('39.1911,-106.8175');
        const vailData = await fetchAndCacheWeatherData('39.6403,-106.3742');
        const crestedButteData = await fetchAndCacheWeatherData('38.8697,-106.9878');
        const tellurideData = await fetchAndCacheWeatherData('37.9375,-107.8123');
        const beaverCreekData = await fetchAndCacheWeatherData('39.6042,-106.5165');

        if (breckenridgeData && aspenData && vailData && crestedButteData && tellurideData && beaverCreekData) {
          setWeatherData({
            breckenridge: breckenridgeData,
            aspen: aspenData,
            vail: vailData,
            crestedButte: crestedButteData,
            telluride: tellurideData,
            beaverCreek: beaverCreekData
          });
        } else {
          setError('Failed to fetch data for all locations');
        }
      } catch (err) {
        console.error('Weather data update failed:', err);
        setError('Unable to fetch weather data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    updateWeatherData();
    const interval = setInterval(updateWeatherData, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading && !weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                weatherData={weatherData}
                isLoading={isLoading}
                error={error}
              />
            }
          />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;