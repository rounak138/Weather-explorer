import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../../data');
const dataFile = path.join(dataDir, 'searches.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function loadLocalSearches() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf-8');
      return JSON.parse(data || '[]');
    }
  } catch (err) {
    console.error('Failed to read local searches:', err.message);
  }
  return [];
}

function saveLocalSearches(items) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local searches:', err.message);
  }
}

function formatRecord(doc) {
  if (!doc) return null;
  const docId = doc._id || doc.id || crypto.randomUUID();
  const obj = {
    ...doc,
    _id: docId,
    id: docId,
    createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
    startDate: doc.startDate ? new Date(doc.startDate) : new Date(),
    endDate: doc.endDate ? new Date(doc.endDate) : new Date(),
  };

  obj.toJSON = function () {
    const json = { ...this };
    delete json._id;
    delete json.__v;
    return json;
  };

  return obj;
}

const weatherSearchSchema = new mongoose.Schema(
  {
    locationName: { type: String, required: true, trim: true },
    country: { type: String, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    weatherData: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

weatherSearchSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

weatherSearchSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

let MongooseModel;
try {
  MongooseModel = mongoose.model('WeatherSearch', weatherSearchSchema);
} catch {
  MongooseModel = mongoose.models.WeatherSearch;
}

const WeatherSearch = {
  create: async (data) => {
    if (mongoose.connection.readyState === 1) {
      return await MongooseModel.create(data);
    }
    const list = loadLocalSearches();
    const id = crypto.randomUUID();
    const now = new Date();
    const item = {
      _id: id,
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(item);
    saveLocalSearches(list);
    return formatRecord(item);
  },

  find: () => {
    if (mongoose.connection.readyState === 1) {
      return MongooseModel.find();
    }
    const list = loadLocalSearches().map(formatRecord);
    return {
      sort: () => {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return Promise.resolve(list);
      },
      then: (resolve, reject) => Promise.resolve(list).then(resolve, reject),
      exec: async () => list,
    };
  },

  findById: async (id) => {
    if (mongoose.connection.readyState === 1) {
      return await MongooseModel.findById(id);
    }
    const list = loadLocalSearches();
    const found = list.find((item) => item._id === id || item.id === id);
    return found ? formatRecord(found) : null;
  },

  findByIdAndUpdate: async (id, updates, options = {}) => {
    if (mongoose.connection.readyState === 1) {
      return await MongooseModel.findByIdAndUpdate(id, updates, options);
    }
    const list = loadLocalSearches();
    const index = list.findIndex((item) => item._id === id || item.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date(),
    };
    saveLocalSearches(list);
    return formatRecord(list[index]);
  },

  findByIdAndDelete: async (id) => {
    if (mongoose.connection.readyState === 1) {
      return await MongooseModel.findByIdAndDelete(id);
    }
    const list = loadLocalSearches();
    const filtered = list.filter((item) => item._id !== id && item.id !== id);
    saveLocalSearches(filtered);
    return { _id: id, id };
  },
};

export default WeatherSearch;
