import React from 'react';
import { Thermometer, Wind, Droplets, Calendar, MapPin } from 'lucide-react';
import { getWeatherDetails } from '../utils/weatherHelpers';

export default function CurrentWeather({ searchRecord }) {
  if (!searchRecord) return null;

  const { locationName, country, startDate, endDate, weatherData } = searchRecord;
  const current = weatherData?.current;

  if (!current) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-slate-400 text-center">
        No current weather data available.
      </div>
    );
  }

  const { label, icon: WeatherIcon, color, bgGradient } = getWeatherDetails(current.weatherCode);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Simple approximation for feels-like temperature based on humidity
  const feelsLike = Math.round(current.temperature + (current.humidity - 50) * 0.05);

  return (
    <div
      className={`glass-panel rounded-2xl p-6 shadow-xl relative overflow-hidden bg-gradient-to-br ${bgGradient} border-slate-700/50`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-700/50">
        <div>
          <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>Current Destination</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {locationName}
            {country && <span className="text-slate-400 text-lg font-normal">, {country}</span>}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-slate-300 text-xs bg-slate-900/60 py-1.5 px-3 rounded-lg border border-slate-700/50 w-fit">
          <Calendar className="h-3.5 w-3.5 text-blue-400" />
          <span>{formatDate(startDate)}</span>
          <span className="text-slate-500">→</span>
          <span>{formatDate(endDate)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
            <WeatherIcon className={`h-14 w-14 ${color}`} />
          </div>
          <div>
            <div className="text-5xl font-extrabold text-white tracking-tight flex items-start">
              {Math.round(current.temperature)}
              <span className="text-2xl font-bold text-blue-400 mt-1">°C</span>
            </div>
            <div className="text-slate-200 font-semibold text-base mt-0.5">{label}</div>
            <div className="text-slate-400 text-xs flex items-center gap-1 mt-1">
              <Thermometer className="h-3.5 w-3.5 text-slate-500" />
              <span>Feels like {feelsLike}°C</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
              <Droplets className="h-4 w-4 text-sky-400" />
              <span>Humidity</span>
            </div>
            <div className="text-2xl font-bold text-white">{current.humidity}%</div>
          </div>

          <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
              <Wind className="h-4 w-4 text-teal-400" />
              <span>Wind Speed</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {current.windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
