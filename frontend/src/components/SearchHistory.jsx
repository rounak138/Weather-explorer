import React, { useState } from 'react';
import { Trash2, Edit2, Eye, Download, AlertCircle, X, Calendar, MapPin } from 'lucide-react';
import { weatherApi } from '../services/weatherApi';

export default function SearchHistory({
  history,
  onSelect,
  onDelete,
  onUpdate,
  activeId,
}) {
  const [editingRecord, setEditingRecord] = useState(null);
  const [editLocation, setEditLocation] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editError, setEditError] = useState(null);
  const [saving, setSaving] = useState(false);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const startEdit = (record) => {
    setEditError(null);
    setEditingRecord(record);
    setEditLocation(record.locationName);
    setEditStart(new Date(record.startDate).toISOString().split('T')[0]);
    setEditEnd(new Date(record.endDate).toISOString().split('T')[0]);
  };

  const closeEdit = () => {
    setEditingRecord(null);
    setEditError(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);

    if (!editLocation.trim()) {
      setEditError('Location name is required.');
      return;
    }

    if (new Date(editEnd) < new Date(editStart)) {
      setEditError('End date cannot be earlier than start date.');
      return;
    }

    setSaving(true);
    try {
      await onUpdate(editingRecord.id, editLocation.trim(), editStart, editEnd);
      closeEdit();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/50 pb-3">
        <h3 className="text-base font-bold text-white tracking-tight">Recent Searches</h3>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <a
              href={weatherApi.getExportUrl('csv')}
              download
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 py-1 px-2.5 rounded-lg transition-colors"
            >
              <Download className="h-3 w-3" />
              <span>CSV</span>
            </a>
            <a
              href={weatherApi.getExportUrl('json')}
              download
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 py-1 px-2.5 rounded-lg transition-colors"
            >
              <Download className="h-3 w-3" />
              <span>JSON</span>
            </a>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs">
          No searches yet. Look up a city above to see it here.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
          {history.map((item) => {
            const isActive = activeId === item.id;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2.5 ${
                  isActive
                    ? 'bg-blue-950/40 border-blue-500/50'
                    : 'bg-slate-900/40 border-slate-700/40 hover:border-slate-600/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-white text-sm flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span>{item.locationName}</span>
                      {item.country && (
                        <span className="text-[11px] text-slate-400 font-normal">
                          ({item.country})
                        </span>
                      )}
                    </h4>

                    <span className="text-[11px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50 flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>{formatDate(item.startDate)} - {formatDate(item.endDate)}</span>
                    </span>
                  </div>

                  {item.weatherData?.current && (
                    <div className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Temp: <strong className="text-slate-200">{Math.round(item.weatherData.current.temperature)}°C</strong></span>
                      <span>Wind: <strong className="text-slate-200">{item.weatherData.current.windSpeed} km/h</strong></span>
                      <span>Humidity: <strong className="text-slate-200">{item.weatherData.current.humidity}%</strong></span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-700/30">
                  <button
                    onClick={() => onSelect(item)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/20 text-blue-400 text-xs font-semibold py-1 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => startEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold py-1 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="flex items-center justify-center bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-400 p-1.5 rounded-lg cursor-pointer transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-5 relative">
            <button
              onClick={closeEdit}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Edit2 className="h-4 w-4 text-blue-400" />
              <span>Edit Search Query</span>
            </h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editStart}
                    onChange={(e) => setEditStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editEnd}
                    onChange={(e) => setEditEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                  />
                </div>
              </div>

              {editError && (
                <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl p-2.5 text-xs">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
