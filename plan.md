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

Main risks: Open-Meteo free-tier use is non-commercial only; browser geolocation requires permission and a secure context; forecast fields or network service may be unavailable; API projections are not official warnings; this workspace has no Git remote or deployment account. Hand-drawn screen designs, saved reference images, peer sessions, public deployment, and transcript exports require Developer participation and are not to be fabricated.

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
- [ ] Commit working checkpoints to the connected GitHub repository and generate/commit `commit-log.txt`
- [ ] Push the branch, confirm GitHub Pages deployment succeeds, and test the public HTTPS app

### Verify and revise

- [ ] Check every specification requirement
- [ ] Test multiple locations, current and forecast dates, recommendation categories, outfit and reminder variations, and failure states
- [ ] Verify that eligible outfit and reminder variations are selected independently rather than as fixed pairs
- [ ] Verify that returning to a previously selected date shows the same variations
- [ ] Test the deployed app, independently of the local version, on a real phone and a laptop, including both screens, accessibility, and one-handed controls
- [ ] Prepare and conduct actual usability testing with three peers and record each session; do not substitute the fictional avatar feedback
- [x] Create a separately labeled simulated-avatar feedback document for concept exploration
- [x] Implement a provisional cool-hour light-layer reminder prompted by the simulated Jules persona; its effectiveness still needs validation with actual peers
- [ ] After actual peer sessions, confirm or revise the provisional improvement and update `spec.md` if intended behavior changes
- [ ] Redeploy the real-peer-validated improvement after public hosting becomes available

### Deliver

- [ ] Confirm all brief deliverables, sources, privacy information, and asset credits
- [ ] Save all chat transcripts
- [ ] Complete the debrief

## Current status and pending Developer inputs

- The workspace is initialized on branch `main` and connected to the Developer-provided empty repository `https://github.com/JackLepien/AI-Explorations---Project-3`. No commits have been pushed yet. A GitHub Pages Actions workflow has been added; public deployment and HTTPS testing remain pending.
- Eight cited interface reference screenshots and four digital SVG wireframes are now in `reference/`. The PNGs will be distributed inside a ZIP per Developer direction; uncompressed originals remain local. Literal hand-drawn sketches are not supplied; Developer asked for digital mockups instead. Approval remains pending, and evaluator acceptance of this substitution is unknown.
- Three peer usability sessions have not been conducted. Keep notes based on actual sessions only; then prioritize and implement a supported improvement.
- This chat is not saved as a transcript. The Developer must explicitly request a transcript export.
- Commercial or promotional deployment requires a provider arrangement whose terms permit that use; Open-Meteo's free API is for non-commercial use only.
- The provided template does not contain `debrief.md`; add/use the supplied debrief material when available rather than inventing a completed debrief.
- `simulated-peer-feedback.txt` contains three fictional marketing-avatar perspectives and one provisional product iteration. It explicitly states they are simulations, not peers or observed findings; actual peer sessions remain incomplete.
- The Developer authorized publishing the reference screenshots but requested a ZIP archive rather than individual PNGs. The local originals are ignored by Git; `reference/weather-ui-references.zip` is the distributable archive.

## Local verification evidence

- Local PowerShell static server responded `HTTP/1.1 200 OK` at `http://localhost:8765/`; the working preview is currently running.
- The live Open-Meteo forecast request returned Norfolk's `America/New_York` timezone, a current observation, seven daily forecast dates, and 168 hourly records. The browser displayed live temperatures/conditions and weather attribution.
- Browser smoke test: Norfolk loaded; searching and selecting Richmond, Virginia updated the live forecast; the selected location was stored as the single `forecast-fits:last-location` value and remained selected after page reload.
- Date selection updated forecast, outfit, reminders, and travel window. Current observation was shown with its local provider timestamp; future dates omitted current-only values.
- Synthetic recommendation checks passed for all eight category boundaries, three outfits in each of five thermal categories, three rain and snow outerwear variants, at least three wordings for each of seven reminder types, stable repeat selections, all nine sampled outfit/rain-reminder variant pairs, precipitation and UV reminders, snow-specific clothing/reminder without an umbrella message, daylight low-rain window choice, and a clear missing-high-temperature error.
- After fictional Jules feedback raised the gap between daytime high and cool forecast low, added a light-layer reminder when high is at least 60°F and low is 55°F or below. This change is visibly labeled as a hypothesis in the About screen and is not evidence of user-tested improvement.
- Responsive check at 360px: no horizontal overflow; 44px search button, 46px location button, and native date control. At 1366px: no horizontal overflow and a two-column character/details composition.
- VS Code diagnostics found no JavaScript errors. `node --test weather.test.js` could not run because Node.js is not installed; the test file is retained, and the relevant logic was exercised in the browser against synthetic forecast data.
- Not yet verified: denied/unsupported/timeout geolocation, network failures in the rendered interface, automated accessibility audit, a real phone, saved-date variation stability through a full reload-and-reselect sequence, peer testing, or deployed HTTPS behavior.

## Revisions

- 2026-10-12: Set implementation to a dependency-free static file with original SVG outfit layers; added thermal outfit categories and the hourly low-precipitation feature at the Developer's direction.
- 2026-10-12: Added explicit boundaries for missing hand drawings/reference images, peer testing, Git/hosting access, and transcripts so none are represented as completed without evidence.
- 2026-10-12: During implementation, a live numeric search returned an unrelated city, so the interface no longer suggests ZIP lookup. Added snow-specific SVG outerwear and reminders so snowfall does not produce a raincoat/umbrella recommendation.
- 2026-10-12: Captured eight public weather interface references and created four digital wireframes. Added the separately labeled fictional persona feedback document and a provisional cool-hour clothing reminder; both the wireframe substitution and reminder still require real-world/evaluator validation where noted.

## Usability testing

Before testing, record the purpose, a few realistic tasks, non-leading prompts, and a consistent note format. For each session, use a non-identifying label and record the task, what the tester did or said, successes, barriers or questions, and possible changes. Keep observations separate from interpretations. After all three sessions, summarize the strongest findings and the improvement they support.

## Revisions

Record material plan changes and why they were made.

## Saving transcripts

At the end of planning, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.

At the end of every implementation chat, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/build-YYYY-MM-DD_HHMMSS.md` using the same formatting.
