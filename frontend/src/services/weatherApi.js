import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const weatherApi = {
  searchWeather: async (location, startDate, endDate) => {
    const { data } = await api.post('/weather/search', { location, startDate, endDate });
    return data;
  },

  getHistory: async () => {
    const { data } = await api.get('/searches');
    return data;
  },

  updateSearch: async (id, location, startDate, endDate) => {
    const { data } = await api.put(`/searches/${id}`, { location, startDate, endDate });
    return data;
  },

  deleteSearch: async (id) => {
    const { data } = await api.delete(`/searches/${id}`);
    return data;
  },

  getExportUrl: (format) => {
    return `http://localhost:5000/api/searches/export/${format.toLowerCase()}`;
  },
};
