import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, AlertCircle } from 'lucide-react';

export default function SearchBar({ onSearch, loading }) {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Set default dates: today and 5 days ahead
  useEffect(() => {
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000;

    const start = new Date(today.getTime() - tzOffset).toISOString().split('T')[0];
    const end = new Date(today.getTime() - tzOffset + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = location.trim();
    if (!trimmed) {
      setError('Please enter a location name.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    onSearch(trimmed, startDate, endDate);
  };

  const handleUseLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in your browser.');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setLocation(coords);
        setGettingLocation(false);
        onSearch(coords, startDate, endDate);
      },
      () => {
        setError('Could not access your location. Please enter it manually.');
        setGettingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="search-input" className="block text-sm font-medium text-slate-300 mb-1.5">
            Destination / City
          </label>
          <div className="relative">
            <input
              id="search-input"
              type="text"
              placeholder="e.g. Paris, Tokyo, Dehradun..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition-all"
              disabled={loading || gettingLocation}
            />
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="start-date" className="block text-xs font-medium text-slate-400 mb-1">
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl py-2.5 px-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80"
              disabled={loading || gettingLocation}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-xs font-medium text-slate-400 mb-1">
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl py-2.5 px-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80"
              disabled={loading || gettingLocation}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            type="submit"
            disabled={loading || gettingLocation}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Search Weather</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleUseLocation}
            disabled={loading || gettingLocation}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-xl py-2.5 px-3.5 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
          >
            {gettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            ) : (
              <MapPin className="h-4 w-4 text-rose-400" />
            )}
            <span>My Location</span>
          </button>
        </div>
      </form>
    </div>
  );
}
