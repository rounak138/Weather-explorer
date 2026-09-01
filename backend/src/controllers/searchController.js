import WeatherSearch from '../models/WeatherSearch.js';
import { resolveLocation } from '../services/geocodingService.js';
import { getWeatherData } from '../services/weatherService.js';
import { getTravelVideos } from '../services/youtubeService.js';
import { validateSearchInput } from '../utils/validation.js';

export async function createSearch(req, res, next) {
  try {
    const { location, startDate, endDate } = req.body;

    const validationError = validateSearchInput({ location, startDate, endDate });
    if (validationError) {
      const err = new Error(validationError);
      err.statusCode = 400;
      throw err;
    }

    const geo = await resolveLocation(location);
    const weather = await getWeatherData(geo.latitude, geo.longitude, startDate, endDate);
    const videos = await getTravelVideos(geo.name);

    const record = await WeatherSearch.create({
      locationName: geo.name,
      country: geo.country,
      latitude: geo.latitude,
      longitude: geo.longitude,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      weatherData: { ...weather, videos },
    });

    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}

export async function getAllSearches(req, res, next) {
  try {
    const searches = await WeatherSearch.find().sort({ createdAt: -1 });
    res.json(searches);
  } catch (err) {
    next(err);
  }
}

export async function getSearchById(req, res, next) {
  try {
    const { id } = req.params;
    const search = await WeatherSearch.findById(id);

    if (!search) {
      const err = new Error('Search record not found');
      err.statusCode = 404;
      throw err;
    }

    res.json(search);
  } catch (err) {
    next(err);
  }
}

export async function updateSearch(req, res, next) {
  try {
    const { id } = req.params;
    const { location, startDate, endDate } = req.body;

    const existing = await WeatherSearch.findById(id);
    if (!existing) {
      const err = new Error('Search record not found');
      err.statusCode = 404;
      throw err;
    }

    const targetLocation = location || existing.locationName;
    const targetStart = startDate || existing.startDate.toISOString().split('T')[0];
    const targetEnd = endDate || existing.endDate.toISOString().split('T')[0];

    const validationError = validateSearchInput({
      location: targetLocation,
      startDate: targetStart,
      endDate: targetEnd,
    });
    if (validationError) {
      const err = new Error(validationError);
      err.statusCode = 400;
      throw err;
    }

    let { locationName, country, latitude, longitude, weatherData } = existing;

    const locationChanged = location && location.trim().toLowerCase() !== existing.locationName.toLowerCase();
    const datesChanged = startDate || endDate;

    if (locationChanged || datesChanged) {
      if (locationChanged) {
        const geo = await resolveLocation(location);
        locationName = geo.name;
        country = geo.country;
        latitude = geo.latitude;
        longitude = geo.longitude;
      }

      const freshWeather = await getWeatherData(latitude, longitude, targetStart, targetEnd);
      const freshVideos = await getTravelVideos(locationName);
      weatherData = { ...freshWeather, videos: freshVideos };
    }

    const updated = await WeatherSearch.findByIdAndUpdate(
      id,
      {
        locationName,
        country,
        latitude,
        longitude,
        startDate: new Date(targetStart),
        endDate: new Date(targetEnd),
        weatherData,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteSearch(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await WeatherSearch.findById(id);

    if (!existing) {
      const err = new Error('Search record not found');
      err.statusCode = 404;
      throw err;
    }

    await WeatherSearch.findByIdAndDelete(id);
    res.json({ message: 'Record deleted', id });
  } catch (err) {
    next(err);
  }
}

export async function exportJSON(req, res, next) {
  try {
    const searches = await WeatherSearch.find().sort({ createdAt: -1 });
    res.setHeader('Content-disposition', 'attachment; filename=weather_searches.json');
    res.setHeader('Content-type', 'application/json');
    res.send(JSON.stringify(searches, null, 2));
  } catch (err) {
    next(err);
  }
}

export async function exportCSV(req, res, next) {
  try {
    const searches = await WeatherSearch.find().sort({ createdAt: -1 });

    let csv = 'ID,Location,Country,Latitude,Longitude,StartDate,EndDate,CreatedAt\n';
    searches.forEach((item) => {
      const name = (item.locationName || '').replace(/"/g, '""');
      const country = (item.country || '').replace(/"/g, '""');
      const start = item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '';
      const end = item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '';
      const created = item.createdAt ? new Date(item.createdAt).toISOString() : '';

      csv += `"${item.id}","${name}","${country}",${item.latitude},${item.longitude},"${start}","${end}","${created}"\n`;
    });

    res.setHeader('Content-disposition', 'attachment; filename=weather_searches.csv');
    res.setHeader('Content-type', 'text/csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
}
