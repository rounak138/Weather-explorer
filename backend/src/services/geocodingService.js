import axios from 'axios';

export async function resolveLocation(query) {
  try {
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

    const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: query,
        count: 1,
        language: 'en',
        format: 'json',
      },
    });

    if (!data.results || data.results.length === 0) {
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
    const serviceErr = new Error('Geocoding service unavailable right now. Please try again.');
    serviceErr.statusCode = 503;
    throw serviceErr;
  }
}
