import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/weatherRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { connectDatabase } from './services/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// API routes
app.use('/api', apiRoutes);

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`Server listening on http://localhost:${PORT}`);
});
