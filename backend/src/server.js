import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/weatherRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { connectDatabase } from './services/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Root landing endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Weather Explorer Backend API is running successfully!',
    endpoints: {
      health: '/health',
      weatherSearch: 'POST /api/weather/search',
      history: 'GET /api/searches',
    },
  });
});

// API routes
app.use('/api', apiRoutes);

// Serve static frontend build if present
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, 'index.html'));
  });
}

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`Server listening on http://localhost:${PORT}`);
});

