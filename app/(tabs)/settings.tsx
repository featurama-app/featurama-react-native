import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { config, USER_ID } from '../../src/config';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const [apiKey, setApiKey] = useState(config.apiKey);
  const [baseUrl, setBaseUrl] = useState(config.baseUrl ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!apiKey.startsWith('fm_live_')) {
      Alert.alert('Invalid API Key', 'API key must start with "fm_live_"');
      return;
    }

    config.apiKey = apiKey;
    config.baseUrl = baseUrl || undefined;

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    Alert.alert(
      'Config Saved',
      'Configuration updated. Restart the app for changes to take full effect.',
    );
  };

  const bg = isDark ? '#111' : '#f9fafb';
  const cardBg = isDark ? '#1c1c1e' : '#fff';
  const textColor = isDark ? '#f1f1f1' : '#111';
  const secondaryText = isDark ? '#8e8e93' : '#6b7280';
  const borderColor = isDark ? '#333' : '#e5e7eb';
  const inputBg = isDark ? '#2c2c2e' : '#f3f4f6';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          SDK Configuration
        </Text>

        <Text style={[styles.label, { color: secondaryText }]}>API Key</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, color: textColor, borderColor },
          ]}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="fm_live_..."
          placeholderTextColor={secondaryText}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={[styles.label, { color: secondaryText }]}>Base URL</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, color: textColor, borderColor },
          ]}
          value={baseUrl}
          onChangeText={setBaseUrl}
          placeholder="http://localhost:5001"
          placeholderTextColor={secondaryText}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <TouchableOpacity
          style={[styles.saveButton, saved && styles.savedButton]}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>
            {saved ? 'Saved!' : 'Save Configuration'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Connection Status
        </Text>

        <View style={styles.statusRow}>
          <Text style={[styles.statusLabel, { color: secondaryText }]}>
            API Key:
          </Text>
          <Text
            style={[
              styles.statusValue,
              {
                color: config.apiKey.startsWith('fm_live_')
                  ? '#22c55e'
                  : '#ef4444',
              },
            ]}
          >
            {config.apiKey.startsWith('fm_live_')
              ? `${config.apiKey.substring(0, 16)}...`
              : 'Not configured'}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.statusLabel, { color: secondaryText }]}>
            Base URL:
          </Text>
          <Text style={[styles.statusValue, { color: textColor }]}>
            {config.baseUrl || 'Default (api.featurama.io)'}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.statusLabel, { color: secondaryText }]}>
            User ID:
          </Text>
          <Text
            style={[styles.statusValue, { color: textColor }]}
            numberOfLines={1}
          >
            {USER_ID}
          </Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          About
        </Text>
        <Text style={[styles.aboutText, { color: secondaryText }]}>
          This is a test app for the Featurama React Native SDK. Use the tabs
          above to test the pre-built UI component or interact with the API
          manually.
        </Text>
        <Text style={[styles.aboutText, { color: secondaryText }]}>
          The "Pre-built" tab shows the SDK's built-in FeatureRequestsScreen
          component. The "Manual" tab lets you test individual API calls using
          the SDK hooks.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    fontFamily: 'monospace',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  savedButton: {
    backgroundColor: '#22c55e',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    flexShrink: 1,
    marginLeft: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});
