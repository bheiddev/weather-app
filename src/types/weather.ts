export interface DailyWeather {
    temperatureAvg: number;
    temperatureMin: number;
    temperatureMax: number;
  }
  
  export interface HourlyWeather {
    time: string;
    values: {
      snowAccumulation: number;
    };
  }
  
  export interface LocationWeather {
    daily: DailyWeather[];
    hourly: HourlyWeather[];
  }
  
  export interface WeatherData {
    breckenridge: LocationWeather;
    aspen: LocationWeather;
    vail: LocationWeather;
    crestedButte: LocationWeather;
    telluride: LocationWeather;
    beaverCreek: LocationWeather;
  }