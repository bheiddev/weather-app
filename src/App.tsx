import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = 3, backoff = 1000): Promise<any> => {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    if (retries === 0) throw error;
    
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 429) {
      // If we hit rate limit, wait longer
      await delay(backoff);
      return fetchWithRetry(url, retries - 1, backoff * 2);
    }
    throw error;
  }
};

const fetchAndCacheWeatherData = async (location: string): Promise<ProcessedData | null> => {
  const cacheKey = `weatherData-${location}`;
  const cacheExpiryKey = `${cacheKey}-expiry`;
  const cacheExpiryTime = 1000 * 60 * 60 * 24; // 24 hours
  const cachedData = localStorage.getItem(cacheKey);
  const cachedExpiry = localStorage.getItem(cacheExpiryKey);

  console.log(`Checking cache for ${location}:`, {
    hasCachedData: !!cachedData,
    hasExpiry: !!cachedExpiry,
    currentTime: Date.now(),
    expiryTime: cachedExpiry ? parseInt(cachedExpiry, 10) : null,
    isExpired: cachedExpiry ? Date.now() >= parseInt(cachedExpiry, 10) : true
  });

  if (cachedData && cachedExpiry && Date.now() < parseInt(cachedExpiry, 10)) {
    console.log(`Using cached data for ${location}`);
    return JSON.parse(cachedData);
  }

  console.log(`Fetching fresh data for ${location}`);
  const apiKey = 'I8PyaiKQQ7PBckcZI4ET9wsmRYBJbWmv';
  const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${location}&apikey=${apiKey}`;

  try {
    const response = await fetchWithRetry(apiUrl);

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
      console.log(`Cached new data for ${location}`);

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
        // Fetch locations sequentially with delay between each
        const locations = [
          { name: 'breckenridge', coords: '39.4817,-106.0384' },
          { name: 'aspen', coords: '39.1911,-106.8175' },
          { name: 'vail', coords: '39.6403,-106.3742' },
          { name: 'crestedButte', coords: '38.8697,-106.9878' },
          { name: 'telluride', coords: '37.9375,-107.8123' },
          { name: 'beaverCreek', coords: '39.6042,-106.5165' }
        ] as const;

        const results: Partial<WeatherData> = {};
        
        for (const location of locations) {
          const data = await fetchAndCacheWeatherData(location.coords);
          if (data) {
            results[location.name] = data;
          }
          // Add delay between requests to avoid rate limiting
          await delay(1000);
        }

        if (Object.values(results).every(data => data !== undefined)) {
          setWeatherData(results as WeatherData);
        } else {
          setError('Failed to fetch data for some locations');
        }
      } catch (err) {
        console.error('Weather data update failed:', err);
        setError('Unable to fetch weather data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    updateWeatherData();
    // Update every 30 minutes instead of every hour to reduce API calls
    const interval = setInterval(updateWeatherData, 30 * 60 * 1000);

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