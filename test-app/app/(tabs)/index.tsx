// Modal - Featurama SDK Modal Demo

import { useState } from 'react';
import { View, Modal, Platform, StyleSheet } from 'react-native';
import { useThemeStore } from '@stores/themeStore';
import {
  FeaturamaProvider,
  FeatureRequestsScreen,
} from '@featurama/react-native';
import { FEATURAMA_CONFIG, USER_ID } from '@/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenLayout } from '@components/common/ScreenLayout';
import { Button } from '@components/common/Button';

export default function ModalScreen() {
  const [visible, setVisible] = useState(false);
  const isDark = useThemeStore((state) => state.isDark);
  const insets = useSafeAreaInsets();

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Button
          title="Feature Requests"
          onPress={() => setVisible(true)}
          variant="primary"
          size="large"
        />
      </View>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
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
            safeAreaTop={Platform.OS === 'android' ? insets.top : 0}
            onClose={() => setVisible(false)}
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
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
});
