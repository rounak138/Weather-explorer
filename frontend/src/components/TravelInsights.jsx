import React from 'react';
import { Sparkles, CalendarDays, CheckCircle2, Lightbulb } from 'lucide-react';

export default function TravelInsights({ searchRecord }) {
  if (!searchRecord) return null;

  const insights = searchRecord.weatherData?.insights;
  if (!insights || (!insights.tips?.length && !insights.bestDay)) {
    return null;
  }

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl relative overflow-hidden border-slate-700/50 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-700/50 pb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-400" />
        <span>Travel Tips & Packing Advisories</span>
      </h3>

      {insights.tips && insights.tips.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span>Packing Recommendations</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {insights.tips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 bg-slate-900/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-300"
              >
                <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.bestDay && (
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/25 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
            <CalendarDays className="h-4 w-4" />
            <span>Best Day for Outdoor Plans</span>
          </div>

          <div className="text-sm font-bold text-white">
            {insights.bestDay.formattedDate}
            <span className="text-xs font-normal text-slate-400 ml-2">
              ({Math.round(insights.bestDay.tempMin)}°C to {Math.round(insights.bestDay.tempMax)}°C)
            </span>
          </div>
          <p className="text-xs text-slate-300">{insights.bestDay.reason}</p>
        </div>
      )}
    </div>
  );
}
