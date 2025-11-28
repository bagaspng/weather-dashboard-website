import { searchCitiesAjax } from "../scripts/api.js";
import { saveAppState } from "../scripts/utils.js";

export function initSearch({ state, onCitySelected }) {
  const input = document.getElementById("cityInput");
  const btnSearch = document.getElementById("btnSearch");
  const list = document.getElementById("autocompleteList");
  const favoritesEl = document.getElementById("favorites");
  const cardCurrent = document.getElementById("cardCurrentMain");

  let debounceTimer = null;

  function renderFavorites() {
    favoritesEl.innerHTML = "";
    if (!state.favorites.length) return;

    const info = document.createElement("span");
    info.textContent = "Favorites:";
    info.className = "text-[11px] opacity-80 mr-1";
    favoritesEl.appendChild(info);

    state.favorites.forEach((fav, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "glass-soft px-3 py-1 text-[11px] hover:bg-white/20 transition";
      btn.textContent = `${fav.name}${fav.country ? ", " + fav.country : ""}`;
      btn.title = "Click to load. Right-click to remove.";

      btn.addEventListener("click", () => {
        state.currentCity = fav;
        saveAppState(state);
        onCitySelected();
      });

      btn.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (confirm(`Remove ${fav.name} from favorites?`)) {
          state.favorites.splice(index, 1);
          saveAppState(state);
          renderFavorites();
        }
      });

      favoritesEl.appendChild(btn);
    });
  }

  function renderAutocomplete(items) {
    list.innerHTML = "";
    if (!items.length) {
      list.classList.add("hidden");
      return;
    }

    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "autocomplete-item w-full text-left px-4 py-2 text-xs flex justify-between";
      const stateName = item.state ? ", " + item.state : "";
      btn.innerHTML = `
        <span>${item.name}${stateName}</span>
        <span class="opacity-70 text-[11px]">${item.country || ""}</span>
      `;
      btn.addEventListener("click", () => {
        input.value = `${item.name}${stateName}`;
        list.classList.add("hidden");
        state.currentCity = {
          name: item.name,
          country: item.country || "",
          lat: item.lat,
          lon: item.lon,
        };
        saveAppState(state);
        onCitySelected();
      });
      list.appendChild(btn);
    });

    list.classList.remove("hidden");
  }

  function handleSearch(query) {
    searchCitiesAjax(
      query,
      (items) => renderAutocomplete(items),
      (err) => console.error(err)
    );
  }

  input.addEventListener("input", (e) => {
    const q = e.target.value.trim();
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => handleSearch(q), 400);
  });

  btnSearch.addEventListener("click", () => {
    const q = input.value.trim();
    if (!q) return;
    handleSearch(q);
  });

  document.addEventListener("click", (e) => {
    if (!list.contains(e.target) && e.target !== input) {
      list.classList.add("hidden");
    }
  });

  if (cardCurrent) {
    cardCurrent.addEventListener("dblclick", () => {
      if (!state.currentCity) return;
      const exists = state.favorites.some(
        (c) =>
          c.name === state.currentCity.name &&
          c.country === state.currentCity.country
      );
      if (!exists) {
        state.favorites.push(state.currentCity);
        saveAppState(state);
        renderFavorites();
      }
    });
  }

  renderFavorites();
}
