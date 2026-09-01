import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export let isMongoConnected = false;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/weather_explorer';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    isMongoConnected = false;
    console.log('MongoDB not reachable, using local storage (data/searches.json)');
  }
}
