import {
  loadAppState,
  saveAppState,
  formatDateTimeLocal,
  formatTime,
  windUnit,
} from "./utils.js";
import { fetchCurrentWeather, fetchForecast } from "./api.js";
import { initHeader } from "../components/header.js";
import { initSearch } from "../components/search.js";
import { renderForecastRow } from "../components/forecast.js";

const state = loadAppState() || {
  unit: "metric",
  currentCity: null,
  favorites: [],
};

const elStatusCurrent = document.getElementById("statusCurrent");
const elSpinnerCurrent = document.getElementById("spinnerCurrent");
const elTemp = document.getElementById("currentTemp");
const elFeels = document.getElementById("feelsLike");
const elSummary = document.getElementById("currentSummary");
const elDesc = document.getElementById("currentDescription");
const elLoc = document.getElementById("locationText");
const elHumidity = document.getElementById("humidityText");
const elWind = document.getElementById("windText");
const elCloud = document.getElementById("cloudText");
const elHumidityBox = document.getElementById("humidityBox");
const elWindBox = document.getElementById("windBox");
const elLastUpdated = document.getElementById("lastUpdated");
const elWindHeader = document.getElementById("windHeader");
const elSunrise = document.getElementById("sunriseText");
const elSunset = document.getElementById("sunsetText");
const elSunDot = document.getElementById("sunDot");
const elForecastRow = document.getElementById("forecastRow");

function setLoadingCurrent(isLoading) {
  if (isLoading) {
    elSpinnerCurrent.classList.remove("hidden");
    elStatusCurrent.textContent = "Updating...";
  } else {
    elSpinnerCurrent.classList.add("hidden");
  }
}

function renderCurrent(json) {
  const { main, wind, weather, clouds, sys, dt, timezone } = json;

  elTemp.textContent = Math.round(main.temp);
  elFeels.textContent = Math.round(main.feels_like);
  elSummary.textContent = weather[0].main;
  elDesc.textContent = weather[0].description;

  const fullName = `${json.name}${sys.country ? ", " + sys.country : ""}`;
  elLoc.textContent = fullName;

  elHumidity.textContent = `${main.humidity} %`;
  elWind.textContent = `${wind.speed.toFixed(1)} ${windUnit(state.unit)}`;
  elCloud.textContent = `${clouds.all} %`;
  elHumidityBox.textContent = `${main.humidity} %`;
  elWindBox.textContent = `${wind.speed.toFixed(1)} ${windUnit(state.unit)}`;

  const { date, time } = formatDateTimeLocal(new Date(dt * 1000));
  elLastUpdated.textContent = `${date}, ${time}`;

  elWindHeader.textContent = `${wind.speed.toFixed(1)} ${windUnit(state.unit)}`;
  elSunrise.textContent = formatTime(sys.sunrise, timezone);
  elSunset.textContent = formatTime(sys.sunset, timezone);

  const nowLocal =
    Date.now() / 1000 - new Date().getTimezoneOffset() * 60 + timezone;
  const t = Math.max(
    0,
    Math.min(1, (nowLocal - sys.sunrise) / (sys.sunset - sys.sunrise))
  );
  const left = 12 + t * 76;
  const top = 26 - 17 * Math.sin(Math.PI * t);
  elSunDot.style.left = `calc(${left}% - 6px)`;
  elSunDot.style.top = `calc(${top}% - 6px)`;

  elStatusCurrent.textContent = "Last update OK.";
}

async function refreshWeather() {
  if (!state.currentCity) {
    elStatusCurrent.textContent = "Search and select a city first.";
    return;
  }

  setLoadingCurrent(true);
  try {
    const [currentJson, days] = await Promise.all([
      fetchCurrentWeather(state.currentCity, state.unit),
      fetchForecast(state.currentCity, state.unit),
    ]);

    state.currentCity.name = currentJson.name;
    state.currentCity.country = currentJson.sys.country;
    saveAppState(state);

    renderCurrent(currentJson);
    renderForecastRow(elForecastRow, days, state.unit);
  } catch (err) {
    console.error(err);
    elStatusCurrent.textContent = "Failed to fetch weather data.";
  } finally {
    setLoadingCurrent(false);
  }
}

function startAutoRefresh() {
  setInterval(refreshWeather, 5 * 60 * 1000);
}

initHeader({
  state,
  onUnitChange: () => {
    saveAppState(state);
    refreshWeather();
  },
  onRefresh: () => {
    refreshWeather();
  },
});

initSearch({
  state,
  onCitySelected: () => {
    refreshWeather();
  },
});

if (state.currentCity) {
  refreshWeather();
} else {
  elStatusCurrent.textContent =
    "Tip: search a city, pick from list, then double-click card to save favorite.";
}

startAutoRefresh();
