// Helpers umum: waktu, localStorage, unit

export function unitSymbol(unit) {
  return unit === "metric" ? "C" : "F";
}

export function windUnit(unit) {
  return unit === "metric" ? "m/s" : "mph";
}

export function formatTime(ts, tzOffsetSec) {
  const date = new Date((ts + tzOffsetSec) * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTimeLocal(date = new Date()) {
  const optsDate = { day: "2-digit", month: "2-digit", year: "numeric" };
  const optsTime = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  return {
    date: date.toLocaleDateString(undefined, optsDate),
    time: date.toLocaleTimeString(undefined, optsTime),
  };
}

export function loadAppState() {
  const raw = localStorage.getItem("weatherDashboardState");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAppState(state) {
  localStorage.setItem("weatherDashboardState", JSON.stringify(state));
}
