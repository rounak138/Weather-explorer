import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import Map from '../components/Map';
import YoutubeVideos from '../components/YoutubeVideos';
import TravelInsights from '../components/TravelInsights';
import SearchHistory from '../components/SearchHistory';
import WeatherCompare from '../components/WeatherCompare';
import { weatherApi } from '../services/weatherApi';
import { AlertCircle, CloudSun } from 'lucide-react';

export default function Home() {
  const [activeSearch, setActiveSearch] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory(true);
  }, []);

  const loadHistory = async (setInitialActive = false) => {
    try {
      const data = await weatherApi.getHistory();
      setHistory(data);
      if (setInitialActive && data.length > 0 && !activeSearch) {
        setActiveSearch(data[0]);
      }
    } catch (err) {
      console.error('Could not load history:', err);
    }
  };

  const handleSearch = async (location, startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const res = await weatherApi.searchWeather(location, startDate, endDate);
      setActiveSearch(res.searchRecord);
      await loadHistory();
    } catch (err) {
      console.error('Search failed:', err);
      setError(
        err.response?.data?.message || 'Failed to fetch weather. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await weatherApi.deleteSearch(id);
      if (activeSearch?.id === id) {
        const remaining = history.filter((item) => item.id !== id);
        setActiveSearch(remaining.length > 0 ? remaining[0] : null);
      }
      await loadHistory();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleUpdate = async (id, location, startDate, endDate) => {
    const updated = await weatherApi.updateSearch(id, location, startDate, endDate);
    if (activeSearch?.id === id) {
      setActiveSearch(updated);
    }
    await loadHistory();
  };

  const handleSelect = (record) => {
    setActiveSearch(record);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-500/20 border border-blue-500/30 rounded-xl">
          <CloudSun className="h-7 w-7 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Weather Explorer
          </h1>
          <p className="text-xs text-slate-400">
            Real-time weather forecast & travel planning
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Search Form, Compare Tool, History */}
        <div className="lg:col-span-1 space-y-6">
          <SearchBar onSearch={handleSearch} loading={loading} />
          <WeatherCompare history={history} />
          <SearchHistory
            history={history}
            onSelect={handleSelect}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            activeId={activeSearch?.id}
          />
        </div>

        {/* Right Column: Weather Results */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="flex items-start gap-3 text-rose-300 bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-sm">Search Error</h4>
                <p className="text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {activeSearch ? (
            <div className="space-y-6">
              <CurrentWeather searchRecord={activeSearch} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TravelInsights searchRecord={activeSearch} />
                <Map searchRecord={activeSearch} />
              </div>

              <Forecast searchRecord={activeSearch} />
              <YoutubeVideos searchRecord={activeSearch} />
            </div>
          ) : (
            !loading &&
            !error && (
              <div className="glass-panel border-dashed border-slate-700/60 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2.5 h-[280px]">
                <CloudSun className="h-10 w-10 text-slate-600" />
                <h3 className="font-semibold text-slate-300">Ready to explore</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Search a destination above or pick a city from your recent search history.
                </p>
              </div>
            )
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 glass-panel rounded-2xl border-slate-700/40">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent" />
              <p className="text-xs font-medium text-slate-400">Loading weather data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
