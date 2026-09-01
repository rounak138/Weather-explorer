import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  HelpCircle,
} from 'lucide-react';

export function getWeatherDetails(code) {
  const table = {
    0: { label: 'Sunny & Clear', icon: Sun, color: 'text-amber-400', bgGradient: 'from-amber-500/20 to-orange-500/20' },
    1: { label: 'Mainly Clear', icon: CloudSun, color: 'text-yellow-300', bgGradient: 'from-yellow-500/10 to-blue-500/10' },
    2: { label: 'Partly Cloudy', icon: CloudSun, color: 'text-slate-300', bgGradient: 'from-slate-500/10 to-blue-500/10' },
    3: { label: 'Overcast', icon: Cloud, color: 'text-slate-400', bgGradient: 'from-slate-600/15 to-slate-800/15' },
    45: { label: 'Foggy', icon: CloudFog, color: 'text-zinc-400', bgGradient: 'from-zinc-500/10 to-zinc-700/10' },
    48: { label: 'Rime Fog', icon: CloudFog, color: 'text-zinc-400', bgGradient: 'from-zinc-500/10 to-zinc-700/10' },
    51: { label: 'Light Drizzle', icon: CloudDrizzle, color: 'text-sky-300', bgGradient: 'from-sky-500/10 to-blue-500/10' },
    53: { label: 'Moderate Drizzle', icon: CloudDrizzle, color: 'text-sky-400', bgGradient: 'from-sky-500/15 to-blue-500/15' },
    55: { label: 'Heavy Drizzle', icon: CloudDrizzle, color: 'text-sky-500', bgGradient: 'from-sky-600/20 to-blue-600/20' },
    56: { label: 'Freezing Drizzle', icon: CloudSnow, color: 'text-blue-200', bgGradient: 'from-blue-400/10 to-teal-400/10' },
    57: { label: 'Dense Freezing Drizzle', icon: CloudSnow, color: 'text-blue-300', bgGradient: 'from-blue-500/15 to-teal-500/15' },
    61: { label: 'Slight Rain', icon: CloudRain, color: 'text-blue-400', bgGradient: 'from-blue-500/15 to-indigo-500/15' },
    63: { label: 'Moderate Rain', icon: CloudRain, color: 'text-blue-500', bgGradient: 'from-blue-600/20 to-indigo-600/20' },
    65: { label: 'Heavy Rain', icon: CloudRain, color: 'text-blue-600', bgGradient: 'from-blue-700/25 to-indigo-700/25' },
    66: { label: 'Freezing Rain', icon: CloudSnow, color: 'text-sky-300', bgGradient: 'from-sky-400/10 to-blue-400/10' },
    67: { label: 'Heavy Freezing Rain', icon: CloudSnow, color: 'text-sky-400', bgGradient: 'from-sky-500/15 to-blue-500/15' },
    71: { label: 'Slight Snowfall', icon: Snowflake, color: 'text-sky-100', bgGradient: 'from-sky-300/10 to-indigo-300/10' },
    73: { label: 'Moderate Snowfall', icon: Snowflake, color: 'text-sky-200', bgGradient: 'from-sky-400/15 to-indigo-400/15' },
    75: { label: 'Heavy Snowfall', icon: Snowflake, color: 'text-sky-300', bgGradient: 'from-sky-500/20 to-indigo-500/20' },
    77: { label: 'Snow Grains', icon: Snowflake, color: 'text-sky-200', bgGradient: 'from-sky-400/15 to-indigo-400/15' },
    80: { label: 'Slight Rain Showers', icon: CloudRain, color: 'text-blue-400', bgGradient: 'from-blue-500/15 to-sky-500/15' },
    81: { label: 'Moderate Rain Showers', icon: CloudRain, color: 'text-blue-500', bgGradient: 'from-blue-600/20 to-sky-600/20' },
    82: { label: 'Violent Rain Showers', icon: CloudRain, color: 'text-blue-600', bgGradient: 'from-blue-700/25 to-sky-700/25' },
    85: { label: 'Slight Snow Showers', icon: CloudSnow, color: 'text-blue-200', bgGradient: 'from-blue-400/10 to-indigo-400/10' },
    86: { label: 'Heavy Snow Showers', icon: CloudSnow, color: 'text-blue-300', bgGradient: 'from-blue-500/15 to-indigo-500/15' },
    95: { label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-400', bgGradient: 'from-purple-500/20 to-fuchsia-500/20' },
    96: { label: 'Thunderstorm with Hail', icon: CloudLightning, color: 'text-purple-500', bgGradient: 'from-purple-600/25 to-fuchsia-600/25' },
    99: { label: 'Heavy Thunderstorm with Hail', icon: CloudLightning, color: 'text-purple-600', bgGradient: 'from-purple-700/30 to-fuchsia-700/30' },
  };

  return (
    table[code] || {
      label: 'Partly Cloudy',
      icon: HelpCircle,
      color: 'text-slate-400',
      bgGradient: 'from-slate-500/10 to-zinc-500/10',
    }
  );
}
