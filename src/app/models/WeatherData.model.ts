export interface WeatherType {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: Hourly;
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  rain: string;
  snowfall: string;
  windspeed_10m: string;
  is_day: string;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
  rain: number[];
  snowfall: number[];
  windspeed_10m: number[];
  is_day: number[];
}
