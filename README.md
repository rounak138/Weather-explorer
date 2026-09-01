# Weather Explorer 🌦️

A full-stack travel and weather dashboard built with React and Node.js. It lets you search any city worldwide, check current weather and 5-day forecasts, view GPS maps, get practical travel & packing tips based on upcoming conditions, and watch travel guide videos.

## Features

- **Location Search**: Search by city name or use your browser's current GPS location.
- **Weather & Forecast**: Real-time temperature, humidity, wind speeds, and a 5-day daily forecast trend.
- **Travel Insights**: Automatic packing suggestions (rain prep, cold/hot weather gear) and recommendations for the best day for outdoor activities.
- **Interactive Map**: Google Maps view centered on the searched location's coordinates.
- **City Travel Guides**: Embedded travel guide videos for top destinations.
- **Search History**: Save, view, update date ranges, or delete past searches.
- **Side-by-side Comparison**: Compare weather between two saved cities.
- **Export Data**: Download your search history as CSV or JSON.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React icons, Axios
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (with automatic local storage fallback)
- **APIs Used**: Open-Meteo (Weather & Geocoding — free, no key needed), YouTube Data API v3 (optional)

---

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- MongoDB (optional — app will use local file storage if MongoDB isn't running)

### 1. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/weather_explorer
YOUTUBE_API_KEY=
```

Start the backend:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Setup Frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Project Structure

```
Weather app/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers (weather, search history)
│   │   ├── middleware/       # Error handling
│   │   ├── models/           # WeatherSearch schema
│   │   ├── routes/           # Express API routes
│   │   ├── services/         # Open-Meteo & YouTube service calls
│   │   ├── utils/            # Input validation
│   │   └── server.js         # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components (Forecast, Map, History, etc.)
│   │   ├── pages/            # Home dashboard
│   │   ├── services/         # Axios API client
│   │   ├── utils/            # Weather codes & icon mappings
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/weather/search` | Search location weather, forecast, and travel guides |
| `GET` | `/api/searches` | Get all saved searches |
| `GET` | `/api/searches/:id` | Get details for a specific search |
| `PUT` | `/api/searches/:id` | Update a search entry (re-fetches weather if location/dates changed) |
| `DELETE` | `/api/searches/:id` | Delete a search entry |
| `GET` | `/api/searches/export/csv` | Export search logs as CSV |
| `GET` | `/api/searches/export/json` | Export search logs as JSON |

---

## 🚀 Deploying on Render

You can deploy Weather Explorer on **[Render](https://render.com/)** in just a couple of minutes for free.

### Method 1: Using Render Blueprint (Recommended - 1-Click)

1. Sign up or log into [Render](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository: `rounak138/Weather-explorer`.
4. Render will automatically detect the [`render.yaml`](render.yaml) file.
5. Click **Apply**. Render will automatically build the frontend and launch the full-stack server!

### Method 2: Manual Web Service Setup

If you prefer setting it up manually on Render:
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and pick `rounak138/Weather-explorer`.
4. Configure the service:
   - **Name**: `weather-explorer`
   - **Language**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan Type**: `Free`
5. *(Optional)* In **Environment Variables**, you can add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (if not set, it will automatically fallback to local file storage).
   - `YOUTUBE_API_KEY`: Your YouTube API key (optional).
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.

