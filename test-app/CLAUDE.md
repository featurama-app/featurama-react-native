# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native boilerplate using Expo SDK 54, React Native 0.81.5, and React 19. It uses file-based routing with Expo Router v6 and Zustand for state management.

## Development Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run web version
```

TypeScript strict mode is enabled via `tsconfig.json` which extends `expo/tsconfig.base`.

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Format with Prettier
npm run format:check  # Check formatting
npm run type-check    # TypeScript check
```

## Environment Variables

API keys are configured via `.env` file (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `POSTHOG_API_KEY` | PostHog analytics API key |
| `POSTHOG_HOST` | PostHog host (EU: `https://eu.i.posthog.com`) |
| `REVENUECAT_API_KEY_IOS` | RevenueCat iOS API key |
| `REVENUECAT_API_KEY_ANDROID` | RevenueCat Android API key |

Environment variables are loaded in `app.config.ts` and exposed via `Constants.expoConfig.extra`:
```typescript
import Constants from 'expo-constants';
const extra = Constants.expoConfig?.extra;
const apiKey = extra?.posthogApiKey;
```

## Architecture

### Routing (Expo Router v6)

File-based routing in `app/` directory with typed routes enabled:
- `app/(auth)/` - Auth flow screens (login, reset-password), onboarding flow
- `app/(tabs)/` - Main app tabs requiring authentication (home, settings, paywall)

### State Management (Zustand + AsyncStorage)

Stores in `src/stores/` use Zustand with persistence middleware:
- `useAuthStore` - Authentication state and session management
- `useThemeStore` - Theme mode (Light/Dark/System) with computed colors
- `usePreferencesStore` - User preferences
- `usePurchaseStore` - RevenueCat integration, premium status, offerings

Store pattern:
```typescript
export const useStore = create<State>()(
  persist(
    (set, get) => ({ /* state and actions */ }),
    {
      name: 'storage-key',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ /* fields to persist */ }),
    }
  )
);
```

### Theme System

- Colors defined in `src/constants/colors.ts` with light/dark variants
- Access via: `const colors = useThemeStore((state) => state.colors)`
- Theme mode options: Light, Dark, System (auto-follows device)

### i18n Localization

Custom context-based translation system (not i18next):
- Translations in `src/locales/` as TypeScript objects (en.ts, de.ts)
- Use: `const { t } = useTranslation()` then `t('auth.login')` or `t('key', { name: 'value' })`

### API Client

Singleton in `src/services/api/apiClient.ts`:
- Generic `request<T>()` method returning `ApiResponse<T>` with data/error/status
- Convenience methods: `get()`, `post()`, `put()`, `patch()`, `delete()`
- Auto-includes Bearer token from auth store
- 30 second timeout

### Component Architecture

Base components in `src/components/common/`:
- `Button` - Variants: primary, secondary, outline, ghost, danger; Sizes: small, medium, large
- `Card` - Container with optional press handler
- `ErrorBoundary` - Catches JavaScript errors in child component tree
- `Header` - Screen header with back button and right action slot
- `ScreenLayout` - Base layout wrapper with safe area and optional scrolling

### Push Notifications

Notification service in `src/services/notifications/`:
- `notificationService` - Singleton for permission requests, tokens, and scheduling
- `useNotifications` hook - Easy access to notification functionality in components

### Analytics (PostHog)

PostHog analytics integration in `src/constants/analytics.ts`:
- API key loaded from environment via `Constants.expoConfig.extra.posthogApiKey`
- Predefined event names in `ANALYTICS_EVENTS`
- Use `usePostHog()` hook for tracking events
- Analytics disabled automatically if no API key configured

### Haptics (expo-haptics)

Haptic feedback for user interactions:
```typescript
import * as Haptics from 'expo-haptics';

// Impact feedback (button presses, UI interactions)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);   // Light tap
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);  // Medium tap
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);   // Heavy tap

// Notification feedback (success/warning/error states)
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// Selection feedback (picker changes, toggles)
Haptics.selectionAsync();
```

## Path Aliases

Configured in `tsconfig.json` and `babel.config.js`. Always use aliases instead of relative paths:

| Alias | Path |
|-------|------|
| `@components/*` | `./src/components/*` |
| `@constants/*` | `./src/constants/*` |
| `@hooks/*` | `./src/hooks/*` |
| `@locales/*` | `./src/locales/*` |
| `@providers/*` | `./src/providers/*` |
| `@services/*` | `./src/services/*` |
| `@stores/*` | `./src/stores/*` |
| `@apptypes/*` | `./src/types/*` |
| `@utils/*` | `./src/utils/*` |
| `@assets/*` | `./assets/*` |
| `@/*` | `./*` (root) |

**Note:** `@apptypes` is used instead of `@types` to avoid conflicts with npm's @types packages.

Example imports:
```typescript
import { useAuthStore } from '@stores/authStore';
import { Button } from '@components/common/Button';
import { Colors } from '@constants/colors';
import { UserModel } from '@apptypes/models';
```

## Key Source Directories

- `src/components/` (`@components`) - Reusable UI components
- `src/constants/` (`@constants`) - Colors, analytics config, environments
- `src/hooks/` (`@hooks`) - Custom hooks (useChangelogSheet, useNotifications)
- `src/locales/` (`@locales`) - i18n translations
- `src/providers/` (`@providers`) - AppProvider with initialization logic
- `src/services/api/` (`@services`) - API client and service modules
- `src/services/notifications/` (`@services`) - Push notification service
- `src/stores/` (`@stores`) - Zustand state stores
- `src/types/` (`@apptypes`) - TypeScript models and enums
- `src/utils/` (`@utils`) - Helper utilities

## App Initialization Flow

1. Splash screen shows while initializing
2. `AppProvider` mounts and restores auth session
3. Splash screen hides after initialization
4. Routes based on onboarding state (onboarding flow if first launch)
5. Routes based on auth state (auth screens vs main tabs)
6. Handles system theme changes

## Conventions

- TypeScript strict mode enabled
- Components use `StyleSheet.create()` for styles
- Stores accessed with selectors: `useStore((state) => state.property)`
- Console logging uses `[Module]` prefix format
- Platform-specific code uses `Platform.select()`
- All base components integrate with theme store for colors
