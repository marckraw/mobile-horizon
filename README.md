# MobileHorizon

MobileHorizon is a minimal Expo application demonstrating how to deliver over-the-air (OTA) updates using **expo-updates** and EAS (Expo Application Services).

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
   This runs `expo start` which opens the Expo developer tools. From there you can run the app on a simulator or a physical device.

## Building with EAS

EAS configuration lives in [`eas.json`](eas.json). Typical commands:

- **Development build** (includes the dev client):
  ```bash
  npx eas build --profile development --platform ios # or android
  ```
- **Preview build** for internal distribution:
  ```bash
  npx eas build --profile preview --platform ios # or android
  ```
- **Production build** for app store submission:
  ```bash
  npx eas build --profile production --platform ios # or android
  ```

## Publishing OTA Updates

1. Bump the version or add changes.
2. Commit your code and push to your repository.
3. Publish an update to the default `production` channel:
   ```bash
   npx eas update --branch production -m "My update message"
   ```
   Adjust the branch/channel as needed (e.g. `preview`). The update URL and runtime version are configured in [`app.json`](app.json).

