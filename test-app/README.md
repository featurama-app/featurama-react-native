# Expo Boilerplate

A production-ready Expo boilerplate with modern React Native patterns, designed for building scalable mobile applications.

## Tech Stack

- **Expo SDK 54** with React Native 0.81.5, React 19
- **Expo Router v6** - File-based navigation with typed routes
- **Zustand** + AsyncStorage - State management with persistence
- **TypeScript 5.9** - Strict mode enabled
- **Lucide Icons** - Icon library
- **RevenueCat** - In-app purchases and subscriptions
- **PostHog** - Analytics integration
- **ESLint + Prettier** - Code quality and formatting

## Features

- Light/Dark/System theme support
- Authentication flow (skeleton)
- Toast notifications
- Changelog sheet for app updates
- Error boundary
- Push notifications (expo-notifications)
- Haptic feedback (expo-haptics)
- Onboarding flow (3 screens)
- PostHog analytics integration
- RevenueCat payments integration
- Safe area handling
- Localization ready (English & German)

## Project Structure

```
ExpoBoilerplate/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout
│   ├── (auth)/                  # Auth flow
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── reset-password.tsx
│   │   └── onboarding/          # Onboarding screens
│   │       ├── _layout.tsx
│   │       ├── welcome.tsx
│   │       ├── features.tsx
│   │       └── permissions.tsx
│   └── (tabs)/                  # Main app tabs
│       ├── _layout.tsx
│       ├── home.tsx
│       ├── paywall.tsx
│       └── settings.tsx
├── assets/                      # Static assets
│   └── images/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ScreenLayout.tsx
│   │   └── dialogs/
│   │       └── ChangelogSheet.tsx
│   ├── constants/
│   │   ├── analytics.ts         # PostHog config
│   │   ├── colors.ts            # Theme colors
│   │   ├── config.ts            # App config
│   │   └── environments.ts      # Environment URLs
│   ├── hooks/
│   │   ├── useChangelogSheet.ts
│   │   └── useNotifications.ts
│   ├── locales/                 # i18n
│   │   ├── index.tsx
│   │   ├── i18n.ts
│   │   ├── en.ts
│   │   └── de.ts
│   ├── providers/
│   │   └── AppProvider.tsx
│   ├── services/
│   │   ├── api/
│   │   │   └── apiClient.ts
│   │   └── notifications/
│   │       └── notificationService.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── preferencesStore.ts
│   │   ├── purchaseStore.ts
│   │   └── themeStore.ts
│   ├── types/
│   │   ├── enums.ts
│   │   └── models.ts
│   └── utils/
│       └── toastHelper.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ExpoBoilerplate

# Install dependencies
npm install

# Copy environment file and add your API keys
cp .env.example .env

# Start the development server
npx expo start
```

### Environment Variables

Copy `.env.example` to `.env` and configure your API keys:

```bash
# PostHog Analytics
POSTHOG_API_KEY=phc_your_api_key_here
POSTHOG_HOST=https://eu.i.posthog.com

# RevenueCat In-App Purchases
REVENUECAT_API_KEY_IOS=appl_your_ios_key_here
REVENUECAT_API_KEY_ANDROID=goog_your_android_key_here
```

Environment variables are loaded via `app.config.ts` and accessed through `Constants.expoConfig.extra`.

### Running on devices

```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Web
npx expo start --web
```

## Scripts

```bash
npm start           # Start Expo dev server
npm run ios         # Run on iOS
npm run android     # Run on Android
npm run web         # Run on web
npm run lint        # Run ESLint
npm run lint:fix    # Auto-fix lint issues
npm run format      # Format with Prettier
npm run format:check # Check formatting
npm run type-check  # TypeScript check
```

## Local SDK linking

This project links `@featurama/react-native` from `../../sdks/react-native` and
supports live edits from SDK source files.

- After changing Metro resolver settings, fully restart the Metro process.
- After dependency or resolver changes, run `npx expo start --clear`.
- Expected behavior: app code and SDK code share the app-local `react` and
  `react-native` runtime instances from this app's `node_modules`.

## Dependencies

### Core
- expo, expo-router, expo-constants
- react, react-native
- typescript

### State Management
- zustand
- @react-native-async-storage/async-storage

### UI
- lucide-react-native
- react-native-svg
- @gorhom/bottom-sheet

### Navigation & Gestures
- react-native-gesture-handler
- react-native-reanimated
- react-native-screens
- react-native-safe-area-context

### Payments
- react-native-purchases (RevenueCat)

### Notifications
- expo-notifications
- expo-device

### Haptics
- expo-haptics

### Analytics
- posthog-react-native

### Localization
- expo-localization
- i18n-js

### Utilities
- @react-native-community/netinfo
- react-native-toast-message

## Customization

### Colors

Edit `src/constants/colors.ts` to customize the color scheme:

```typescript
export const Colors = {
  light: {
    accent: '#4cb211',      // Your brand color
    background: '#ffffff',
    card: '#f9f8f7',
    text: '#0a0a0a',
    // ...
  },
  dark: {
    accent: '#5bc91a',
    background: '#191919',
    card: '#202020',
    text: '#fafafa',
    // ...
  },
};
```

### Adding New Languages

1. Create a new file in `src/locales/` (e.g., `fr.ts`)
2. Copy the structure from `en.ts`
3. Translate the strings
4. Import in `src/locales/index.tsx`

```typescript
// src/locales/fr.ts
export const fr = {
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    // ...
  },
};
```

### Authentication

The auth flow is a skeleton. To implement your own authentication:

1. Edit `src/stores/authStore.ts`
2. Implement `signIn`, `signOut`, and `resetPassword`
3. Add your auth provider (Firebase, Supabase, etc.)

### API Client

Configure your API endpoints in `src/constants/environments.ts`:

```typescript
export const ENVIRONMENTS = {
  Production: {
    apiUrl: 'https://api.yourapp.com',
  },
  // ...
};
```

### RevenueCat

1. Set `REVENUECAT_API_KEY_IOS` and `REVENUECAT_API_KEY_ANDROID` in `.env`
2. Configure your product identifiers and entitlements in RevenueCat dashboard
3. Use `usePurchaseStore` to access premium status and offerings

### PostHog Analytics

1. Set `POSTHOG_API_KEY` and `POSTHOG_HOST` in `.env`
2. Define event names in `src/constants/analytics.ts`
3. Use `usePostHog()` hook to track events

## License

MIT
