import axios from 'axios';

export async function getWeatherData(latitude, longitude, startDate, endDate) {
  try {
    let responseData;

    try {
      const params = {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum',
        timezone: 'auto',
      };

      if (startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      } else {
        params.forecast_days = 7;
      }

      const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', { params });
      responseData = data;
    } catch (apiErr) {
      console.warn('Open-Meteo specific range failed, falling back to 7-day forecast:', apiErr.response?.data?.reason || apiErr.message);
      // Fallback to standard 7-day forecast if custom date range was rejected by provider
      const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum',
          timezone: 'auto',
          forecast_days: 7,
        },
      });
      responseData = data;
    }

    const current = responseData.current
      ? {
          temperature: responseData.current.temperature_2m,
          humidity: responseData.current.relative_humidity_2m,
          windSpeed: responseData.current.wind_speed_10m,
          weatherCode: responseData.current.weather_code,
        }
      : null;

    const forecast = [];
    if (responseData.daily?.time) {
      for (let i = 0; i < responseData.daily.time.length; i++) {
        forecast.push({
          date: responseData.daily.time[i],
          weatherCode: responseData.daily.weather_code[i],
          tempMax: responseData.daily.temperature_2m_max[i],
          tempMin: responseData.daily.temperature_2m_min[i],
          windSpeedMax: responseData.daily.wind_speed_10m_max[i],
          precipitation: responseData.daily.precipitation_sum[i],
        });
      }
    }

    const insights = buildTravelInsights(forecast);

    return {
      current,
      forecast,
      insights,
    };
  } catch (err) {
    console.error('Weather API error:', err.response?.data || err.message);
    const serviceErr = new Error('Failed to fetch weather forecast. Please try again.');
    serviceErr.statusCode = 503;
    throw serviceErr;
  }
}

function buildTravelInsights(forecast) {
  const insights = {
    tips: [],
    bestDay: null,
  };

  if (!forecast || forecast.length === 0) return insights;

  let hasRain = false;
  let isHot = false;
  let isCold = false;
  let isWindy = false;

  let bestIndex = 0;
  let bestScore = -Infinity;

  forecast.forEach((day, idx) => {
    // Check conditions
    if (day.precipitation > 0 || (day.weatherCode >= 51 && day.weatherCode <= 99)) {
      hasRain = true;
    }
    if (day.tempMax > 30) isHot = true;
    if (day.tempMin < 12) isCold = true;
    if (day.windSpeedMax > 20) isWindy = true;

    // Simple outdoor score calculation
    let score = 0;
    if (day.weatherCode <= 1) score += 10;
    else if (day.weatherCode === 2) score += 8;
    else if (day.weatherCode === 3) score += 5;
    else score += 1;

    // Favor comfortable temperature range (around 22 C)
    const avgTemp = (day.tempMax + day.tempMin) / 2;
    score -= Math.abs(avgTemp - 22) * 0.4;
    score -= (day.precipitation || 0) * 2;

    if (day.windSpeedMax > 15) {
      score -= (day.windSpeedMax - 15) * 0.2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestIndex = idx;
    }
  });

  if (hasRain) {
    insights.tips.push('Rain expected during this period. Keep an umbrella handy.');
  } else {
    insights.tips.push('Mostly dry forecast — great for exploring outdoors.');
  }

  if (isHot) {
    insights.tips.push('Warm temperatures expected. Pack light clothes and stay hydrated.');
  }
  if (isCold) {
    insights.tips.push('Chilly nights or mornings ahead. Bring a warm jacket or layers.');
  }
  if (isWindy) {
    insights.tips.push('Breezy conditions forecast. Take care during outdoor excursions.');
  }

  const bestDay = forecast[bestIndex];
  const formatted = new Date(bestDay.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  insights.bestDay = {
    date: bestDay.date,
    formattedDate: formatted,
    tempMax: bestDay.tempMax,
    tempMin: bestDay.tempMin,
    reason:
      bestScore > 5
        ? 'Pleasant temperatures and clearer skies make this the best day for outdoor plans.'
        : 'This date offers the mildest conditions within your selected date range.',
  };

  return insights;
}
