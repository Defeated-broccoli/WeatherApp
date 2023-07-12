import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { WeatherType } from '../models/WeatherData.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeatherData(
    latitude: number = 0,
    longitude: number = 0
  ): Observable<WeatherType> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(
      4
    )}&longitude=${longitude.toFixed(
      4
    )}&hourly=temperature_2m,rain,snowfall,windspeed_10m,is_day&timezone=auto&forecast_days=3`;

    return this.http.get<WeatherType>(url);
  }
}
