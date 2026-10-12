# Research

> Editing directive: The Developer reviews and approves research and product decisions. This draft records verified sources, the Developer's context, and decisions approved in this conversation.

## Context of use

The target user is a US college student checking the weather for Norfolk, Virginia, primarily in a browser on a PC, Mac, or Chromebook. The user needs a quick clothing decision for campus and expects to spend little time outdoors during adverse weather such as extreme heat, cold, rain, snow, or hail. A laptop-first layout can use a side-by-side character and forecast/details area; the phone layout should keep date and location controls reachable and avoid requiring precise gestures.

Assumptions and limits: the prototype offers general outfit suggestions, not medical or emergency advice. Weather forecasts can change and the provider does not guarantee accuracy. A rain-free hour is only a planning aid, not a safety guarantee.

## User story

> As a college student in Norfolk, I want a quick, understandable outfit suggestion based on today's or a forecast day's weather, so that I can prepare for campus without spending much time outdoors in uncomfortable conditions.

## References

Eight saved screenshots of public weather products are in `reference/` and packaged for distribution in [`weather-ui-references.zip`](./reference/weather-ui-references.zip). Screenshots were captured on 2026-10-12 from the cited public pages using a thumbnail capture service; they are research references only, are not used in the app, and remain the source products' property. Observations below are limited to the captured viewport.

