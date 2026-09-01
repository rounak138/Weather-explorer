import axios from 'axios';

const POPULAR_LOCATIONS = {
  paris: { name: 'Paris', country: 'France', latitude: 48.8534, longitude: 2.3488 },
  london: { name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257 },
  tokyo: { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
  'new york': { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  dubai: { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
  dehradun: { name: 'Dehradun', country: 'India', latitude: 30.3244, longitude: 78.0339 },
  delhi: { name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
  mumbai: { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 },
  sydney: { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  rome: { name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964 },
  berlin: { name: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050 },
  toronto: { name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
};

export async function resolveLocation(query) {
  try {
    const trimmed = query.trim().toLowerCase();

    // Check if user passed raw GPS coordinates like "28.6139, 77.2090"
    const coordPattern = /^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/;
    const match = query.match(coordPattern);

    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[3]);
      return {
        name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        country: 'GPS Coordinates',
        latitude: lat,
        longitude: lng,
      };
    }

    // Direct lookup in popular locations
    if (POPULAR_LOCATIONS[trimmed]) {
      return POPULAR_LOCATIONS[trimmed];
    }

    const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: query,
        count: 1,
        language: 'en',
        format: 'json',
      },
      headers: {
        'User-Agent': 'WeatherExplorer/1.0 (https://weather-explorer.onrender.com)',
      },
      timeout: 8000,
    });

    if (!data.results || data.results.length === 0) {
      // If query matches partially
      const matchedKey = Object.keys(POPULAR_LOCATIONS).find((k) => k.includes(trimmed) || trimmed.includes(k));
      if (matchedKey) return POPULAR_LOCATIONS[matchedKey];

      const err = new Error(`Could not find "${query}". Please check the spelling or try another city.`);
      err.statusCode = 404;
      throw err;
    }

    const matchResult = data.results[0];
    return {
      name: matchResult.name,
      country: matchResult.country || matchResult.country_code || '',
      latitude: matchResult.latitude,
      longitude: matchResult.longitude,
    };
  } catch (err) {
    if (err.statusCode) throw err;
    console.error('Geocoding error:', err.message);

    // If geocoding API is down/blocked, check popular fallback
    const key = query.trim().toLowerCase();
    if (POPULAR_LOCATIONS[key]) {
      return POPULAR_LOCATIONS[key];
    }

    const serviceErr = new Error('Geocoding service unavailable right now. Please try again.');
    serviceErr.statusCode = 503;
    throw serviceErr;
  }
}
