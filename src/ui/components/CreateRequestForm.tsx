import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SendIcon } from '../icons';
import type { FeaturamaStrings } from '../strings/en';

interface CreateRequestFormProps {
  strings: FeaturamaStrings;
  emailCollection: 'none' | 'optional' | 'required';
  onSubmit: (title: string, description: string, email?: string) => Promise<void>;
  onCancel: () => void;
}

export function CreateRequestForm({
  strings,
  emailCollection,
  onSubmit,
  onCancel,
}: CreateRequestFormProps): JSX.Element {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = title.trim() && !isSubmitting &&
    (emailCollection !== 'required' || email.trim());

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), description.trim(), email.trim() || undefined);
      setTitle('');
      setDescription('');
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, title, description, email, onSubmit]);

  return (
    <View style={[styles.formContainer, { backgroundColor: theme.card, borderColor: theme.borderAccent }]}>
      <TextInput
        style={[styles.input, { backgroundColor: theme.secondary, color: theme.text }]}
        value={title}
        onChangeText={setTitle}
        placeholder={strings.titlePlaceholder}
        placeholderTextColor={theme.textSecondary}
        autoFocus
      />
      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: theme.secondary, color: theme.text }]}
        value={description}
        onChangeText={setDescription}
        placeholder={strings.descriptionPlaceholder}
        placeholderTextColor={theme.textSecondary}
        multiline
        numberOfLines={3}
      />
      {emailCollection !== 'none' && (
        <View>
          <TextInput
            style={[styles.input, { backgroundColor: theme.secondary, color: theme.text }]}
            value={email}
            onChangeText={setEmail}
            placeholder={strings.emailPlaceholder}
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={[styles.emailHint, { color: theme.textSecondary }]}>
            {emailCollection === 'required' ? strings.emailRequired : strings.emailEncouragement}
          </Text>
        </View>
      )}
      <View style={styles.formActions}>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: theme.secondary }]}
          onPress={onCancel}
        >
          <Text style={[styles.cancelText, { color: theme.text }]}>{strings.cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.accent, opacity: !canSubmit ? 0.5 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={theme.accentForeground} />
          ) : (
            <>
              <SendIcon size={16} color={theme.accentForeground} />
              <Text style={[styles.submitText, { color: theme.accentForeground }]}>
                {strings.submit}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  emailHint: {
    fontSize: 13,
    marginTop: -8,
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
