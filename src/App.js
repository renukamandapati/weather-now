import React, { useState } from "react";
import "./App.css";

// Mapping Open-Meteo weather codes to human-readable conditions
const weatherDescriptions = {
  0: "☀️ Clear sky",
  1: "🌤️ Mainly clear",
  2: "⛅ Partly cloudy",
  3: "☁️ Overcast",
  45: "🌫️ Fog",
  48: "🌫️ Rime fog",
  51: "🌦️ Light drizzle",
  53: "🌦️ Moderate drizzle",
  55: "🌧️ Dense drizzle",
  61: "🌦️ Slight rain",
  63: "🌧️ Moderate rain",
  65: "🌧️ Heavy rain",
  71: "❄️ Slight snowfall",
  73: "❄️ Moderate snowfall",
  75: "❄️ Heavy snowfall",
  80: "🌧️ Rain showers",
  81: "🌧️ Moderate rain showers",
  82: "🌧️ Heavy rain showers",
  95: "⛈️ Thunderstorm",
  96: "⛈️ Thunderstorm with hail",
  99: "⛈️ Severe thunderstorm with hail",
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  // Predefined Indian cities
  const indianCities = [
    "Hyderabad",
    "Chennai",
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Kolkata",
    "Visakhapatnam",
    "Vijayawada",
    "Tirupati",
    "Amaravati",
  ];

  // Fetch weather data
  const getWeather = async (selectedCity) => {
    try {
      const cityToSearch = selectedCity || city;
      setError("");
      setWeather(null);

      // 1. Get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityToSearch}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found. Please try again.");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Get weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      const code = weatherData.current_weather.weathercode;

      setWeather({
        city: `${name}, ${country}`,
        temperature: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        condition: weatherDescriptions[code] || "Unknown condition",
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="app">
      <h1>🌤️ Weather Now</h1>

      {/* Global city search */}
      <div className="search">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => getWeather()}>Get Weather</button>
      </div>

      {/* Indian cities dropdown */}
      <div className="dropdown">
        <p>Or select an Indian city:</p>
        <select onChange={(e) => getWeather(e.target.value)} defaultValue="">
          <option value="" disabled>
            -- Select City --
          </option>
          {indianCities.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Error message */}
      {error && <p className="error">{error}</p>}

      {/* Weather result */}
      {weather && (
        <div className="result">
          <h2>{weather.city}</h2>
          <p>🌡️ Temperature: {weather.temperature} °C</p>
          <p>💨 Wind Speed: {weather.wind} km/h</p>
          <p>{weather.condition}</p>
        </div>
      )}
    </div>
  );
}

export default App;
