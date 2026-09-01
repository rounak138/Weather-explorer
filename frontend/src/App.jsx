import React from 'react';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 min-h-screen flex flex-col justify-between">
      <main className="flex-1">
        <Home />
      </main>

      <footer className="mt-14 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>Weather Explorer — Travel & Forecast App</p>
      </footer>
    </div>
  );
}
