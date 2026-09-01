import axios from 'axios';

// Dynamically determine the backend API URL
// In production on the same domain, default to '/api'
// In local development or separate domain, default to VITE_API_URL or 'http://localhost:5000/api'
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
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
    return `${API_BASE_URL}/searches/export/${format.toLowerCase()}`;
  },
};
