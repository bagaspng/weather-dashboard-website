import { unitSymbol, formatDateTimeLocal } from "../scripts/utils.js";

export function initHeader({ state, onUnitChange, onRefresh }) {
  const btnCelsius = document.getElementById("btnCelsius");
  const btnFahrenheit = document.getElementById("btnFahrenheit");
  const btnTheme = document.getElementById("btnTheme");
  const themeIcon = document.getElementById("themeIcon");
  const themeLabel = document.getElementById("themeLabel");
  const btnRefresh = document.getElementById("btnRefresh");
  const elNowDate = document.getElementById("nowDate");
  const elNowTime = document.getElementById("nowTime");

  function applyUnitUI() {
    const symbol = unitSymbol(state.unit);
    document.getElementById("tempUnitLabel").textContent = symbol;

    if (state.unit === "metric") {
      btnCelsius.classList.add("bg-white/25", "text-sky-900");
      btnCelsius.classList.remove("opacity-80");
      btnFahrenheit.classList.remove("bg-white/25", "text-sky-900");
      btnFahrenheit.classList.add("opacity-80");
    } else {
      btnFahrenheit.classList.add("bg-white/25", "text-sky-900");
      btnFahrenheit.classList.remove("opacity-80");
      btnCelsius.classList.remove("bg-white/25", "text-sky-900");
      btnCelsius.classList.add("opacity-80");
    }
  }

  function applyThemeUI() {
    const isDark = document.documentElement.classList.contains("dark");
    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeLabel.textContent = isDark ? "Light" : "Dark";
  }

  function updateClock() {
    const { date, time } = formatDateTimeLocal();
    elNowDate.textContent = date;
    elNowTime.textContent = time;
  }

  // events
  btnCelsius.addEventListener("click", () => {
    if (state.unit !== "metric") {
      state.unit = "metric";
      applyUnitUI();
      onUnitChange();
    }
  });

  btnFahrenheit.addEventListener("click", () => {
    if (state.unit !== "imperial") {
      state.unit = "imperial";
      applyUnitUI();
      onUnitChange();
    }
  });

  btnTheme.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    applyThemeUI();
  });

  btnRefresh.addEventListener("click", onRefresh);

  applyUnitUI();
  applyThemeUI();
  updateClock();
  setInterval(updateClock, 1000);
}
