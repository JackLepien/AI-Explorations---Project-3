# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the project brief, research draft, and proposed screen designs into testable requirements. Developer approval remains pending.

## Instructions for the Developer

Make and approve the product decisions, draw every proposed screen, provide the drawings to the Agent, and keep this file current as the intended result changes.

To begin, open the project repository in a fresh chat and enter:

`Read ./spec.md and help me begin the Project 3 specification.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, `research.md`, and this file. Review the screen drawings the Developer provides. Ask one focused question at a time, surface gaps and trade-offs without inventing requirements, and keep the specification concise and testable.

## Goal

Help a college student in Norfolk (or another chosen US location) quickly prepare for a campus day by seeing current weather, a temperature-appropriate outfit, weather reminders, and an hourly low-rain travel window.

User story: As a college student, I want a quick, understandable outfit suggestion for today or a forecast day, so that I can prepare for campus while minimizing time outdoors in adverse conditions.

## Screen designs

The Developer requested digital SVG wireframes instead of hand drawings. These are layout mockups, not hand-drawn designs; the original brief's drawing requirement remains unmet unless the evaluator approves the substitution.

- [Main screen — laptop digital wireframe](./reference/mockup-main-laptop.svg)
- [Main screen — phone digital wireframe](./reference/mockup-main-phone.svg)
- [About screen — laptop digital wireframe](./reference/mockup-about-laptop.svg)
- [About screen — phone digital wireframe](./reference/mockup-about-phone.svg)

The wireframes show the proposed layout:

- **Main (laptop):** Wide two-column composition. Location/date and unit context are in the header; a large character is the visual anchor on the left; recommendation, forecast summary, reminders, and hourly travel window are arranged in the right column. Seven-day selector and refresh controls remain visible without crowding the character.
- **Main (phone):** Single-column flow with location and date controls near the top; character and short recommendation next; reminders and travel window below. Large controls and normal vertical scrolling; no essential function requires hover or precise swipe.
- **About:** Separate accessible panel/page from both layouts. Includes creator/development credit, provider attribution and terms caveat, recommendation heuristic and guidance sources, privacy/data handling, and art credit.

## Requirements

1. **Live source:** Get current, hourly, daily and geocoding data from Open-Meteo. Display a linked “Weather data by Open-Meteo.com” credit. **Check:** Network response is live JSON; page labels current observation separately from selected-day forecast and shows units.
2. **Location:** Start with Norfolk, VA. Manual place-name search returns selectable US places only; ZIP-code search is not supported by the chosen geocoder. A user-activated geolocation control requests permission. Save the latest selected location only; no location history. **Check:** Search another US city, choose it, reload and verify it persists; choose a different place and verify it replaces the saved location. Test geolocation allow, deny, unavailable, and timeout.
3. **Dates:** Support today and each available date in the provider's seven-day forecast. Today is identified from the returned location timezone. **Check:** Each date updates forecast, recommendation, icons, reminder conditions, and travel window; unavailable dates cannot be selected.
4. **One recommendation state:** A single derived object from chosen place, date, and weather contains forecast metrics, thermal category, outfit variant, rain overlay, weather icon, recommendation copy, reminders, and low-rain window. All visible content is rendered from this state. **Check:** Change date/location and verify every dependent output changes together; no stale outfit or reminder remains.
5. **Wardrobe categories:** Base clothing categories use the selected date's daily high: cold `<45°F`, mildly cold `45–59°F`, comfortable `60–74°F`, mildly hot `75–84°F`, hot `≥85°F`. These are project heuristics, not official/medical thresholds. Three or more visibly distinct SVG base outfits exist per category. A rain modifier adds weather-appropriate outerwear/boots/umbrella when precipitation probability is `≥40%` or measurable precipitation is forecast, without replacing the base thermal layer. **Check:** Validate each threshold and rain modifier with controlled forecast fixtures and inspect three variants/category.
6. **Weather/reminder rules:** Map provider weather codes to clear/cloud/rain/snow/storm icons. Generate rain/umbrella reminder for rain when precipitation probability is `≥40%` or precipitation is forecast; snowfall codes use one of three snow-specific outerwear illustrations and a winter-clothing/traction reminder instead. Generate sun protection at daily maximum UV `≥3`; hydration at daily high `≥85°F`; warm-layer reminder for cold category; an additional light-layer reminder when high is `≥60°F` and low is `≤55°F`; indoor/limit-outdoor reminder during thunderstorm codes. Each reminder type has at least three authored message variants. **Check:** Each threshold/code triggers the correct reminder, without unsupported safety claims.
7. **Variation:** Outfit and each reminder variant are independently chosen with separate deterministic pseudorandom seeds based on location/date/category/type. This gives random-looking independent selection while reproducing the same result for the same selected date, including after reload, without saving location or variation history. **Check:** Repeat same location/date and reload for stable content; test many seeded dates and confirm each eligible index spans the variants and reminders do not use fixed outfit/reminder pairs.
8. **Additional feature:** Show the selected date's lowest-probability consecutive two-hour precipitation window, chosen from hourly forecast (daylight hours preferred if available), and label its forecast probabilities. **Check:** Synthetic hourly data picks the lowest qualifying span; missing/incomplete hourly data gets a clear unavailable message.
9. **About and privacy:** Identify creator Jack Lepien and Claude Code development assistance; Open-Meteo source, linked attribution/license, free-tier non-commercial restriction, recommendation heuristics and cited guidance, local-storage practice, geolocation consent, API data-sharing note, and original-art credit. **Check:** Every item is visible and links work.
10. **Responsive/accessibility:** Semantic landmarks/headings, associated labels, keyboard-operable controls, visible focus, non-color-only status, accessible character description, useful loading/status/error announcements, and pointer controls at least 24x24 CSS px (targeting 44px on phone). Use desktop side-by-side space and phone stacked layout. **Check:** Keyboard-only use, 360px phone viewport, 1366px laptop viewport, browser zoom/reflow, and automated accessibility scan.
11. **Failure states:** Show loading and recoverable errors for network/service failure, invalid/no search results, missing forecast fields, denied/unsupported/timed-out geolocation. Preserve manual search and offer retry; never silently substitute mock weather. **Check:** Offline/API error, empty search, incomplete fixture, location permission denial.
12. **Deployment:** Static app deploys on HTTPS, with geolocation tested on deployed origin. **Check:** Open public HTTPS URL independently of localhost and exercise live weather/location.

## Recommendation state and data flow

1. Resolve manual US place searches using Open-Meteo Geocoding API. Use browser coordinates directly for an explicitly requested device-location lookup and label the result “My location”; do not send coordinates to a separate reverse-geocoder.
2. Request Open-Meteo current, hourly, and daily fields with the location timezone and US customary units.
3. Select a valid provider date; derive daily high/low, max UV, precipitation probability/amount, relevant weather codes, and hourly values.
4. Compute the thermal category using the thresholds above. Independently derive rain modifier, reminders, weather icon, and the two-hour low-rain span.
5. Select stable, independently seeded variant indices and construct one recommendation-state object.
6. Render character SVG, icon, written recommendation, reminders, forecast summary, and travel window from that object.

Only the latest location is written to one local-storage key. Variation stability comes from deterministic hashing and does not require saving a location/date history.

## Content variation

- Base outfits: at least 3 each for cold, mildly cold, comfortable, mildly hot, and hot (15 total).
- Rain overlays: at least 3 rain jacket/boots/umbrella configurations; snow overlays: at least 3 parka/insulated-coat/boot compositions. Each outerwear choice is seeded separately from the base outfit.
- Reminder types: rain, UV/sun protection, hydration, warm layer, cool-hour light layer, storm/indoors, snow/traction. Each has at least 3 independently seeded wordings.
- Variation is pseudorandom-looking but stable per normalized location/date/type. The same date under the same conditions/category reproduces the same variants after reload. If a forecast changes enough to cross a category boundary, the base outfit follows the new category.

## Assets

| Asset | Use/format | Source and credit |
|---|---|---|
| Character and 15 base outfit compositions | Main view; original inline SVG with shared figure and five category-specific groups of three looks | Developed with Claude Code under Jack Lepien's creative direction |
| Three rain clothing overlays | Main view, layered over thermal outfit; original inline SVG | Developed with Claude Code under Jack Lepien's creative direction |
| Three snow clothing overlays | Main view, layered over thermal outfit; original inline SVG with parkas, insulated coats, and snow boots | Developed with Claude Code under Jack Lepien's creative direction |
| Weather and reminder symbols | Main view; original inline SVG | Developed with Claude Code under Jack Lepien's creative direction |
| Four phone/laptop main/About mockups | `reference/`; original SVG digital wireframes, not hand-drawn sketches | Developed with Claude Code under Jack Lepien's creative direction |
| Eight interface reference screenshots | `reference/weather-ui-references.zip`; cited public weather-interface captures for research only, not used in app | Respective source websites; captured 2026-10-12 |
| UI typography, controls, layout | HTML/CSS, system fonts; no third-party assets | Original project code; Claude Code development assistance |

## Out of scope

Official NWS alert integration, health diagnosis or individualized medical advice, clothing-brand commerce/ads, user accounts, location history, tracking/analytics, saved wardrobe, outfit shopping links, manual coordinate entry, and guaranteed safety recommendations.

## Revisions

- 2026-10-12: Added comfortable, mildly hot, and mildly cold SVG outfit categories at the Developer's direction; retained hot/cold and rain-overlay looks. Added hourly low-rain travel window as the research-justified extra feature.
- 2026-10-12: Use deterministic independent pseudorandom variation seeds so a previously selected date stays visually consistent without storing a location/date history; only the most recent location is saved.
- 2026-10-12: A live provider lookup showed ZIP-like numeric searches can return an unrelated place, so the supported manual search is limited to US place names. Added a separate 3-variant snow outerwear layer and snow/traction reminder based on the forecast weather code.
- 2026-10-12: Added four digital SVG wireframes at the Developer's direction as a substitute for hand drawings; this is a documented deviation from the brief, not a claim that hand-drawn screens are complete. Added a cool-hour light-layer reminder after peer feedback asked for guidance on warm days with chilly mornings/evenings. The 60°F high and 55°F low cutoffs remain project heuristics, not official thresholds.

## Approval

- Specification and screen drawings remain pending Developer review; hand-drawn phone/laptop drawings have not been provided.

## Saving the transcript

After the Developer approves the specification, ask them to enter `save transcript`. When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.
