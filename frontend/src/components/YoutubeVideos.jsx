import React, { useState } from 'react';
import { Play, X, Compass, Video } from 'lucide-react';

export default function YoutubeVideos({ searchRecord }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (!searchRecord) return null;

  const { locationName, weatherData } = searchRecord;
  const videos = weatherData?.videos || [];

  if (videos.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-700/50 pb-3 flex items-center gap-2">
        <Video className="h-4 w-4 text-red-500" />
        <span>Travel Guides for {locationName}</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video.id)}
            className="group cursor-pointer bg-slate-900/50 hover:bg-slate-900/80 border border-slate-700/30 hover:border-red-500/30 rounded-xl overflow-hidden shadow transition-all"
          >
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 flex items-center justify-center transition-all">
                <div className="p-3 bg-red-600/90 text-white rounded-full shadow-lg scale-90 group-hover:scale-100 transition-all">
                  <Play className="h-5 w-5 fill-current pl-0.5" />
                </div>
              </div>
            </div>

            <div className="p-3 space-y-1">
              <h4
                className="text-xs font-semibold text-slate-100 line-clamp-2 group-hover:text-red-400 transition-colors"
                dangerouslySetInnerHTML={{ __html: video.title }}
              />
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Compass className="h-3 w-3 text-slate-500" />
                <span>{video.channelTitle}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-10 p-1.5 bg-slate-950/70 hover:bg-slate-950 border border-slate-700/60 rounded-full text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative w-full aspect-video bg-black">
              <iframe
                title="YouTube Player"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
