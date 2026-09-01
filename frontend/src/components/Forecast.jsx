import React from 'react';
import { Umbrella } from 'lucide-react';
import { getWeatherDetails } from '../utils/weatherHelpers';

export default function Forecast({ searchRecord }) {
  if (!searchRecord) return null;

  const forecast = searchRecord.weatherData?.forecast || [];

  if (forecast.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-slate-400">
        No forecast data available.
      </div>
    );
  }

  const formatDayInfo = (dateStr) => {
    const d = new Date(dateStr);
    return {
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayMonth: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-700/50 pb-3">
        📅 5-Day Forecast
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {forecast.map((day) => {
          const { weekday, dayMonth } = formatDayInfo(day.date);
          const { label, icon: DayIcon, color } = getWeatherDetails(day.weatherCode);

          return (
            <div
              key={day.date}
              className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-3.5 flex flex-col items-center justify-between text-center transition-colors hover:border-slate-600/50 hover:bg-slate-900/60"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-200 uppercase">{weekday}</div>
                <div className="text-[11px] text-slate-400">{dayMonth}</div>
              </div>

              <div className="my-3.5 flex flex-col items-center gap-1">
                <DayIcon className={`h-8 w-8 ${color}`} />
                <div className="text-[11px] text-slate-300 font-medium truncate max-w-[90px]">
                  {label}
                </div>
              </div>

              <div className="space-y-1 w-full">
                <div className="flex items-center justify-center gap-1.5 text-xs">
                  <span className="font-bold text-white">{Math.round(day.tempMax)}°</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-400">{Math.round(day.tempMin)}°</span>
                </div>

                {day.precipitation > 0 ? (
                  <div className="flex items-center justify-center gap-1 text-[10px] text-sky-400 font-medium">
                    <Umbrella className="h-3 w-3 shrink-0" />
                    <span>{day.precipitation.toFixed(1)} mm</span>
                  </div>
                ) : (
                  <div className="h-3.5" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
