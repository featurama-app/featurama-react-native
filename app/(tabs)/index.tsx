import { useColorScheme } from 'react-native';
import { FeatureRequestsScreen } from '@featurama/react-native';

export default function PrebuiltScreen() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <FeatureRequestsScreen
      colorScheme={colorScheme}
      accentColor="#6366f1"
    />
  );
}
