import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { CloseIcon, PlusIcon } from '../icons';
import type { FeaturamaStrings } from '../strings/en';

interface HeaderProps {
  strings: FeaturamaStrings;
  onClose?: () => void;
  onAdd: () => void;
  insetTop: number;
}

export function Header({ strings, onClose, onAdd, insetTop }: HeaderProps): JSX.Element {
  const theme = useTheme();

  return (
    <View style={[styles.header, { paddingTop: insetTop + 8 }]}>
      {onClose ? (
        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
          <CloseIcon size={24} color={theme.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} />
      )}
      <Text style={[styles.headerTitle, { color: theme.text }]}>{strings.title}</Text>
      <TouchableOpacity onPress={onAdd} style={styles.headerButton}>
        <PlusIcon size={24} color={theme.accent} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  headerButton: {
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});
