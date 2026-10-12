(function () {
  "use strict";

  const STORAGE_KEY = "forecast-fits:last-location";
  const NORFOLK = {
    id: "norfolk-va",
    name: "Norfolk",
    admin1: "Virginia",
    country: "United States",
    latitude: 36.8508,
    longitude: -76.2859
  };
  const elements = {
    aboutButton: document.getElementById("about-button"),
    aboutScreen: document.getElementById("about-screen"),
    backButton: document.getElementById("back-button"),
    characterArt: document.getElementById("character-art"),
    currentReading: document.getElementById("current-reading"),
    dateInput: document.getElementById("date-input"),
    errorMessage: document.getElementById("error-message"),
    forecastDays: document.getElementById("forecast-days"),
    forecastStrip: document.getElementById("forecast-strip"),
    geolocateButton: document.getElementById("geolocate-button"),
    highTemperature: document.getElementById("high-temperature"),
    locationForm: document.getElementById("location-form"),
    locationInput: document.getElementById("location-input"),
    lowTemperature: document.getElementById("low-temperature"),
    mainScreen: document.getElementById("main-screen"),
    outfitName: document.getElementById("outfit-name"),
    rainProbability: document.getElementById("rain-probability"),
    recommendationCopy: document.getElementById("recommendation-copy"),
    recommendationTitle: document.getElementById("recommendation-title"),
    refreshButton: document.getElementById("refresh-button"),
    reminderList: document.getElementById("reminder-list"),
    searchResults: document.getElementById("search-results"),
    selectedDateLabel: document.getElementById("selected-date-label"),
    statusMessage: document.getElementById("status-message"),
    travelProbability: document.getElementById("travel-probability"),
    travelWindowCopy: document.getElementById("travel-window-copy"),
    uvIndex: document.getElementById("uv-index"),
    weatherContent: document.getElementById("weather-content"),
    weatherDescription: document.getElementById("weather-description"),
    weatherIcon: document.getElementById("weather-icon"),
    windSpeed: document.getElementById("wind-speed")
  };

  let currentLocation = restoreLocation();
  let forecast = null;
  let selectedDate = null;
  let requestNumber = 0;

  function restoreLocation() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return NORFOLK;
      const value = JSON.parse(saved);
      if (
        value &&
        typeof value.name === "string" &&
        Number.isFinite(value.latitude) &&
        Number.isFinite(value.longitude)
      ) {
        return value;
      }
      return NORFOLK;
    } catch (error) {
      return NORFOLK;
    }
  }

  function saveLocation(location) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      return true;
    } catch (error) {
      return false;
    }
  }

  function setStatus(message) {
    elements.statusMessage.textContent = message;
  }

  function showError(message, retry) {
    elements.errorMessage.replaceChildren();
    const text = document.createElement("span");
    text.textContent = message;
    elements.errorMessage.append(text);
    if (typeof retry === "function") {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "error-retry";
      button.textContent = "Try again";
      button.addEventListener("click", retry, { once: true });
      elements.errorMessage.append(" ", button);
    }
    elements.errorMessage.hidden = false;
  }

  function clearError() {
    elements.errorMessage.textContent = "";
    elements.errorMessage.hidden = true;
  }

  function locationLabel(location) {
    if (location.id === "device-location") return "My location";
    return [location.name, location.admin1].filter(Boolean).join(", ");
  }

  function formatDate(date, options) {
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date + "T12:00:00"));
  }

  function formatTemperature(value) {
    return Number.isFinite(value) ? Math.round(value) + "°" : "—";
  }

  function formatLocalTime(value) {
    const match = typeof value === "string" ? value.match(/T(\d{2}):(\d{2})/) : null;
    if (!match) return "";
    const hour = Number(match[1]);
    const minute = match[2];
    const period = hour < 12 ? "AM" : "PM";
    return (hour % 12 || 12) + ":" + minute + " " + period + " local";
  }

  function weatherLabel(code) {
    if (code === 0) return "Clear sky";
    if (code === 1) return "Mostly clear";
    if (code === 2) return "Partly cloudy";
    if (code === 3) return "Cloudy";
    if (code === 45 || code === 48) return "Foggy";
    if (code >= 51 && code <= 55) return "Light drizzle";
    if (code >= 56 && code <= 57) return "Freezing drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code >= 66 && code <= 67) return "Freezing rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code === 80 || code === 81) return "Rain showers";
    if (code === 82) return "Heavy showers";
    if (code === 85 || code === 86) return "Snow showers";
    if (code >= 95) return "Thunderstorms";
    return "Cloud conditions";
  }

  function weatherIcon(kind) {
    const sun = '<circle cx="20" cy="20" r="7" fill="#efbd58"/><g stroke="#d49337" stroke-width="2" stroke-linecap="round"><path d="M20 3v4M20 33v4M3 20h4M33 20h4M8 8l3 3M29 29l3 3M32 8l-3 3M11 29l-3 3"/></g>';
    const cloud = '<path d="M11 29h18a7 7 0 0 0 .4-14A10 10 0 0 0 10 17a6 6 0 0 0 1 12Z" fill="#d9e7e6" stroke="#66838a" stroke-width="1.7"/>';
    const rain = '<path d="M10 24h19a6 6 0 0 0 .3-12A9 9 0 0 0 10 14a5 5 0 0 0 0 10Z" fill="#d9e7e6" stroke="#66838a" stroke-width="1.7"/><g stroke="#4e8da1" stroke-width="2" stroke-linecap="round"><path d="m13 28-2 5M21 28l-2 5M29 28l-2 5"/></g>';
    const snow = '<path d="M10 23h19a6 6 0 0 0 .3-12A9 9 0 0 0 10 13a5 5 0 0 0 0 10Z" fill="#d9e7e6" stroke="#66838a" stroke-width="1.7"/><g fill="#5d95a7"><circle cx="13" cy="30" r="1.5"/><circle cx="21" cy="33" r="1.5"/><circle cx="29" cy="29" r="1.5"/></g>';
    const storm = '<path d="M9 22h20a6 6 0 0 0 .3-12A9 9 0 0 0 9 12a5 5 0 0 0 0 10Z" fill="#d9e0dd" stroke="#66838a" stroke-width="1.7"/><path d="m21 21-5 8h5l-2 6 8-10h-5l3-4Z" fill="#e6ae42"/>';
    const partly = '<circle cx="14" cy="14" r="6" fill="#efbd58"/><g stroke="#d49337" stroke-width="1.8" stroke-linecap="round"><path d="M14 3v3M4 14h3M6 6l2 2M22 6l-2 2"/></g><path d="M12 30h17a6 6 0 0 0 .3-12A9 9 0 0 0 12 19a5.5 5.5 0 0 0 0 11Z" fill="#d9e7e6" stroke="#66838a" stroke-width="1.7"/>';
    const art = { sun, cloud, rain, snow, storm, partly }[kind] || cloud;
    return '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">' + art + "</svg>";
  }

  function avatarSvg(outfit, rain, snow) {
    const top = outfit.top;
    const bottom = outfit.bottom;
    const accent = outfit.accent;
    let clothes = "";
    switch (outfit.style) {
      case "parka":
        clothes = '<path d="M111 140Q160 119 209 140l19 86-30 20h-76l-30-20 19-86Z" fill="' + top + '"/><path d="M119 143 99 155l-24 66 19 8 31-50M201 143l20 12 24 66-19 8-31-50" fill="' + top + '"/><path d="M140 134q20-17 40 0v15h-40Z" fill="' + accent + '"/><path d="M160 150v75" stroke="#f5e9d5" stroke-width="3"/><path d="M108 189h104M105 209h110" stroke="' + accent + '" stroke-width="3"/>';
        break;
      case "puffer":
        clothes = '<rect x="101" y="137" width="118" height="112" rx="29" fill="' + top + '"/><path d="M106 162h108M103 184h114M103 206h114M110 228h100" stroke="' + accent + '" stroke-width="4"/><path d="M113 146 89 158l-19 57 18 7 32-56M207 146l24 12 19 57-18 7-32-56" fill="' + top + '"/><path d="M158 143v99" stroke="#fff2dc" stroke-width="2.5"/>';
        break;
      case "wool":
        clothes = '<path d="M115 140Q160 124 205 140l17 142-62 15-62-15 17-142Z" fill="' + top + '"/><path d="m115 143-22 12-23 66 19 9 32-48M205 143l22 12 23 66-19 9-32-48" fill="' + top + '"/><path d="m143 142 17 19 17-19M160 161v122" fill="' + accent + '" stroke="' + accent + '" stroke-width="2"/><path d="M145 205h7M169 205h7M145 228h7M169 228h7" stroke="#f3e6d2" stroke-width="3"/>';
        break;
      case "overshirt":
      case "field":
      case "shirt":
      case "linen":
        clothes = '<path d="M118 141Q160 129 202 141l14 99-56 13-56-13 14-99Z" fill="' + top + '"/><path d="m118 144-22 12-20 57 17 8 33-47M202 144l22 12 20 57-17 8-33-47" fill="' + top + '"/><path d="m144 140 16 18 16-18M160 158v91" fill="' + accent + '" stroke="' + accent + '" stroke-width="2.5"/><path d="M138 186h8M174 186h8M138 210h8M174 210h8" stroke="#fff2dc" stroke-width="3"/>';
        if (outfit.style === "field") clothes += '<path d="M102 183h29M189 183h29" stroke="' + accent + '" stroke-width="3"/>';
        if (outfit.style === "linen") clothes += '<path d="M125 169h13M182 169h13M125 179h13M182 179h13" stroke="#f6e7cb" stroke-width="2"/>';
        break;
      case "knit":
        clothes = '<path d="M115 141Q160 127 205 141l17 100-62 14-62-14 17-100Z" fill="' + top + '"/><path d="m115 145-20 12-21 58 18 8 31-50M205 145l20 12 21 58-18 8-31-50" fill="' + top + '"/><path d="M130 155h60M126 167h68M125 179h70" stroke="' + accent + '" stroke-width="2.4"/><path d="M160 143v104" stroke="#f5ecdd" stroke-width="2"/>';
        break;
      case "vest":
        clothes = '<path d="M118 140Q160 130 202 140l16 100-58 13-58-13 16-100Z" fill="' + accent + '"/><path d="m120 144-23 11-23 59 17 9 35-48M200 144l23 11 23 59-17 9-35-48" fill="' + top + '"/><path d="m145 141 15 17 15-17M160 159v91" fill="' + top + '" stroke="' + top + '" stroke-width="2"/>';
        break;
      case "tank":
        clothes = '<path d="M134 135h16l10 16 10-16h16l20 26-15 15-9-9v78l-22 9-22-9v-78l-9 9-15-15 20-26Z" fill="' + top + '"/><path d="M151 151h18M160 153v91" stroke="' + accent + '" stroke-width="3"/>';
        break;
      case "tee":
      case "shortSleeve":
      default:
        clothes = '<path d="M129 137h18l13 15 13-15h18l23 24-17 17-13-12v79l-24 8-24-8v-79l-13 12-17-17 23-24Z" fill="' + top + '"/><path d="M160 153v94M141 184h38" stroke="' + accent + '" stroke-width="3"/>';
        break;
    }

    let legs = "";
    if (outfit.leg === "shorts") {
      legs = '<path d="M119 239h82l-4 44-28 4-9-33-10 33-28-4-3-44Z" fill="' + bottom + '"/><path d="M148 284l-4 35M176 284l5 35" stroke="#d49b71" stroke-width="11" stroke-linecap="round"/><path d="M132 320h19M175 320h19" stroke="#f9f5e9" stroke-width="10" stroke-linecap="round"/><path d="M139 244v28M177 244v28" stroke="' + accent + '" stroke-width="2"/>';
    } else {
      legs = '<path d="M121 238h78l-5 79-28 4-6-61-7 61-28-4-4-79Z" fill="' + bottom + '"/><path d="M130 320h25M169 320h25" stroke="#f9f5e9" stroke-width="11" stroke-linecap="round"/><path d="M160 241v61" stroke="' + accent + '" stroke-width="2"/>';
    }

    let detail = "";
    if (outfit.detail === "scarf") detail = '<path d="M142 137q18 9 36 0l4 27-40 0Z" fill="' + accent + '"/><path d="M174 157v34l12 5" stroke="' + accent + '" stroke-width="9" stroke-linecap="round"/>';
    if (outfit.detail === "beanie") detail = '<path d="M128 75q0-34 32-34t32 34v9h-64Z" fill="' + accent + '"/><path d="M125 80h70" stroke="#f7e7cf" stroke-width="5"/>';
    if (outfit.detail === "cap") detail = '<path d="M128 74q3-25 32-25t31 25h-63Z" fill="' + accent + '"/><path d="M155 74h56q-10 13-53 7" fill="' + accent + '"/>';
    if (outfit.detail === "sunhat") detail = '<path d="M123 72q6-34 37-34t37 34h-74ZM112 74h96q-5 14-48 14t-48-14Z" fill="' + accent + '"/>';
    if (outfit.detail === "sunglasses") detail = '<path d="M133 77h22l-2 8q-8 8-17 0l-3-8ZM165 77h22l-3 8q-9 8-17 0l-2-8ZM155 79h10" fill="#34454a" stroke="#34454a" stroke-width="2"/>';
    if (outfit.detail === "necklace") detail = '<path d="M145 157q15 21 30 0" fill="none" stroke="' + accent + '" stroke-width="3"/><circle cx="160" cy="178" r="3" fill="' + accent + '"/>';
    if (outfit.detail === "tee") detail = '<path d="M145 137q15 14 30 0v16h-30Z" fill="' + accent + '"/>';

    let rainLayer = "";
    let snowLayer = "";
    if (rain) {
      let coat = '<path d="M116 143Q160 126 204 143l14 109-58 10-58-10 14-109Z" fill="' + rain.color + '"/><path d="m117 147-22 12-22 58 18 8 35-47M203 147l22 12 22 58-18 8-35-47" fill="' + rain.color + '"/><path d="m144 143 16 19 16-19M160 162v93" fill="none" stroke="' + rain.accent + '" stroke-width="4"/>';
      if (rain.style === "long") coat = '<path d="M116 143Q160 126 204 143l19 150-63 8-63-8 19-150Z" fill="' + rain.color + '"/><path d="m117 147-22 12-22 58 18 8 35-47M203 147l22 12 22 58-18 8-35-47" fill="' + rain.color + '"/><path d="m144 143 16 19 16-19M160 162v132" fill="none" stroke="' + rain.accent + '" stroke-width="4"/>';
      if (rain.style === "slicker") coat = '<path d="M116 143Q160 126 204 143l14 109-58 10-58-10 14-109Z" fill="' + rain.color + '"/><path d="m117 147-22 12-22 58 18 8 35-47M203 147l22 12 22 58-18 8-35-47" fill="' + rain.color + '"/><path d="m144 143 16 19 16-19M160 162v93" fill="none" stroke="' + rain.accent + '" stroke-width="4"/><path d="M124 188h72" stroke="#f7e9ca" stroke-width="3"/>';
      rainLayer = '<g>' + coat + '<path d="M125 311h24l-2 18h-29q-6-8 7-18ZM173 311h24l8 18h-29Z" fill="' + rain.color + '" stroke="' + rain.accent + '" stroke-width="3"/><path d="M99 321h18M204 321h18" stroke="#53676c" stroke-width="3" stroke-linecap="round"/></g><g><path d="M40 86a45 45 0 0 1 90 0Z" fill="' + rain.color + '" stroke="' + rain.accent + '" stroke-width="3"/><path d="M85 86v35q0 8 8 8" fill="none" stroke="#52666a" stroke-width="3" stroke-linecap="round"/><path d="M63 86q0-14 22-14t22 14" fill="none" stroke="' + rain.accent + '" stroke-width="2"/></g><g stroke="#6ca2ad" stroke-width="2" stroke-linecap="round"><path d="m230 120-5 12M246 135l-5 12M55 153l-5 12"/></g>';
    }

    if (snow) {
      let snowCoat = '<path d="M112 139Q160 119 208 139l18 113-31 13h-70l-31-13 18-113Z" fill="' + snow.color + '"/><path d="m113 145-23 13-21 59 19 8 34-48M207 145l23 13 21 59-19 8-34-48" fill="' + snow.color + '"/>';
      if (snow.style === "fleece") snowCoat += '<path d="M121 153h78M118 166h84M116 179h88" stroke="' + snow.accent + '" stroke-width="4" stroke-linecap="round"/>';
      if (snow.style === "quilted") snowCoat += '<path d="M115 164h90M113 185h94M112 206h96M111 227h98" stroke="' + snow.accent + '" stroke-width="3"/>';
      snowLayer = '<g>' + snowCoat + '<path d="m143 137 17 20 17-20M160 157v102" fill="none" stroke="' + snow.accent + '" stroke-width="4"/><path d="M135 133q25 12 50 0l-4 23h-42Z" fill="' + snow.accent + '"/><path d="M123 309h28l-4 21h-34q-6-10 10-21ZM169 309h28l11 21h-34Z" fill="' + snow.color + '" stroke="' + snow.accent + '" stroke-width="3"/><path d="M121 75q2-35 39-35t39 35h-78Z" fill="' + snow.accent + '"/><path d="M118 76h84" stroke="' + snow.color + '" stroke-width="7"/><g fill="#fffdf7" opacity=".9"><circle cx="54" cy="126" r="3"/><circle cx="251" cy="108" r="2.5"/><circle cx="248" cy="182" r="3"/><circle cx="62" cy="211" r="2"/></g></g>';
    }

    const outerwear = rainLayer || snowLayer;
    const outfitDescription = outfit.name + (rain ? " with " + rain.name : snow ? " with " + snow.name : "");
    return '<svg viewBox="0 0 320 350" role="img" aria-label="Original character wearing ' + outfitDescription + '" xmlns="http://www.w3.org/2000/svg"><ellipse cx="160" cy="329" rx="82" ry="9" fill="#91aaa0" opacity=".34"/><path d="M111 151q-29 12-31 49l8 23 17-8 9-37M209 151q29 12 31 49l-8 23-17-8-9-37" fill="#dba77f" stroke="#bb825d" stroke-width="2"/><path d="M111 140Q160 123 209 140l17 88-29 16h-74l-29-16 17-88Z" fill="' + top + '"/><path d="M125 239h70v28h-70Z" fill="' + bottom + '"/>' + legs + clothes + detail + '<circle cx="160" cy="79" r="43" fill="#e5b58d"/><path d="M117 77q0-53 44-53 44 0 43 53l-9-10-5-21q-29 18-69 7l-4 24Z" fill="#4f413c"/><path d="M120 56q17-36 52-29 22 5 31 31" fill="none" stroke="#4f413c" stroke-width="10" stroke-linecap="round"/><path d="M143 83h1M177 83h1" stroke="#3d4040" stroke-width="5" stroke-linecap="round"/><path d="M152 99q8 7 16 0" fill="none" stroke="#a65f4d" stroke-width="2.5" stroke-linecap="round"/><path d="M121 112q12 14 39 14t39-14" fill="none" stroke="#d29c76" stroke-width="2"/>' + outerwear + "</svg>";
  }

  function reminderIcon(type) {
    const shapes = {
      rain: '<path d="M5 12a6 6 0 0 1 11-3 4 4 0 0 1 0 8H6a3 3 0 0 1-1-5Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m8 20-1 2m6-2-1 2m6-2-1 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      sun: '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m13 13L18 18M19 5l-1.5 1.5m-13 13L6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      water: '<path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 16a3 3 0 0 0 3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      layer: '<path d="m12 3 8 4-8 4-8-4 8-4Zm-8 8 8 4 8-4m-16 5 8 4 8-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
      coolLayer: '<path d="M5 6h14M5 11h11M5 16h8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="m17 16 2.5 2.5L22 16m-2.5 2.5V9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
      storm: '<path d="M5 13a6 6 0 0 1 11-3 4 4 0 0 1 0 8H6a3 3 0 0 1-1-5Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m13 17-3 4h3l-1 3 5-6h-3l2-2" fill="currentColor"/>',
      snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10M9 4l3 2 3-2m-6 16 3-2 3 2M4 10l3-.2.8-3m12.2 10.2-3 .2-.8 3m-12.2 0 .8-3-2.8-1.8m17-5.4-.8 3 2.8 1.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (shapes[type] || shapes.layer) + "</svg>";
  }

  function setBusy(busy) {
    elements.refreshButton.disabled = busy || !forecast;
    elements.dateInput.disabled = busy || !forecast;
    elements.geolocateButton.disabled = busy;
    const submitButton = elements.locationForm.querySelector('button[type="submit"]');
    submitButton.disabled = busy;
    elements.locationInput.disabled = busy;
  }

  async function requestJson(url, signal) {
    const response = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error("Weather service returned HTTP " + response.status + ". Please retry in a moment.");
    }
    try {
      return await response.json();
    } catch (error) {
      throw new Error("Weather service returned unreadable data. Please retry.");
    }
  }

  async function loadWeather(location) {
    const requestId = ++requestNumber;
    currentLocation = location;
    forecast = null;
    selectedDate = null;
    clearError();
    elements.weatherContent.hidden = true;
    elements.forecastStrip.hidden = true;
    elements.searchResults.hidden = true;
    setBusy(true);
    setStatus("Getting the latest forecast for " + locationLabel(location) + "…");

    const controller = new AbortController();
    const timeout = window.setTimeout(function () { controller.abort(); }, 15000);
    const params = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      current: "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
      hourly: "temperature_2m,precipitation_probability,precipitation,weather_code,uv_index",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,sunrise,sunset",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
      timezone: "auto",
      forecast_days: "7"
    });

    try {
      const payload = await requestJson("https://api.open-meteo.com/v1/forecast?" + params.toString(), controller.signal);
      if (requestId !== requestNumber) return;
      if (!payload.daily || !Array.isArray(payload.daily.time) || !payload.daily.time.length) {
        throw new Error("The weather service did not return a usable daily forecast. Please retry.");
      }
      forecast = payload;
      selectedDate = payload.daily.time[0];
      elements.dateInput.min = payload.daily.time[0];
      elements.dateInput.max = payload.daily.time[payload.daily.time.length - 1];
      elements.dateInput.value = selectedDate;
      renderForecast();
      const saved = saveLocation(location);
      const storageNote = saved ? "" : " Your browser did not allow saving this location.";
      setStatus("Updated for " + locationLabel(location) + "." + storageNote);
    } catch (error) {
      if (requestId !== requestNumber) return;
      if (error.name === "AbortError") {
        showError("The weather request took too long. Check your connection and try again.", function () {
          loadWeather(currentLocation);
        });
      } else {
        showError(error.message || "Weather could not be loaded. Check your connection and try again.", function () {
          loadWeather(currentLocation);
        });
      }
      setStatus("");
    } finally {
      window.clearTimeout(timeout);
      if (requestId === requestNumber) setBusy(false);
    }
  }

  async function searchLocations(query) {
    const params = new URLSearchParams({
      name: query,
      count: "8",
      language: "en",
      format: "json",
      countryCode: "US"
    });
    setStatus("Searching US places…");
    clearError();
    try {
      const data = await requestJson("https://geocoding-api.open-meteo.com/v1/search?" + params.toString());
      const results = Array.isArray(data.results)
        ? data.results.filter(function (item) { return item.country_code === "US"; })
        : [];
      renderSearchResults(results);
      setStatus(results.length ? "Choose a place from the search results." : "No US places found. Try a city and state.");
    } catch (error) {
      showError(error.message || "Location search failed. Please try again.", function () {
        searchLocations(query);
      });
      setStatus("");
    }
  }

  function renderSearchResults(results) {
    elements.searchResults.replaceChildren();
    if (!results.length) {
      elements.searchResults.hidden = true;
      return;
    }
    results.forEach(function (result) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-result";
      button.setAttribute("role", "option");
      const name = document.createElement("strong");
      name.textContent = result.name;
      const details = document.createElement("span");
      details.textContent = [result.admin1, result.country].filter(Boolean).join(", ");
      button.append(name, details);
      button.addEventListener("click", function () {
        const location = {
          id: String(result.id),
          name: result.name,
          admin1: result.admin1 || "",
          country: result.country || "United States",
          latitude: result.latitude,
          longitude: result.longitude
        };
        elements.locationInput.value = "";
        loadWeather(location);
      });
      elements.searchResults.append(button);
    });
    elements.searchResults.hidden = false;
  }

  function renderForecast() {
    elements.weatherContent.hidden = false;
    elements.forecastStrip.hidden = false;
    elements.dateInput.value = selectedDate;
    elements.refreshButton.disabled = false;
    try {
      const recommendation = WeatherWardrobe.buildRecommendation(currentLocation, selectedDate, forecast);
      renderRecommendation(recommendation);
      renderForecastDays();
    } catch (error) {
      elements.weatherContent.hidden = true;
      showError(error.message || "The selected forecast is incomplete. Choose another date or refresh.", function () {
        loadWeather(currentLocation);
      });
    }
  }

  function renderRecommendation(state) {
    const today = state.date === forecast.daily.time[0];
    elements.selectedDateLabel.textContent = (today ? "Today · " : "") + formatDate(state.date, { weekday: "long", month: "short", day: "numeric" });
    elements.recommendationTitle.textContent = WeatherWardrobe.describeCategory(state.category);
    elements.recommendationCopy.textContent = state.recommendation;
    elements.weatherDescription.textContent = weatherLabel(state.weather.code);
    elements.weatherIcon.innerHTML = weatherIcon(state.weather.kind);
    elements.characterArt.innerHTML = avatarSvg(state.outfit, state.rain.raining ? state.rain : null, state.snow.snowing ? state.snow : null);
    elements.outfitName.textContent = state.outfit.name + (state.rain.raining ? " + " + state.rain.name : state.snow.snowing ? " + " + state.snow.name : "");
    elements.highTemperature.textContent = formatTemperature(state.forecast.high);
    elements.lowTemperature.textContent = formatTemperature(state.forecast.low);
    document.getElementById("temperature-label").textContent = today ? "Forecast high" : "Daytime high";
    elements.rainProbability.textContent = Number.isFinite(state.forecast.precipitationProbability)
      ? Math.round(state.forecast.precipitationProbability) + "%"
      : "No data";
    elements.uvIndex.textContent = Number.isFinite(state.forecast.uv) ? String(Math.round(state.forecast.uv)) : "No data";

    if (state.current) {
      elements.currentReading.hidden = false;
      const apparent = Number.isFinite(state.current.apparentTemperature)
        ? " · feels like " + Math.round(state.current.apparentTemperature) + "°"
        : "";
      const observationTime = formatLocalTime(state.current.time);
      elements.currentReading.textContent = "Current" + (observationTime ? " (" + observationTime + ")" : "") + ": " + formatTemperature(state.current.temperature) + apparent;
      elements.windSpeed.textContent = Number.isFinite(state.current.windSpeed)
        ? Math.round(state.current.windSpeed) + " mph"
        : "No data";
    } else {
      elements.currentReading.hidden = true;
      elements.windSpeed.textContent = "Today only";
    }

    renderReminders(state.reminders);
    if (state.travelWindow) {
      elements.travelWindowCopy.textContent = state.travelWindow.label + " has the lowest forecast rain chance in a two-hour stretch. Forecast average: " + state.travelWindow.probability + "%. It's a planning tip, not a guarantee.";
      elements.travelProbability.textContent = state.travelWindow.probability + "%";
      elements.travelProbability.setAttribute("aria-label", "Average precipitation chance " + state.travelWindow.probability + " percent");
    } else {
      elements.travelWindowCopy.textContent = "Hourly rain data is not available for this date.";
      elements.travelProbability.textContent = "—";
      elements.travelProbability.setAttribute("aria-label", "No hourly precipitation estimate");
    }
  }

  function renderReminders(reminders) {
    elements.reminderList.replaceChildren();
    if (!reminders.length) {
      const item = document.createElement("li");
      item.className = "reminder-empty";
      item.textContent = "No extra weather reminders for this forecast.";
      elements.reminderList.append(item);
      return;
    }
    reminders.forEach(function (reminder) {
      const item = document.createElement("li");
      item.className = "reminder-item";
      const icon = document.createElement("span");
      icon.className = "reminder-symbol";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = reminderIcon(reminder.type);
      const text = document.createElement("span");
      text.textContent = reminder.message;
      item.append(icon, text);
      elements.reminderList.append(item);
    });
  }

  function renderForecastDays() {
    elements.forecastDays.replaceChildren();
    forecast.daily.time.forEach(function (date, index) {
      const button = document.createElement("button");
      const code = forecast.daily.weather_code && forecast.daily.weather_code[index];
      const high = forecast.daily.temperature_2m_max && forecast.daily.temperature_2m_max[index];
      button.type = "button";
      button.className = "forecast-day";
      button.setAttribute("aria-pressed", String(date === selectedDate));
      button.setAttribute("aria-label", formatDate(date, { weekday: "long", month: "long", day: "numeric" }) + ", high " + formatTemperature(high) + ". Show forecast.");
      const dayName = document.createElement("span");
      dayName.className = "forecast-day-name";
      dayName.textContent = index === 0 ? "Today" : formatDate(date, { weekday: "short" });
      const icon = document.createElement("span");
      icon.className = "forecast-day-icon";
      icon.innerHTML = weatherIcon(WeatherWardrobe.weatherKind(code));
      const temperature = document.createElement("span");
      temperature.className = "forecast-day-temp";
      temperature.textContent = formatTemperature(high);
      button.append(dayName, icon, temperature);
      button.addEventListener("click", function () {
        selectDate(date);
      });
      elements.forecastDays.append(button);
    });
  }

  function selectDate(date) {
    if (!forecast || !forecast.daily.time.includes(date)) {
      elements.dateInput.value = selectedDate || "";
      showError("That date is outside the available forecast. Choose one of the listed days.");
      return;
    }
    selectedDate = date;
    clearError();
    setStatus("Showing the forecast for " + formatDate(date, { weekday: "long", month: "long", day: "numeric" }) + ".");
    renderForecast();
  }

  function useDeviceLocation() {
    clearError();
    if (!navigator.geolocation) {
      showError("This browser does not support device location. Search for a US city or state instead.");
      return;
    }
    setBusy(true);
    setStatus("Waiting for your location permission…");
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const location = {
          id: "device-location",
          name: "My location",
          admin1: "",
          country: "",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        loadWeather(location);
      },
      function (error) {
        const reasons = {
          1: "Location permission was denied. Search for a US city or state instead.",
          2: "Your device could not determine a location. Search for a US city or state instead.",
          3: "Location lookup timed out. Try again or search for a US city or state."
        };
        showError(reasons[error.code] || "Location is unavailable. Search for a US city or state instead.");
        setStatus("");
        setBusy(false);
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    );
  }

  function showAbout() {
    elements.mainScreen.hidden = true;
    elements.aboutScreen.hidden = false;
    elements.backButton.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showMain() {
    elements.aboutScreen.hidden = true;
    elements.mainScreen.hidden = false;
    elements.aboutButton.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  elements.locationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = elements.locationInput.value.trim();
    if (query.length < 2) {
      showError("Enter at least two characters to search for a US place.");
      return;
    }
    searchLocations(query);
  });

  elements.dateInput.addEventListener("change", function () {
    if (elements.dateInput.value) selectDate(elements.dateInput.value);
  });

  elements.refreshButton.addEventListener("click", function () {
    loadWeather(currentLocation);
  });

  elements.geolocateButton.addEventListener("click", useDeviceLocation);
  elements.aboutButton.addEventListener("click", showAbout);
  elements.backButton.addEventListener("click", showMain);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !elements.aboutScreen.hidden) showMain();
  });

  loadWeather(currentLocation);
})();
