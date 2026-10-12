# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved specification into an ordered, trackable build and verification plan.

## Instructions for the Developer

Set priorities, review the checklist, verify results rather than relying only on the Agent's report, and keep the project documents current as the work changes. Expect the build to take many rounds of testing and fixing; record material changes under Revisions.

To begin planning, open the project repository in a fresh chat and enter:

`Read ./plan.md and help me create the Project 3 implementation plan.`

After approving the plan, open the project repository in a fresh chat and enter:

`Read ./plan.md and help me implement the approved Project 3 plan in working checkpoints.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, `research.md`, `spec.md`, and this file, then inspect the relevant project files. Propose concrete tasks and checks without expanding the approved scope.

During implementation, follow the approved plan in working checkpoints and keep it current. Never mark approvals or items requiring Developer verification complete on the Developer's behalf.

## Approach

Build a dependency-free static `index.html` (semantic HTML, CSS, and JavaScript) so it can be hosted on GitHub Pages without a build step or secrets. Geocoding and forecast requests both go directly to Open-Meteo. One fetched weather payload and selected location/date produce one recommendation state; every character layer, icon, message, reminder, metric, and travel window is rendered from that state. Keep only the most recent location in local storage; derive stable variant indices from separate location/date/type seeds.

Main risks: Open-Meteo free-tier use is non-commercial only; browser geolocation requires permission and a secure context; forecast fields or network service may be unavailable; API projections are not official warnings; hand-drawn screen designs, public deployment, and transcript exports remain pending. Three peer-feedback sessions are documented below; the recorded evidence consists of comments rather than task-performance notes.

## Checklist

### Approvals

- [ ] Research approved
- [ ] Specification approved
- [ ] Plan approved

### Build

- [x] Implement main screen structure and responsive desktop/phone layout in `index.html`
- [x] Implement US place search, last-location storage, permission-based device location, and explicit failure states
- [x] Implement live Open-Meteo current/hourly/daily forecast retrieval and date selection
- [x] Create original SVG character, 15 base outfit variants (3 per thermal category), 3 rain overlays, 3 snow overlays, and weather/reminder symbols
- [x] Implement recommendation rules and one state that drives all rendered weather/outfit/copy/reminder outputs
- [x] Implement separately seeded stable outfit/reminder variations and hourly low-rain window
- [x] Implement About view with creator, methods, linked sources, non-commercial terms caveat, privacy, and art credits
- [x] Create four digital phone/laptop main/About wireframes at Developer's direction; hand-drawn requirement remains unmet unless evaluator approves substitution
- [x] Test and fix local implementation checkpoints; see evidence below (full project acceptance testing remains pending)
- [x] Commit the project checkpoints and `commit-log.txt`; the log lists prior commits through its preceding checkpoint
- [x] Push branch `main` to the connected GitHub repository and verify the remote commit ID
- [x] GitHub Pages workflow completed successfully and the public HTTPS app loaded live forecast data; phone-specific deployed testing remains pending

### Verify and revise

- [ ] Check every specification requirement
- [ ] Test multiple locations, current and forecast dates, recommendation categories, outfit and reminder variations, and failure states
- [ ] Verify that eligible outfit and reminder variations are selected independently rather than as fixed pairs
- [ ] Verify that returning to a previously selected date shows the same variations
- [ ] Test the deployed app, independently of the local version, on a real phone and a laptop, including both screens, accessibility, and one-handed controls
- [x] Conduct three peer feedback sessions and record anonymized comments in `simulated-peer-feedback.txt`; its filename reflects its earlier concept-simulation use
- [x] Implement a cool-hour light-layer reminder in response to peer feedback and verify that it appears for a warm-high/cool-low live forecast
- [ ] If task-level usability evidence is required, run structured tasks and record observed actions and outcomes; current notes contain comments, not task-performance observations
- [ ] After GitHub Pages is enabled, deploy and test the peer-informed improvement on the public HTTPS version

### Deliver

- [ ] Confirm all brief deliverables, sources, privacy information, and asset credits
- [ ] Save all chat transcripts
- [ ] Complete the debrief

## Current status and pending Developer inputs

- Branch `main` is connected to `https://github.com/JackLepien/AI-Explorations---Project-3`; the local checkout has been fast-forwarded to the GitHub-generated Pages workflow commit `6262bea50f0dfb771c49575214186a58fc6650f3`. The custom static Pages workflow's first run failed because the Actions token could not create the repository's Pages site (`Resource not accessible by integration`). The Developer is handling Pages setup and testing; synchronize with remote before any further push.
- Eight cited interface reference screenshots and four digital SVG wireframes are now in `reference/`. The PNGs will be distributed inside a ZIP per Developer direction; uncompressed originals remain local. Literal hand-drawn sketches are not supplied; Developer asked for digital mockups instead. Approval remains pending, and evaluator acceptance of this substitution is unknown.
- Three peer feedback sessions have now been reported by the Developer. The comments are recorded in `simulated-peer-feedback.txt`; see the anonymized summary and evidence limitation below.
- This chat is not saved as a transcript. The Developer must explicitly request a transcript export.
- Commercial or promotional deployment requires a provider arrangement whose terms permit that use; Open-Meteo's free API is for non-commercial use only.
- The provided template does not contain `debrief.md`; add/use the supplied debrief material when available rather than inventing a completed debrief.
- Although `simulated-peer-feedback.txt` originated as a simulated-avatar exercise, the Developer confirms the three comments in its current version were independently given verbatim by three peers after testing. The exact wording also matches the earlier generated simulation; the Developer noted this coincidence for later investigation. The present notes are treated as peer feedback per the Developer's confirmation.
- The Developer authorized publishing the reference screenshots but requested a ZIP archive rather than individual PNGs. The local originals are ignored by Git; `reference/weather-ui-references.zip` is the distributable archive.
- A separate nested `AI-Explorations---Project-3/` checkout appeared in the workspace. It is unrelated to this root repository and remains untouched.

