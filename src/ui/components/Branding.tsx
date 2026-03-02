import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { FeaturamaLogoIcon } from '../icons/FeaturamaLogoIcon';

export function Branding(): JSX.Element {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => Linking.openURL('https://featurama.app')}
        style={[styles.container, { backgroundColor: theme.gray100 }]}
      >
        <FeaturamaLogoIcon size={16} color={theme.accent} />
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          Powered by Featurama
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
  },
});