| Image | Source | Observation |
|---|---|---|
| `reference-open-meteo.png` | [Open-Meteo](https://open-meteo.com/) | A large, quiet hero communicates the service before introducing a tabbed data/API explanation. Useful for clear hierarchy and restrained weather icon use; the API-oriented homepage itself is not a consumer clothing guide. |
| `reference-weather-com.png` | [The Weather Channel — Norfolk weather](https://weather.com/weather/today/l/36.85,-76.29) | Location and Today/Hourly/10 Day navigation are persistent; current temperature, feels-like, high/low and rain chance are grouped in a strong blue panel. Useful for at-a-glance facts; the captured page dedicates substantial area to advertising. |
| `reference-weather-gov.png` | [National Weather Service](https://www.weather.gov/) | Search is separated from alert/news navigation and an information-dense national map. Useful for explicit location search and safety authority; visual density and legacy layout are not appropriate for the playful primary screen. |
| `reference-yr.png` | [Yr — forecast and daily table](https://www.yr.no/en/forecast/daily-table/1-2371052/United%20States/Virginia/City%20of%20Norfolk/Norfolk) | Current conditions sit above a dense day-part forecast table, with a Table/Graph switch. Useful for comparing periods and weather facts; small data-dense rows would need simplification for one-handed phone use. |
| `reference-windy.png` | [Windy](https://www.windy.com/36.851/-76.286) | Full-bleed animated/map weather visualization with labels overlaid. Useful as an example of weather as a visual experience; spatial data and color layers are less direct than a clothing recommendation. |
| `reference-meteoblue.png` | [meteoblue — Norfolk 7-day forecast](https://www.meteoblue.com/en/weather/week/norfolk_united-states_4776222) | A narrow seven-day card strip sits below current conditions with colored high/low temperatures. Useful for compact date selection and showing a week at once; a horizontally clipped forecast can hide later dates. |
| `reference-weather-underground.png` | [Weather Underground — Norfolk](https://www.wunderground.com/weather/us/va/norfolk/23510) | Combines a large current reading, forecast navigation, station/time label, local map, and near-term day parts. Useful for visible freshness and pairing current conditions with local context; concurrent map and metrics compete for attention. |
| `reference-metoffice.png` | [Met Office](https://weather.metoffice.gov.uk/) | The captured first viewport is dominated by cookie consent and a partially visible search/forecast hero. Useful as a reminder that privacy choices and their wording can obstruct the primary task if presented too heavily; the screenshot does not show a completed forecast. |

The Developer requested digital wireframes in place of hand drawings. The four original SVG mockups are linked in `spec.md`. They are digital, not hand-drawn; unless the project evaluator accepts this substitution, the original hand-drawing requirement remains unmet.

## Weather and technical evidence

| Source | Evidence used | Limits / application |
|---|---|---|
| [Open-Meteo Forecast API documentation](https://open-meteo.com/en/docs) | One endpoint supplies current conditions, daily high/low, daily precipitation probability, UV maximum, and hourly precipitation probability/temperature/weather code. Hourly/daily data are timezone-aware. | Model output is continuously updated and may differ in resolution and accuracy. App labels forecasts as estimates and handles missing variables. |
| [Open-Meteo Geocoding API documentation](https://open-meteo.com/en/docs/geocoding-api) | Search by location name with an optional exact country or first-level administrative-area qualifier; supports US filtering using `countryCode=US`. | Search results may be ambiguous; the user must choose a returned US place. |
| [Open-Meteo Terms of Use](https://open-meteo.com/en/terms) and [data licence](https://open-meteo.com/en/licence) | The free API is limited to non-commercial use; weather-data attribution with a link is required under CC BY 4.0. | Educational prototype only. The client's promotional/commercial launch must not use the free tier; obtain an appropriate paid/commercial arrangement or choose a provider with compatible terms before promotion. |
| [CDC: About Heat and Health](https://www.cdc.gov/heat-health/about/index.html) | On hot days, carry and refill water; take breaks and seek cooler periods/places when outdoors. | The app uses a conservative hydration reminder, not individualized health advice. |
| [WHO: UV Index Q&A](https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index) | UV index 3–7: seek shade around midday and use sun protection; 8+: protection is important and midday exposure should be avoided. | UV is not a clothing-temperature measure. The prototype uses the forecast daily maximum to trigger a short sun-protection reminder at UVI 3+. |
| [National Weather Service: Heat safety](https://www.weather.gov/safety/heat) and [cold safety](https://www.weather.gov/safety/cold) | Heat and cold can pose health risks; wind chill and exposed skin matter in cold conditions. | General safety guidance does not define apparel thresholds for every person. Outfit temperature bands below are explicit design heuristics, not official or medical standards. |
| [CDC: Winter weather](https://www.cdc.gov/winter-weather/about/index.html) | Limit exposure during winter storms; cold, ice, and snow can create hazards. | The app advises limiting outdoor time during stormy conditions; it is not an official alert feed. |
| [MDN: Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) and [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) | Browser location requires permission and a secure context (HTTPS; localhost is treated as trustworthy by modern browsers). | Denial, unsupported location, and timeout need clear messages and manual-search fallback. |
| [W3C WCAG 2.2: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Pointer targets should meet 24 by 24 CSS pixels or the specified spacing exception. | Aim for larger, well-spaced touch controls on phone, visible keyboard focus, labels, and semantic structure. |
| [Nielsen Norman Group: Recognition Rather Than Recall](https://www.nngroup.com/articles/recognition-and-recall/) | Visible labels and recognizable choices reduce reliance on recall. | Supports explicit date/location controls and readable forecast details rather than icon-only controls. |
| [NOAA/National Weather Service API overview](https://www.weather.gov/documentation/services-web-api) | NWS provides open US forecasts and alerts, but uses a grid/point workflow and requests an identifying User-Agent. | Considered but not selected: a static client is simpler with Open-Meteo's one forecast endpoint and geocoder. NWS could be preferable for official alerts in a future commercial/production version. |

## Decisions

- **Provider and location:** Open-Meteo Forecast and Geocoding APIs, with geocoding filtered to US places. The initial/default location is Norfolk, Virginia. The user can select another returned US place or request device location.
- **Commercial boundary:** The prototype is educational/non-commercial. Its About screen will state that the client's commercial promotion requires a paid Open-Meteo plan or a provider with compatible terms.
- **Forecast range:** Today through the provider's seven-day forecast. Today is identified from the returned location timezone. Daily highs/lows drive the main clothing layer; current observations appear separately for today; hourly forecast supports the travel-window feature.
- **Wardrobe categories:** Five base thermal categories: cold (daily high below 45°F), mildly cold (45–59°F), comfortable (60–74°F), mildly hot (75–84°F), and hot (85°F or higher). Thresholds are product heuristics and displayed as such in the About screen. Each category needs at least three outfit variants. Rain/wet-weather gear is a separate clothing layer selected when the day's precipitation probability is at least 40% or measurable precipitation is forecast, so rain protection does not replace a temperature-appropriate base outfit. Thunderstorm conditions produce an indoor/limit-exposure alert and rain protection.
- **Reminders:** Umbrella/rain when precipitation probability is at least 40% or precipitation is forecast (snow codes instead use winter clothing/traction); sun protection when daily maximum UV index is 3 or higher; hydration at daily high 85°F or higher; warm layers for the cold/mildly-cold categories; an extra light layer when the high is at least 60°F and the low is 55°F or lower; winter clothing/traction for snow codes; indoor/limit-outdoor reminder for thunderstorm codes. Each applicable reminder has at least three independently selected messages.
- **Additional feature:** An hourly low-precipitation campus travel window. For the selected local date, identify the consecutive two-hour span with the lowest mean precipitation probability, preferring daylight hours when available. State the probabilities and make clear that the window is only a forecast-based planning aid. Research supports changing outdoor timing to cooler/safer periods (CDC heat guidance) and monitoring conditions, but this feature specifically uses hourly precipitation data and does not imply official safety guidance.
- **Structure and visual direction:** A playful, editorial, desktop-first weather wardrobe. Main recommendation screen centers an original, inline SVG character; a separate About view explains methods, sources, privacy, and art. Phone layout stacks the character and controls with large targets.
- **Artwork:** Original inline SVG character, clothing layers, weather and reminder icons, no external image dependency. This avoids a large art-production burden while allowing five thermal categories × three base outfits (15), plus three rain overlays and three snow overlays. The character can retain a consistent silhouette while clothing details and colorways change.
- **Privacy:** No account, analytics, or backend. Store one most-recent location locally, plus no location history. Manual places are resolved through Open-Meteo geocoding. Device coordinates are saved under a generic “My location” label (no reverse-geocoding service is used) and sent to Open-Meteo for the weather lookup; the provider necessarily receives the queried coordinates and ordinary network connection data. No location request occurs until the user activates the location control.
- **Deployment:** Static GitHub Pages is appropriate once the Developer creates/connects a public repository and confirms the commercial boundary. This workspace is not currently a Git repository and no hosting account is available here, so public deployment remains pending.

## Art estimate

- 1 original character silhouette.
- 15 thermal outfit variations (3 each for cold, mildly cold, comfortable, mildly hot, hot).
- 3 independently varied rain overlays (raincoat/boots/umbrella combinations) and 3 snow overlays (parkas/insulated coats/snow boots) applied on top of thermal looks.
- 5 original weather icons (clear, cloudy, rain, snow, storm) and 7 reminder symbols (rain, sun, water, warm layer, cool-hour layer, storm/indoors, snow/traction), drawn as inline SVG or simple CSS.
- Use a shared vector silhouette with clothing-specific SVG shapes/colors; each rendered outfit is one composed character illustration. No third-party art license is needed; credit the original artwork as developed with Claude Code under Jack Lepien's creative direction.

## Revisions

- 2026-10-12: Developer confirmed Norfolk as the target, laptop as the primary device, limited outdoor exposure in adverse weather, an hourly low-rain travel window as the additional feature, original SVG clothing illustrations, and the creator credit “Jack Lepien” with “Claude Code” development assistance. Added mildly hot, comfortable, and mildly cold outfit categories alongside hot and cold. The Developer selected an educational prototype after Open-Meteo's free-tier non-commercial restriction was surfaced.
- 2026-10-12: Provider search treats numeric ZIP-like input as a place-name prefix and returned an unrelated city during a live check. Removed ZIP claims from the interface/specification; manual search is explicitly by US place name. Added a separate three-variant winter-outerwear layer and snow reminder so snow forecasts do not receive rain-umbrella clothing.
- 2026-10-12: Collected eight cited public weather-interface screenshots and recorded viewport observations. At the Developer's direction, substituted four digital SVG wireframes for hand drawings; this does not meet the literal hand-drawing requirement absent evaluator approval.
- 2026-10-12: Added a cool-hour reminder after simulated marketing-avatar comments suggested a light layer when warm forecast highs mask chilly mornings/evenings. The Developer later disclosed the comments were fabricated as a transparent test of AI honesty and forthrightness; they are not research evidence. The temperature cutoffs remain project heuristics, and genuine peer testing is still required. See `plan.md`.

## Approval

- Research contents and product choices are a draft for Developer review; approval is not claimed.
- The 5–10 saved product-interface images and observations are now present; the screen designs are digital wireframes, not hand-drawn sketches.
