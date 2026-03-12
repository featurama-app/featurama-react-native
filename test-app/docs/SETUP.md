# Setup Guide

This guide walks you through setting up the Expo Boilerplate for your project.

## Prerequisites

Make sure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Expo CLI** - `npm install -g expo-cli`
- **Xcode** (for iOS development on macOS)
- **Android Studio** (for Android development)

## Installation

### 1. Clone or Download

```bash
git clone <repo-url> my-app
cd my-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npx expo start
```

This will open Expo Dev Tools in your browser. From there you can:

- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Press `w` to open in web browser
- Scan QR code with Expo Go app on your device

## Configuration

### App Identity

Edit `app.json` to customize your app:

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.mycompany.myapp"
    },
    "android": {
      "package": "com.mycompany.myapp"
    }
  }
}
```

### Environment Configuration

Edit `src/constants/environments.ts`:

```typescript
export const ENVIRONMENTS = {
  Production: {
    apiUrl: 'https://api.yourapp.com',
    appVersionUrl: 'https://api.yourapp.com/version',
  },
  Development: {
    apiUrl: 'http://localhost:3000',
    appVersionUrl: 'http://localhost:3000/version',
  },
};

// Set the current environment
export const ENVIRONMENT = 'Development';
```

### App Config

Edit `src/constants/config.ts`:

```typescript
export const APP_CONFIG = {
  appName: 'My App',
  supportEmail: 'support@myapp.com',
  privacyPolicyUrl: 'https://myapp.com/privacy',
  termsOfServiceUrl: 'https://myapp.com/terms',
};
```

## Adding Your Logo

1. Add your logo image to `assets/images/`
2. Update `app.json` with icon paths:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png"
    },
    "ios": {
      "icon": "./assets/icon.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png"
      }
    }
  }
}
```

3. Update the login screen to use your logo:

```typescript
// app/(auth)/login.tsx
<Image
  source={require('../../assets/images/my-logo.png')}
  style={styles.logo}
  resizeMode="contain"
/>
```

## Building for Production

### iOS

```bash
# Build for App Store
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android

```bash
# Build APK
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear Metro cache
npx expo start --clear
```

### iOS Simulator Issues

```bash
# Reset simulator
xcrun simctl shutdown all
xcrun simctl erase all
```

### Android Emulator Issues

```bash
# Clear Gradle cache
cd android && ./gradlew clean
```

### Dependency Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

## Next Steps

1. [Customize the theme](./CUSTOMIZATION.md#colors)
2. [Add authentication](./CUSTOMIZATION.md#authentication)
3. [Configure API client](./CUSTOMIZATION.md#api-client)
4. [Add new screens](./CUSTOMIZATION.md#adding-screens)
