import React from 'react';
import { MapPin } from 'lucide-react';

export default function Map({ searchRecord }) {
  if (!searchRecord) return null;

  const { latitude, longitude, locationName } = searchRecord;
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-700/50 pb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-rose-500" />
        <span>Location Map</span>
      </h3>

      <div className="relative w-full h-[260px] rounded-xl overflow-hidden border border-slate-700/40 bg-slate-950">
        <iframe
          title={`Map for ${locationName}`}
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          className="opacity-90"
        />

        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 text-[10px] text-slate-400 font-medium px-2 py-1 rounded-md border border-slate-700/60 pointer-events-none">
          GPS: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </div>
      </div>
    </div>
  );
}
