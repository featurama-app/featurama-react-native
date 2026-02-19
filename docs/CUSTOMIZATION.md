# Customization Guide

This guide explains how to customize the Expo Boilerplate for your needs.

## Colors

### Theme Colors

The color scheme is defined in `src/constants/colors.ts`. The boilerplate supports light and dark themes with system detection.

```typescript
// src/constants/colors.ts
export const Colors = {
  light: {
    // Brand
    accent: '#4cb211',        // Primary brand color
    accentMuted: '#e8f5e0',   // Muted accent

    // Backgrounds
    background: '#ffffff',
    card: '#f9f8f7',

    // Text
    text: '#0a0a0a',
    textSecondary: '#717171',

    // Semantic
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Grays
    gray100: '#f4f4f5',
    gray200: '#e4e4e7',
    gray300: '#d4d4d8',
    border: '#e4e4e7',
  },
  dark: {
    accent: '#5bc91a',
    // ... dark theme colors
  },
};
```

### Using Colors in Components

```typescript
import { useThemeStore } from '../stores/themeStore';

function MyComponent() {
  const colors = useThemeStore((state) => state.colors);

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
}
```

## Typography

Edit `src/constants/design-tokens.ts` to customize typography:

```typescript
export const typography = {
  fonts: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

## Authentication

The auth system is a skeleton ready for your implementation.

### Implementing Sign In

Edit `src/stores/authStore.ts`:

```typescript
signIn: async (email: string, password: string, remember: boolean) => {
  set({ isLoading: true, errorMessage: null });

  try {
    // Replace with your auth logic
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      set({
        isAuthenticated: true,
        user: data.user,
        token: data.token,
        isLoading: false,
      });

      // Persist session
      if (remember) {
        await AsyncStorage.setItem('auth_token', data.token);
        await AsyncStorage.setItem('saved_email', email);
      }

      return AuthenticationResult.Success;
    } else {
      set({ errorMessage: data.message, isLoading: false });
      return AuthenticationResult.InvalidCredentials;
    }
  } catch (error) {
    set({ errorMessage: 'Network error', isLoading: false });
    return AuthenticationResult.Error;
  }
},
```

### Using Firebase Auth

```typescript
import auth from '@react-native-firebase/auth';

signIn: async (email: string, password: string, remember: boolean) => {
  set({ isLoading: true, errorMessage: null });

  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    set({
      isAuthenticated: true,
      user: {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || '',
      },
      isLoading: false,
    });

    return AuthenticationResult.Success;
  } catch (error: any) {
    set({ errorMessage: error.message, isLoading: false });
    return AuthenticationResult.InvalidCredentials;
  }
},
```

## API Client

### Configuring the API Client

Edit `src/services/api/apiClient.ts`:

```typescript
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = ENV.apiUrl;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {} } = options;

    // Get auth token
    const token = useAuthStore.getState().token;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: data,
      error: response.ok ? undefined : data.message,
    };
  }
}

export const apiClient = new ApiClient();
```

### Using the API Client

```typescript
// services/api/userService.ts
import { apiClient } from './apiClient';

export const userService = {
  getProfile: async () => {
    return apiClient.get<UserProfile>('/user/profile');
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    return apiClient.put('/user/profile', data);
  },
};
```

## Adding Screens

### Creating a New Screen

1. Create the screen file in `app/`:

```typescript
// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ScreenLayout } from '../../src/components/common/ScreenLayout';
import { useThemeStore } from '../../src/stores/themeStore';

export default function ProfileScreen() {
  const colors = useThemeStore((state) => state.colors);

  return (
    <ScreenLayout safeArea>
      <Text style={{ color: colors.text }}>Profile Screen</Text>
    </ScreenLayout>
  );
}
```

2. Add to tab navigation in `app/(tabs)/_layout.tsx`:

```typescript
<Tabs.Screen
  name="profile"
  options={{
    title: 'Profile',
    tabBarIcon: ({ color, size }) => (
      <User size={size} color={color} />
    ),
  }}
/>
```

### Creating a Modal Screen

1. Create the screen file:

```typescript
// app/settings-modal.tsx
export default function SettingsModal() {
  return (
    <ScreenLayout safeArea>
      {/* Modal content */}
    </ScreenLayout>
  );
}
```

2. Register in root layout:

```typescript
// app/_layout.tsx
<Stack.Screen
  name="settings-modal"
  options={{ presentation: 'modal' }}
/>
```

3. Navigate to the modal:

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/settings-modal');
```

## Adding Components

### Creating a Reusable Component

```typescript
// src/components/common/Badge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'primary' }) => {
  const colors = useThemeStore((state) => state.colors);

  const getColor = () => {
    switch (variant) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      default: return colors.accent;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getColor() + '20' }]}>
      <Text style={[styles.text, { color: getColor() }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
```

### Export from index

```typescript
// src/components/common/index.ts
export * from './Badge';
```

## Localization

### Adding a New Language

1. Create the language file:

```typescript
// src/locales/fr.ts
export const fr = {
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    delete: 'Supprimer',
    edit: 'Modifier',
    back: 'Retour',
    next: 'Suivant',
    done: 'Terminé',
    search: 'Rechercher',
    retry: 'Réessayer',
  },
  auth: {
    login: 'Connexion',
    logout: 'Déconnexion',
    // ...
  },
};
```

2. Register in `src/locales/index.ts`:

```typescript
import { fr } from './fr';

const translations: Record<Language, typeof en> = {
  en,
  de,
  fr, // Add here
};

export type Language = 'en' | 'de' | 'fr'; // Add type
```

### Using Translations

```typescript
import { useTranslation } from '../src/locales';

function MyComponent() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <>
      <Text>{t('common.save')}</Text>
      <Button
        title={t('auth.login')}
        onPress={() => setLocale('fr')}
      />
    </>
  );
}
```

## State Management

### Creating a New Store

```typescript
// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => ({
        items: [...state.items, item],
      })),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```
