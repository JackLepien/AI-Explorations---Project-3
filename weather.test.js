const test = require("node:test");
const assert = require("node:assert/strict");
const weather = require("./weather.js");

function fixture() {
  return {
    current: {
      temperature_2m: 70,
      apparent_temperature: 68,
      wind_speed_10m: 5,
      weather_code: 1
    },
    daily: {
      time: ["2026-10-12", "2026-10-13"],
      temperature_2m_max: [70, 90],
      temperature_2m_min: [55, 72],
      precipitation_probability_max: [10, 60],
      precipitation_sum: [0, 0.2],
      uv_index_max: [2, 6],
      weather_code: [1, 95],
      sunrise: ["2026-10-12T07:00", "2026-10-13T07:00"],
      sunset: ["2026-10-12T18:30", "2026-10-13T18:30"]
    },
    hourly: {
      time: [
        "2026-10-12T08:00", "2026-10-12T09:00", "2026-10-12T10:00",
        "2026-10-12T11:00", "2026-10-12T12:00", "2026-10-12T13:00"
      ],
      precipitation_probability: [50, 20, 5, 15, 40, 60]
    }
  };
}

const norfolk = {
  id: "norfolk|36.8508|-76.2859",
  name: "Norfolk",
  admin1: "Virginia",
  latitude: 36.8508,
  longitude: -76.2859
};

test("temperature categories have exact inclusive boundaries", () => {
  assert.equal(weather.categoryForHigh(44.9), "cold");
  assert.equal(weather.categoryForHigh(45), "mildlyCold");
  assert.equal(weather.categoryForHigh(59.9), "mildlyCold");
  assert.equal(weather.categoryForHigh(60), "comfortable");
  assert.equal(weather.categoryForHigh(74.9), "comfortable");
  assert.equal(weather.categoryForHigh(75), "mildlyHot");
  assert.equal(weather.categoryForHigh(84.9), "mildlyHot");
  assert.equal(weather.categoryForHigh(85), "hot");
});

test("all thermal categories contain at least three original outfit variants", () => {
  for (const category of ["cold", "mildlyCold", "comfortable", "mildlyHot", "hot"]) {
    assert.equal(weather.outfits[category].length >= 3, true);
  }
  assert.equal(weather.rainLooks.length >= 3, true);
  assert.equal(weather.snowLooks.length >= 3, true);
  for (const messages of Object.values(weather.reminderCopy)) {
    assert.equal(messages.length >= 3, true);
  }
});

test("outfit and reminder variation seeds are independent", () => {
  const pairs = new Set();
  for (let day = 1; day <= 40; day += 1) {
    const date = "2026-10-" + String(day).padStart(2, "0");
    const outfit = weather.variantIndex("place|" + date + "|outfit|comfortable", 3);
    const rainReminder = weather.variantIndex("place|" + date + "|reminder|rain", 3);
    pairs.add(outfit + ":" + rainReminder);
  }
  assert.equal(pairs.size > 3, true);
});

test("same location/date returns stable outfit and independently stable reminders", () => {
  const input = fixture();
  const first = weather.buildRecommendation(norfolk, "2026-10-13", input);
  const second = weather.buildRecommendation(norfolk, "2026-10-13", input);
  assert.equal(first.outfit.index, second.outfit.index);
  assert.equal(first.rain.index, second.rain.index);
  assert.deepEqual(first.reminders, second.reminders);
  assert.deepEqual(first.reminders.map((item) => item.type), ["rain", "sun", "water", "coolLayer", "storm"]);
  assert.match(first.reminders[1].message, /UV [1-9]/);
  assert.match(first.reminders[3].message, /72°/);
});

test("recommendation state includes current conditions only for the first forecast date", () => {
  const input = fixture();
  assert.equal(weather.buildRecommendation(norfolk, "2026-10-12", input).current.temperature, 70);
  assert.equal(weather.buildRecommendation(norfolk, "2026-10-13", input).current, null);
});

test("weather codes map to the intended icon groups", () => {
  assert.equal(weather.weatherKind(0), "sun");
  assert.equal(weather.weatherKind(3), "cloud");
  assert.equal(weather.weatherKind(61), "rain");
  assert.equal(weather.weatherKind(71), "snow");
  assert.equal(weather.weatherKind(95), "storm");
});

test("snow forecasts use winter clothing and avoid an umbrella reminder", () => {
  const input = fixture();
  input.daily.temperature_2m_max[1] = 35;
  input.daily.weather_code[1] = 71;
  input.daily.precipitation_probability_max[1] = 80;
  input.daily.precipitation_sum[1] = 0.2;
  const result = weather.buildRecommendation(norfolk, "2026-10-13", input);
  assert.equal(result.snow.snowing, true);
  assert.equal(result.rain.raining, false);
  assert.equal(result.reminders.some((item) => item.type === "snow"), true);
  assert.equal(result.reminders.some((item) => item.type === "rain"), false);
});

test("warm day with a cool forecast low adds a light-layer reminder", () => {
  const input = fixture();
  input.daily.temperature_2m_max[1] = 79;
  input.daily.temperature_2m_min[1] = 52;
  input.daily.weather_code[1] = 2;
  input.daily.precipitation_probability_max[1] = 0;
  input.daily.precipitation_sum[1] = 0;
  input.daily.uv_index_max[1] = 1;
  const result = weather.buildRecommendation(norfolk, "2026-10-13", input);
  const reminder = result.reminders.find((item) => item.type === "coolLayer");
  assert.match(reminder.message, /52°/);
  assert.equal(result.reminders.some((item) => item.type === "layer"), false);
});

test("cold-day warm-layer reminder is not duplicated by the cool-low rule", () => {
  const input = fixture();
  input.daily.temperature_2m_max[1] = 40;
  input.daily.temperature_2m_min[1] = 25;
  input.daily.weather_code[1] = 3;
  input.daily.precipitation_probability_max[1] = 0;
  input.daily.precipitation_sum[1] = 0;
  const result = weather.buildRecommendation(norfolk, "2026-10-13", input);
  assert.equal(result.reminders.filter((item) => item.type === "layer").length, 1);
  assert.equal(result.reminders.some((item) => item.type === "coolLayer"), false);
});

test("travel window chooses lowest daylight two-hour span", () => {
  const state = weather.buildRecommendation(norfolk, "2026-10-12", fixture());
  assert.equal(state.travelWindow.label, "10 AM–12 PM");
  assert.equal(state.travelWindow.probability, 10);
});

test("missing required weather fields fail clearly", () => {
  assert.throws(
    () => weather.buildRecommendation(norfolk, "2026-10-12", { daily: { time: ["2026-10-12"] } }),
    /daily high temperature/
  );
  assert.throws(() => weather.categoryForHigh(Number.NaN), /valid high temperature/);
});
