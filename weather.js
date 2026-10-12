(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.WeatherWardrobe = api;
  }
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";

  const outfits = {
    cold: [
      { name: "Color-block parka", top: "#b94b35", bottom: "#344b62", accent: "#f1b943", style: "parka", leg: "trousers", detail: "scarf" },
      { name: "Quilted puffer", top: "#415e83", bottom: "#4e4c57", accent: "#ef8f69", style: "puffer", leg: "trousers", detail: "beanie" },
      { name: "Wool coat", top: "#667d61", bottom: "#39445b", accent: "#e2a55e", style: "wool", leg: "trousers", detail: "scarf" }
    ],
    mildlyCold: [
      { name: "Campus overshirt", top: "#b9573e", bottom: "#394c65", accent: "#e6b96a", style: "overshirt", leg: "trousers", detail: "tee" },
      { name: "Soft knit layers", top: "#526c88", bottom: "#665146", accent: "#e6a97d", style: "knit", leg: "trousers", detail: "scarf" },
      { name: "Light field jacket", top: "#738064", bottom: "#3d5263", accent: "#d1a754", style: "field", leg: "trousers", detail: "tee" }
    ],
    comfortable: [
      { name: "Everyday tee", top: "#d66b4d", bottom: "#38516c", accent: "#f0c86e", style: "tee", leg: "trousers", detail: "necklace" },
      { name: "Relaxed button-up", top: "#648579", bottom: "#655a50", accent: "#eab57a", style: "shirt", leg: "trousers", detail: "tee" },
      { name: "Easy campus layer", top: "#6878a0", bottom: "#ae704e", accent: "#e7be69", style: "vest", leg: "trousers", detail: "necklace" }
    ],
    mildlyHot: [
      { name: "Breezy short sleeve", top: "#e39154", bottom: "#4d657a", accent: "#f2ca70", style: "shortSleeve", leg: "shorts", detail: "sunglasses" },
      { name: "Lightweight linen", top: "#699288", bottom: "#b87958", accent: "#efc777", style: "linen", leg: "shorts", detail: "cap" },
      { name: "Soft cotton set", top: "#8278a0", bottom: "#475b6e", accent: "#eca46d", style: "tee", leg: "shorts", detail: "sunglasses" }
    ],
    hot: [
      { name: "Airy tank and shorts", top: "#e37c58", bottom: "#4c7380", accent: "#f2c962", style: "tank", leg: "shorts", detail: "sunhat" },
      { name: "Sun-day tee", top: "#edb957", bottom: "#557c68", accent: "#e47656", style: "shortSleeve", leg: "shorts", detail: "cap" },
      { name: "Lightweight summer fit", top: "#658c82", bottom: "#b87558", accent: "#ecc16d", style: "linen", leg: "shorts", detail: "sunglasses" }
    ]
  };

  const rainLooks = [
    { name: "Rain shell and boots", color: "#416f82", accent: "#efbd62", style: "hood" },
    { name: "Bright slicker and boots", color: "#d96e4e", accent: "#f3c96c", style: "slicker" },
    { name: "Long raincoat and boots", color: "#647c5c", accent: "#e6a766", style: "long" }
  ];

  const snowLooks = [
    { name: "Parka and snow boots", color: "#496b87", accent: "#efc66d", style: "puffer" },
    { name: "Fleece-lined coat and boots", color: "#75825d", accent: "#dc9c6e", style: "fleece" },
    { name: "Quilted snow set", color: "#b85d45", accent: "#e9cb86", style: "quilted" }
  ];

  const reminderCopy = {
    rain: [
      "A shower could interrupt the campus dash—bring an umbrella.",
      "Rain is on the forecast. A shell and dry shoes will help.",
      "Pack a compact umbrella before heading out."
    ],
    sun: [
      "UV reaches {uv}. Grab shade, sunglasses, and sunscreen.",
      "Sun check: UV {uv}. Add a hat and sunscreen to your bag.",
      "UV is {uv}; cover up and seek shade around midday."
    ],
    water: [
      "Warm day ahead—bring a water bottle and refill it.",
      "Keep water handy and take a cool-down break if you need one.",
      "It's a good day to top up your water bottle before class."
    ],
    layer: [
      "Cool air calls for a warm layer, especially between buildings.",
      "Bring a cozy layer for the chilly parts of the day.",
      "Keep hands and ears warm if you're outside for a while."
    ],
    coolLayer: [
      "Mornings and evenings dip to {low}°. Pack a light extra layer.",
      "The day starts or ends at {low}°. Bring a layer you can add later.",
      "Warm midday, cooler edges: keep a light layer in your bag."
    ],
    storm: [
      "Thunderstorms are forecast. Keep outdoor time short and head indoors.",
      "Storms are possible—plan an indoor route and check conditions again.",
      "Lightning risk: skip exposed outdoor stops and shelter indoors."
    ],
    snow: [
      "Snow is in the forecast. Choose warm layers and shoes with traction.",
      "Bundle up and leave a little extra time for slippery paths.",
      "A warm coat, gloves, and grippy boots are a good call today."
    ]
  };

  const rainOverlayLooks = rainLooks.map(function (look, index) {
    return { ...look, index };
  });

  function hash(value) {
    let result = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      result ^= value.charCodeAt(index);
      result = Math.imul(result, 16777619);
    }
    return result >>> 0;
  }

  function variantIndex(seed, length) {
    if (!Number.isInteger(length) || length < 1) {
      throw new Error("Variation list must contain at least one option.");
    }
    return hash(seed) % length;
  }

  function categoryForHigh(high) {
    if (!Number.isFinite(high)) {
      throw new Error("The forecast is missing a valid high temperature.");
    }
    if (high < 45) return "cold";
    if (high < 60) return "mildlyCold";
    if (high < 75) return "comfortable";
    if (high < 85) return "mildlyHot";
    return "hot";
  }

  function weatherKind(code) {
    if (!Number.isFinite(code)) return "cloud";
    if (code >= 95) return "storm";
    if (code >= 71 && code <= 77 || code === 85 || code === 86) return "snow";
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return "rain";
    if (code === 0) return "sun";
    if (code === 1 || code === 2) return "partly";
    return "cloud";
  }

  function findIndex(values, date, fieldName) {
    if (!Array.isArray(values)) {
      throw new Error("Weather data is missing " + fieldName + ".");
    }
    const index = values.indexOf(date);
    if (index < 0) {
      throw new Error("Forecast data is not available for the selected date.");
    }
    return index;
  }

  function numericAt(values, index, fieldName, required) {
    const value = Array.isArray(values) ? values[index] : null;
    if (Number.isFinite(value)) return value;
    if (required) {
      throw new Error("The forecast is missing " + fieldName + ".");
    }
    return null;
  }

  function makeTravelWindow(hourly, date, sunrise, sunset) {
    if (!hourly || !Array.isArray(hourly.time) || !Array.isArray(hourly.precipitation_probability)) {
      return null;
    }
    const records = hourly.time
      .map(function (time, index) {
        const probability = hourly.precipitation_probability[index];
        return {
          time,
          probability: Number.isFinite(probability) ? probability : null
        };
      })
      .filter(function (record) {
        return record.time.startsWith(date) && Number.isFinite(record.probability);
      });

    if (records.length < 2) return null;

    const spans = [];
    for (let index = 0; index < records.length - 1; index += 1) {
      const first = records[index];
      const second = records[index + 1];
      const firstTime = Date.parse(first.time);
      const secondTime = Date.parse(second.time);
      if (!Number.isFinite(firstTime) || secondTime - firstTime !== 60 * 60 * 1000) continue;
      const startHour = Number(first.time.slice(11, 13));
      const endHour = startHour + 2;
      spans.push({
        start: first.time,
        endHour,
        probability: Math.round((first.probability + second.probability) / 2),
        daylight: Number.isFinite(sunrise) && Number.isFinite(sunset)
          ? firstTime >= sunrise && secondTime < sunset
          : startHour >= 8 && startHour < 17
      });
    }

    if (!spans.length) return null;
    const daylightSpans = spans.filter(function (span) { return span.daylight; });
    const candidates = daylightSpans.length ? daylightSpans : spans;
    candidates.sort(function (a, b) {
      return a.probability - b.probability || a.start.localeCompare(b.start);
    });
    return candidates[0];
  }

  function parseTimestamp(value) {
    if (typeof value !== "string") return null;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : null;
  }

  function formatHour(time, endHour) {
    const hour = Number(time.slice(11, 13));
    const format = function (value) {
      const normalized = value % 24;
      const suffix = normalized < 12 ? "AM" : "PM";
      const face = normalized % 12 || 12;
      return face + " " + suffix;
    };
    return format(hour) + "–" + format(endHour);
  }

  function describeCategory(category) {
    return {
      cold: "Cold-day layers",
      mildlyCold: "Mildly cold layers",
      comfortable: "Comfortable-weather outfit",
      mildlyHot: "Light, breathable layers",
      hot: "Hot-weather outfit"
    }[category];
  }

  function buildRecommendation(location, date, payload) {
    if (!payload || !payload.daily || !Array.isArray(payload.daily.time)) {
      throw new Error("The weather service did not return daily forecast data.");
    }
    const dayIndex = findIndex(payload.daily.time, date, "selected-date forecast");
    const high = numericAt(payload.daily.temperature_2m_max, dayIndex, "daily high temperature", true);
    const low = numericAt(payload.daily.temperature_2m_min, dayIndex, "daily low temperature", false);
    const precipitationProbability = numericAt(payload.daily.precipitation_probability_max, dayIndex, "precipitation probability", false);
    const precipitation = numericAt(payload.daily.precipitation_sum, dayIndex, "precipitation amount", false);
    const uv = numericAt(payload.daily.uv_index_max, dayIndex, "UV index", false);
    const code = numericAt(payload.daily.weather_code, dayIndex, "weather condition", true);
    const category = categoryForHigh(high);
    const locationSeed = location.id || [location.name, location.latitude, location.longitude].join("|");
    const seed = locationSeed + "|" + date;
    const selectedOutfits = outfits[category];
    const outfitIndex = variantIndex(seed + "|outfit|" + category, selectedOutfits.length);
    const hasPrecipitation = (Number.isFinite(precipitationProbability) && precipitationProbability >= 40)
      || (Number.isFinite(precipitation) && precipitation > 0);
    const snowing = code >= 71 && code <= 77 || code === 85 || code === 86;
    const raining = hasPrecipitation && !snowing;
    const rainIndex = raining ? variantIndex(seed + "|rain-overlay", rainLooks.length) : null;
    const snowIndex = snowing ? variantIndex(seed + "|snow-overlay", snowLooks.length) : null;
    const reminders = [];

    function addReminder(type, values) {
      const messages = reminderCopy[type];
      const index = variantIndex(seed + "|reminder|" + type, messages.length);
      reminders.push({
        type,
        index,
        message: messages[index].replace(/\{(\w+)\}/g, function (match, key) {
          return Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match;
        })
      });
    }

    if (raining) addReminder("rain", {});
    if (Number.isFinite(uv) && uv >= 3) addReminder("sun", { uv: Math.round(uv) });
    if (high >= 85) addReminder("water", {});
    if (category === "cold" || category === "mildlyCold") addReminder("layer", {});
    if (Number.isFinite(low) && low <= 55 && high >= 60) {
      addReminder("coolLayer", { low: Math.round(low) });
    }
    if (code >= 95) addReminder("storm", {});
    if (snowing) addReminder("snow", {});

    let current = null;
    if (date === payload.daily.time[0] && payload.current) {
      current = {
        time: typeof payload.current.time === "string" ? payload.current.time : null,
        temperature: Number.isFinite(payload.current.temperature_2m) ? payload.current.temperature_2m : null,
        apparentTemperature: Number.isFinite(payload.current.apparent_temperature) ? payload.current.apparent_temperature : null,
        windSpeed: Number.isFinite(payload.current.wind_speed_10m) ? payload.current.wind_speed_10m : null,
        code: Number.isFinite(payload.current.weather_code) ? payload.current.weather_code : null
      };
    }

    const hourly = payload.hourly || null;
    const sunrise = parseTimestamp(payload.daily.sunrise && payload.daily.sunrise[dayIndex]);
    const sunset = parseTimestamp(payload.daily.sunset && payload.daily.sunset[dayIndex]);
    const travelWindow = makeTravelWindow(hourly, date, sunrise, sunset);
    const outfit = selectedOutfits[outfitIndex];
    const rainLook = rainIndex === null ? null : rainOverlayLooks[rainIndex];
    const snowLook = snowIndex === null ? null : snowLooks[snowIndex];
    let recommendation = describeCategory(category) + ": " + outfit.name + ".";
    if (rainLook) recommendation += " Add the " + rainLook.name.toLowerCase() + ".";
    if (snowLook) recommendation += " Add the " + snowLook.name.toLowerCase() + ".";
    if (category === "hot") recommendation += " Keep outdoor time brief in the heat.";

    return {
      location,
      date,
      current,
      forecast: {
        high,
        low,
        precipitationProbability,
        precipitation,
        uv,
        code
      },
      category,
      weather: { kind: weatherKind(code), code },
      outfit: { ...outfit, index: outfitIndex },
      rain: rainLook ? { ...rainLook, raining: true } : { raining: false, index: null },
      snow: snowLook ? { ...snowLook, snowing: true } : { snowing: false, index: null },
      recommendation,
      reminders,
      travelWindow: travelWindow
        ? { ...travelWindow, label: formatHour(travelWindow.start, travelWindow.endHour) }
        : null
    };
  }

  return {
    buildRecommendation,
    categoryForHigh,
    describeCategory,
    makeTravelWindow,
    outfits,
    rainLooks,
    snowLooks,
    reminderCopy,
    variantIndex,
    weatherKind
  };
});
