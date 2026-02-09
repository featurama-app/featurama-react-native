import { useMemo } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FeaturamaProvider } from '@featurama/react-native';
import { config } from '../src/config';

export default function RootLayout() {
  const featuramaConfig = useMemo(
    () => ({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
    }),
    [config.apiKey, config.baseUrl]
  );

  return (
    <FeaturamaProvider config={featuramaConfig}>
      <StatusBar style="auto" />
      <Slot />
    </FeaturamaProvider>
  );
}
