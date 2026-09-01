import express from 'express';
import { searchWeather } from '../controllers/weatherController.js';
import {
  createSearch,
  getAllSearches,
  getSearchById,
  updateSearch,
  deleteSearch,
  exportJSON,
  exportCSV,
} from '../controllers/searchController.js';

const router = express.Router();

// Search route
router.post('/weather/search', searchWeather);

// Search history CRUD
router.post('/searches', createSearch);
router.get('/searches', getAllSearches);

// Export routes
router.get('/searches/export/json', exportJSON);
router.get('/searches/export/csv', exportCSV);

// Single search operations
router.get('/searches/:id', getSearchById);
router.put('/searches/:id', updateSearch);
router.delete('/searches/:id', deleteSearch);

export default router;
