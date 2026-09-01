import { resolveLocation } from '../services/geocodingService.js';
import { getWeatherData } from '../services/weatherService.js';
import { getTravelVideos } from '../services/youtubeService.js';
import WeatherSearch from '../models/WeatherSearch.js';
import { validateSearchInput } from '../utils/validation.js';

export async function searchWeather(req, res, next) {
  try {
    const { location, startDate, endDate } = req.body;

    const validationError = validateSearchInput({ location, startDate, endDate });
    if (validationError) {
      const err = new Error(validationError);
      err.statusCode = 400;
      throw err;
    }

    // Get coordinates for the searched place
    const geo = await resolveLocation(location);

    // Fetch forecast & insights from Open-Meteo
    const weather = await getWeatherData(geo.latitude, geo.longitude, startDate, endDate);

    // Fetch video guides
    const videos = await getTravelVideos(geo.name);

    const fullWeatherData = {
      ...weather,
      videos,
    };

    // Save record to DB or local storage
    const saved = await WeatherSearch.create({
      locationName: geo.name,
      country: geo.country,
      latitude: geo.latitude,
      longitude: geo.longitude,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      weatherData: fullWeatherData,
    });

    res.status(200).json({
      message: 'Weather data retrieved successfully',
      searchRecord: saved,
    });
  } catch (err) {
    next(err);
  }
}
