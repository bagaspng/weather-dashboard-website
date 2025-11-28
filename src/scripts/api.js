import { processForecastData } from "../components/forecast.js";

export const API_KEY = "40bf0adeb6115d89c9881fa01248707e";

const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

export async function fetchCurrentWeather(city, unit) {
  const params = new URLSearchParams({
    lat: city.lat,
    lon: city.lon,
    units: unit,
    appid: API_KEY,
  });

  const res = await fetch(`${CURRENT_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Current weather error: " + res.status);
  return res.json();
}

export async function fetchForecast(city, unit) {
  const params = new URLSearchParams({
    lat: city.lat,
    lon: city.lon,
    units: unit,
    appid: API_KEY,
  });

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Forecast error: " + res.status);
  const data = await res.json();
  return processForecastData(data);
}

// AJAX (XMLHttpRequest) untuk autocomplete search city
export function searchCitiesAjax(query, onSuccess, onError) {
  if (!query || query.length < 2) {
    onSuccess([]);
    return;
  }

  const url = `${GEO_URL}?q=${encodeURIComponent(
    query
  )}&limit=5&appid=${API_KEY}`;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          onSuccess(Array.isArray(data) ? data : []);
        } catch (err) {
          onError?.(err);
        }
      } else {
        onError?.(new Error("Geocoding status: " + xhr.status));
      }
    }
  };

  xhr.send();
}
