# Instructions for codex-1

This repository contains **MobileHorizon**, a React Native application built with Expo. Navigation is handled by **expo-router** and styling is done with **Tailwind CSS** via **nativewind**.

## Repository layout

- `app/` – Expo Router pages (`_layout.js`, `index.js`, `updates.js`, `settings.js`).
- `src/` – API utilities, hooks and other shared logic.
- `global.css` – Tailwind base file. Tailwind configuration is in `tailwind.config.js`.
- `eas.json` and `app.json` – configuration for builds and OTA updates.
- GitHub Actions in `.github/workflows/` automate EAS builds and manual OTA updates.

## Development

1. Install dependencies with `npm install` (requires network access).
2. Start the development server using `npm start` to launch Expo.
3. There are no automated tests or lint scripts at this time.

## Deployment

- Builds and updates are handled with the EAS CLI. Example:
  - `eas build -p ios --profile preview`
  - `eas update --branch preview --message "Update"`
- GitHub actions invoke these commands automatically when pushing to `master` or when manually triggering the workflow.

## Coding guidelines

- Use JavaScript/React Native style consistent with the existing files.
- Keep styling with Tailwind classes through nativewind.
- Ensure new pages are placed under `app/` so Expo Router can detect them.
- When editing configuration, update the appropriate JSON files (`app.json`, `eas.json`).
- Commit descriptive messages for each change. No branching or rebasing is required.

## Service pattern

- Services are implemented as singletons created via a closure pattern.
- Each service exposes its public API by returning functions from `createXService()` and exporting a constant like `export const xService = createXService();`.
- Private state and helper functions should remain inside the closure to keep them hidden.
