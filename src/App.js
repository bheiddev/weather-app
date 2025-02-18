import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';

const fetchAndCacheWeatherData = async (location) => {
  const cacheKey = `weatherData-${location}`;
  const cacheExpiryKey = `${cacheKey}-expiry`;
  const cacheExpiryTime = 1000 * 60 * 60; 
  const cachedData = localStorage.getItem(cacheKey);
  const cachedExpiry = localStorage.getItem(cacheExpiryKey);

  console.log('Cache check for location:', location);
  console.log('Cached data exists:', !!cachedData);
  console.log('Cache expiry exists:', !!cachedExpiry);
  console.log('Current time:', Date.now());
  console.log('Cache expiry time:', cachedExpiry);

  if (cachedData && cachedExpiry && Date.now() < parseInt(cachedExpiry, 10)) {
    const parsedData = JSON.parse(cachedData);
    console.log('Cache hit for location:', location);
    console.log('Cached data structure:', {
      hasDaily: !!parsedData.daily,
      hasHourly: !!parsedData.hourly,
      dailyLength: parsedData.daily?.length,
      hourlyLength: parsedData.hourly?.length
    });
    return parsedData;
  }

  const apiKey = 'I8PyaiKQQ7PBckcZI4ET9wsmRYBJbWmv'; 
  const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${location}&apikey=${apiKey}`;

  try {
    console.log('Fetching fresh data for location:', location);
    const response = await axios.get(apiUrl);
    console.log('Full API Response for', location, response.data);
    console.log('API Response structure:', {
      hasTimelines: !!response.data.timelines,
      hasDaily: !!response.data.timelines?.daily,
      hasHourly: !!response.data.timelines?.hourly,
      dailyLength: response.data.timelines?.daily?.length,
      hourlyType: typeof response.data.timelines?.hourly,
      hourlyIsArray: Array.isArray(response.data.timelines?.hourly),
      hourlyLength: response.data.timelines?.hourly?.length
    });

    if (response.data.timelines && response.data.timelines.daily) {
      const dailyData = response.data.timelines.daily;
      const hourlyData = response.data.timelines.hourly;

      const processedData = {
        daily: dailyData.map((day) => ({
          temperatureAvg: day.values.temperatureAvg,
          temperatureMin: day.values.temperatureMin,
          temperatureMax: day.values.temperatureMax,
        })),
        hourly: hourlyData
      };

      console.log('Processed data structure before caching:', {
        hasDaily: !!processedData.daily,
        hasHourly: !!processedData.hourly,
        dailyLength: processedData.daily?.length,
        hourlyLength: processedData.hourly?.length
      });

      localStorage.setItem(cacheKey, JSON.stringify(processedData));
      localStorage.setItem(cacheExpiryKey, Date.now() + cacheExpiryTime);

      // Verify what was actually cached
      const verifyCache = JSON.parse(localStorage.getItem(cacheKey));
      console.log('Verified cached data for', location, {
        hasDaily: !!verifyCache.daily,
        hasHourly: !!verifyCache.hourly,
        dailyLength: verifyCache.daily?.length,
        hourlyLength: verifyCache.hourly?.length
      });

      return processedData;
    }
  } catch (err) {
    console.error('Error fetching weather data:', {
      location,
      error: err.message,
      response: err.response?.data
    });
    return null;
  }
};

const App = () => {
  const [weatherData, setWeatherData] = useState({
    breckenridge: null,
    aspen: null,
    vail: null,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const updateWeatherData = async () => {
      try {
        console.log('Starting weather data update cycle');
        const breckenridgeData = await fetchAndCacheWeatherData('39.4817,-106.0384');
        const aspenData = await fetchAndCacheWeatherData('39.1911,-106.8175');
        const vailData = await fetchAndCacheWeatherData('39.6403,-106.3742');

        console.log('Final weather data structure:', {
          breckenridge: {
            hasDaily: !!breckenridgeData?.daily,
            hasHourly: !!breckenridgeData?.hourly,
            dailyLength: breckenridgeData?.daily?.length,
            hourlyLength: breckenridgeData?.hourly?.length
          },
          aspen: {
            hasDaily: !!aspenData?.daily,
            hasHourly: !!aspenData?.hourly,
            dailyLength: aspenData?.daily?.length,
            hourlyLength: aspenData?.hourly?.length
          },
          vail: {
            hasDaily: !!vailData?.daily,
            hasHourly: !!vailData?.hourly,
            dailyLength: vailData?.daily?.length,
            hourlyLength: vailData?.hourly?.length
          }
        });

        setWeatherData({
          breckenridge: breckenridgeData,
          aspen: aspenData,
          vail: vailData,
        });

        console.log('Breckenridge Hourly Data:', breckenridgeData?.hourly);
        console.log('Aspen Hourly Data:', aspenData?.hourly);
        console.log('Vail Hourly Data:', vailData?.hourly);

      } catch (err) {
        console.error('Weather data update failed:', err);
        setError('Unable to fetch weather data. Please try again later.');
      }
    };

    updateWeatherData();

    const interval = setInterval(updateWeatherData, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home weatherData={weatherData} />} />
      </Routes>
    </Router>
  );
};

export default App;