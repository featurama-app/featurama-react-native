// Home - Featurama SDK Feature Requests Screen

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@stores/themeStore';
import {
  FeaturamaProvider,
  FeatureRequestsScreen,
} from '@featurama/react-native';
import { FEATURAMA_CONFIG, USER_ID } from '@/config';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <FeaturamaProvider
      config={{
        apiKey: FEATURAMA_CONFIG.apiKey,
        baseUrl: FEATURAMA_CONFIG.baseUrl,
        userIdentifier: USER_ID,
      }}
    >
      <FeatureRequestsScreen
        colorScheme={isDark ? 'dark' : 'light'}
        accentColor="#e53935"
        safeAreaTop={insets.top}
        theme={{
          background: isDark ? '#1a0000' : '#fff0f0',
          card: isDark ? '#2d0a0a' : '#ffe0e0',
          secondary: isDark ? '#3d1515' : '#ffd0d0',
          accent: '#e53935',
          accentLight: isDark ? '#3d1515' : '#ffcdd2',
          accentForeground: '#ffffff',
          border: isDark ? '#4a1c1c' : '#ef9a9a',
          borderAccent: '#e53935',
          gray100: isDark ? '#2d0a0a' : '#ffcdd2',
        }}
      />
    </FeaturamaProvider>
  );
}
