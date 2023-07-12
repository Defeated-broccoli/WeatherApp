import { Component } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherType } from './models/WeatherData.model';
import { WeatherIconEnum, WeatherImageEnum } from './enums/weatherImage';

type PositionType = {
  latitude: number;
  longitude: number;
};

type WeatherHourlyType = {
  date: string;
  time: string;
  temperature: number;
  timezone: string;
  rain: number;
  snowfall: number;
  windspeed: number;
  isDay: number;
  iconSource?: string;
  imageSource?: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  weatherData?: WeatherType;
  position?: PositionType;
  weatherHourly: WeatherHourlyType[] = [];
  currentHour?: WeatherHourlyType;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getPosition();
  }

  getWeather = (latitude: number, longitude: number) => {
    this.weatherService.getWeatherData(latitude, longitude).subscribe({
      next: (response) => {
        this.weatherData = response;

        if (!this.weatherData) throw new Error(`Couldn't load weather`);

        this.weatherData.hourly.time.forEach((obj, i) => {
          const [date, time] = obj.split('T');
          this.weatherHourly.push({
            time: time,
            date: date,
            temperature: this.weatherData!.hourly.temperature_2m[i],
            timezone: this.weatherData!.timezone,
            rain: this.weatherData!.hourly.rain[i],
            snowfall: this.weatherData!.hourly.snowfall[i],
            windspeed: this.weatherData!.hourly.windspeed_10m[i],
            isDay: this.weatherData!.hourly.is_day[i],
          });
        });

        this.setIcon();
        this.setCurrentHour();
      },
    });
  };

  success = (pos: GeolocationPosition) => {
    this.getWeather(pos.coords.latitude, pos.coords.longitude);
    this.position = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  };

  getPosition = () => {
    navigator.geolocation.getCurrentPosition(this.success);
  };

  selectHour = (hour: WeatherHourlyType) => {
    this.currentHour = hour;
  };

  setIcon = () => {
    this.weatherHourly.forEach((hour) => {
      if (hour.isDay === 1) {
        hour.iconSource = WeatherIconEnum.day;
        hour.imageSource = WeatherImageEnum.clear;

        if (hour.rain > 0) {
          hour.iconSource = WeatherIconEnum.rain_day;
          hour.imageSource = WeatherImageEnum.rain;
        }
        if (hour.snowfall > 0) {
          hour.iconSource = WeatherIconEnum.snow_day;
          hour.imageSource = WeatherImageEnum.snow;
        }
      } else {
        hour.iconSource = WeatherIconEnum.night;
        hour.imageSource = WeatherImageEnum.clear;

        if (hour.rain > 0) {
          hour.iconSource = WeatherIconEnum.rain_night;
          hour.imageSource = WeatherImageEnum.rain;
        }

        if (hour.snowfall > 0) {
          hour.iconSource = WeatherIconEnum.snow_night;
          hour.imageSource = WeatherImageEnum.snow;
        }
      }
    });
  };

  setCurrentHour = () => {
    this.currentHour =
      this.weatherHourly![
        new Date().getHours() - this.weatherData?.utc_offset_seconds! / 3600
      ];
  };
}
