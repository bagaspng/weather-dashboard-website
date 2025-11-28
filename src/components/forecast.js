import { unitSymbol } from "../scripts/utils.js";

export function processForecastData(forecastJson) {
  const byDate = new Map();

  forecastJson.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().split("T")[0];

    if (!byDate.has(key)) {
      byDate.set(key, {
        date,
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon,
        desc: item.weather[0].main,
      });
    } else {
      const entry = byDate.get(key);
      entry.min = Math.min(entry.min, item.main.temp_min);
      entry.max = Math.max(entry.max, item.main.temp_max);
    }
  });

  return Array.from(byDate.values())
    .sort((a, b) => a.date - b.date)
    .slice(0, 7);
}

export function renderForecastRow(container, days, unit) {
  container.innerHTML = "";

  if (!days.length) {
    container.innerHTML =
      "<div class='text-xs opacity-80'>No forecast data</div>";
    return;
  }

  const symbol = unitSymbol(unit);

  days.forEach((d, idx) => {
    const div = document.createElement("div");
    div.className = "flex flex-col items-center gap-1 py-2";

    const label =
      idx === 0
        ? "Today"
        : d.date.toLocaleDateString(undefined, { weekday: "long" });

    const iconUrl = `https://openweathermap.org/img/wn/${d.icon}@2x.png`;

    div.innerHTML = `
      <div class="text-[11px] font-semibold opacity-80">${label}</div>
      <img src="${iconUrl}" alt="${d.desc}" class="w-10 h-10 -my-1" />
      <div class="text-[11px] opacity-80">${d.desc}</div>
      <div class="text-[11px] mt-1">
        <span class="font-semibold">${Math.round(d.max)}°${symbol}</span>
        <span class="opacity-70 ml-1">${Math.round(d.min)}°</span>
      </div>
    `;
    container.appendChild(div);
  });
}