## Local verification evidence

- Local PowerShell static server responded `HTTP/1.1 200 OK` at `http://localhost:8765/`; the working preview is currently running.
- The live Open-Meteo forecast request returned Norfolk's `America/New_York` timezone, a current observation, seven daily forecast dates, and 168 hourly records. The browser displayed live temperatures/conditions and weather attribution.
- Browser smoke test: Norfolk loaded; searching and selecting Richmond, Virginia updated the live forecast; the selected location was stored as the single `forecast-fits:last-location` value and remained selected after page reload.
- Date selection updated forecast, outfit, reminders, and travel window. Current observation was shown with its local provider timestamp; future dates omitted current-only values.
- Synthetic recommendation checks passed for all eight category boundaries, three outfits in each of five thermal categories, three rain and snow outerwear variants, at least three wordings for each of seven reminder types, stable repeat selections, all nine sampled outfit/rain-reminder variant pairs, precipitation and UV reminders, snow-specific clothing/reminder without an umbrella message, daylight low-rain window choice, and a clear missing-high-temperature error.
- Peer feedback included a request for a light extra layer when daytime highs mask chilly mornings/evenings. The app's 60°F-high/55°F-low heuristic was already implemented; a live forecast with a 66°F high and 45°F low displayed its reminder. These cutoffs are project choices, not thresholds endorsed by testers or official guidance.
- Responsive check at 360px: no horizontal overflow; 44px search button, 46px location button, and native date control. At 1366px: no horizontal overflow and a two-column character/details composition.
- VS Code diagnostics found no JavaScript errors. `node --test weather.test.js` could not run because Node.js is not installed; the test file is retained, and the relevant logic was exercised in the browser against synthetic forecast data.
- GitHub Pages run 3 succeeded for commit `a9fbdd13093c41eb0f1053f4deaabb977f71499c`. Opened `https://jacklepien.github.io/AI-Explorations---Project-3/`; the deployed page loaded Norfolk's live current observation and seven-day forecast. This was a desktop-browser smoke test, not a real-phone test.
- Not yet verified: denied/unsupported/timeout geolocation, network failures in the rendered interface, automated accessibility audit, a real phone, saved-date variation stability through a full reload-and-reselect sequence, and structured task-performance outcomes.

## Revisions

- 2026-10-12: Set implementation to a dependency-free static file with original SVG outfit layers; added thermal outfit categories and the hourly low-precipitation feature at the Developer's direction.
- 2026-10-12: Added explicit boundaries for missing hand drawings, public deployment, and transcripts so none are represented as completed without evidence.
- 2026-10-12: During implementation, a live numeric search returned an unrelated city, so the interface no longer suggests ZIP lookup. Added snow-specific SVG outerwear and reminders so snowfall does not produce a raincoat/umbrella recommendation.
- 2026-10-12: Captured eight public weather interface references and created four digital wireframes. Recorded peer feedback and the cool-hour reminder it informed; the wireframe substitution still requires evaluator acceptance, and the reminder thresholds remain app heuristics.

## Peer feedback sessions

The Developer reports that three peers used/reviewed the prototype and gave the comments recorded verbatim in `simulated-peer-feedback.txt`. Names are replaced here with session labels. The notes capture participants' comments and suggestions; task prompts, observed actions, and task-completion outcomes were not recorded.

| Session | Feedback and observed signal | Design response |
|---|---|---|
| Peer 1 — commuter | Valued the character and requested a light-layer note for chilly mornings/evenings despite a warm forecast high; also called out rain probability and the driest time as useful before crossing campus. | Implemented the cool-hour light-layer reminder. Rain chance and the two-hour low-rain planning window are already displayed. |
| Peer 2 — laptop and phone user | Said the forecast was easy to find; recommended phone-friendly tap targets and making high, low, rain chance, and reminders easy to check; appreciated the forecast caveat. | Existing responsive layout uses large phone controls and groups the requested forecast metrics/reminders; public-device validation remains pending. |
| Peer 3 — student walking between buildings | Valued the character and said rain/snow clothing should match the forecast; wanted the dry-window feature described as an estimate. | The app already uses separate rain and snow clothing, and labels the two-hour window as forecast guidance rather than a guarantee. |

The same comments appeared in an earlier simulated-avatar document. The Developer confirms the peers independently gave these exact comments verbatim and noted the coincidence for later investigation. Treat the feedback as Developer-reported peer input; do not infer task success or usability improvement beyond what these comments support.

## Usability-testing preparation

Before testing, record the purpose, a few realistic tasks, non-leading prompts, and a consistent note format. For each session, use a non-identifying label and record the task, what the tester did or said, successes, barriers or questions, and possible changes. Keep observations separate from interpretations. After all three sessions, summarize the strongest findings and the improvement they support.

## Revisions

Record material plan changes and why they were made.

## Saving transcripts

At the end of planning, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.

At the end of every implementation chat, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/build-YYYY-MM-DD_HHMMSS.md` using the same formatting.
