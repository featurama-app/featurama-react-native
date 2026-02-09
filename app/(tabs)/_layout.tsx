import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#6366f1',
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pre-built',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="grid" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="manual"
        options={{
          title: 'Manual',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="code" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="gear" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

/**
 * Simple text-based tab icon since we don't want to add vector icon dependencies.
 */
function TabIcon({
  name,
  color,
  size,
}: {
  name: 'grid' | 'code' | 'gear';
  color: string;
  size: number;
}) {
  const { Text } = require('react-native');
  const icons: Record<string, string> = {
    grid: '\u25A6',
    code: '\u2039/\u203A',
    gear: '\u2699',
  };
  return (
    <Text style={{ color, fontSize: size, textAlign: 'center' }}>
      {icons[name] ?? '?'}
    </Text>
  );
}
