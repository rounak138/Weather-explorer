import React, { useState, useEffect } from 'react';
import { GitCompare, MapPin, Wind, Droplets } from 'lucide-react';
import { getWeatherDetails } from '../utils/weatherHelpers';

export default function WeatherCompare({ history }) {
  const [selectedIdA, setSelectedIdA] = useState('');
  const [selectedIdB, setSelectedIdB] = useState('');

  useEffect(() => {
    if (history.length >= 2) {
      setSelectedIdA(history[0].id);
      setSelectedIdB(history[1].id);
    } else if (history.length === 1) {
      setSelectedIdA(history[0].id);
      setSelectedIdB('');
    }
  }, [history]);

  const itemA = history.find((item) => item.id === selectedIdA);
  const itemB = history.find((item) => item.id === selectedIdB);

  const renderCard = (record) => {
    if (!record) {
      return (
        <div className="bg-slate-900/20 border border-dashed border-slate-700 rounded-xl p-5 h-[200px] flex items-center justify-center text-slate-500 text-xs">
          Select a city to compare
        </div>
      );
    }

    const current = record.weatherData?.current;
    if (!current) {
      return (
        <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-5 h-[200px] flex items-center justify-center text-slate-500 text-xs">
          No current weather data
        </div>
      );
    }

    const { label, icon: WeatherIcon, color } = getWeatherDetails(current.weatherCode);

    return (
      <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4 space-y-3">
        <div className="pb-2 border-b border-slate-800">
          <div className="text-[10px] text-indigo-400 font-semibold uppercase">
            {record.country || 'Location'}
          </div>
          <h4 className="font-bold text-white text-sm truncate flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span>{record.locationName}</span>
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <WeatherIcon className={`h-10 w-10 ${color}`} />
          <div>
            <div className="text-2xl font-bold text-white leading-none">
              {Math.round(current.temperature)}°C
            </div>
            <div className="text-xs text-slate-300 mt-1">{label}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/40 text-[11px]">
          <div className="flex items-center gap-1 text-slate-400">
            <Droplets className="h-3.5 w-3.5 text-sky-400 shrink-0" />
            <span>Humidity: <strong className="text-slate-200">{current.humidity}%</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Wind className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <span>Wind: <strong className="text-slate-200">{current.windSpeed} km/h</strong></span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-700/50 pb-3 flex items-center gap-2">
        <GitCompare className="h-4 w-4 text-indigo-400" />
        <span>Compare Locations</span>
      </h3>

      {history.length < 2 ? (
        <div className="text-center py-4 text-slate-500 text-xs">
          Search at least two locations to compare them side-by-side.
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="compare-a" className="block text-[10px] font-medium text-slate-400 uppercase mb-1">
                Location A
              </label>
              <select
                id="compare-a"
                value={selectedIdA}
                onChange={(e) => setSelectedIdA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {history.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.locationName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="compare-b" className="block text-[10px] font-medium text-slate-400 uppercase mb-1">
                Location B
              </label>
              <select
                id="compare-b"
                value={selectedIdB}
                onChange={(e) => setSelectedIdB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Select city --</option>
                {history.map((item) => (
                  <option key={item.id} value={item.id} disabled={item.id === selectedIdA}>
                    {item.locationName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            {renderCard(itemA)}
            {renderCard(itemB)}
          </div>
        </div>
      )}
    </div>
  );
}
