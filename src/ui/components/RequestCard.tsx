import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ChevronUpIcon, ChatBubbleIcon } from '../icons';
import type { FeatureRequest } from '../../types';
import type { FeaturamaStrings } from '../strings/en';

interface RequestCardProps {
  request: FeatureRequest;
  isVoting: boolean;
  strings: FeaturamaStrings;
  onToggleVote: (id: string) => void;
  onPress: (request: FeatureRequest) => void;
}

export function RequestCard({ request, isVoting, strings, onToggleVote, onPress }: RequestCardProps): JSX.Element {
  const theme = useTheme();
  const commentCount = request.commentCount ?? 0;
  const isPending = !request.isApproved;
  const isPlanned = String(request.status) === 'Roadmap';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(request)}
      style={[
        styles.requestItem,
        { backgroundColor: theme.card, borderColor: isPending ? theme.warning : theme.border },
        isPending && { opacity: 0.85 },
      ]}
    >
      <TouchableOpacity
        style={[styles.voteButton, { backgroundColor: theme.accentLight }]}
        onPress={() => onToggleVote(request.id)}
        disabled={isVoting || isPending}
      >
        {isVoting ? (
          <ActivityIndicator size="small" color={theme.accent} />
        ) : (
          <>
            <ChevronUpIcon size={20} color={theme.accent} />
            <Text style={[styles.voteCount, { color: theme.accent }]}>{request.voteCount}</Text>
          </>
        )}
      </TouchableOpacity>
      <View style={styles.requestContent}>
        <Text style={[styles.requestTitle, { color: theme.text }]}>{request.title}</Text>
        {isPending && (
          <View style={[styles.pendingBadge, { backgroundColor: theme.warningLight }]}>
            <Text style={[styles.pendingText, { color: theme.warningText }]}>
              {strings.pendingReview}
            </Text>
          </View>
        )}
        {isPlanned && !isPending && (
          <View style={[styles.pendingBadge, { backgroundColor: theme.accentLight }]}>
            <Text style={[styles.pendingText, { color: theme.accent }]}>
              {strings.badgePlanned}
            </Text>
          </View>
        )}
        {request.description ? (
          <Text style={[styles.requestDescription, { color: theme.textSecondary }]} numberOfLines={2}>
            {request.description}
          </Text>
        ) : null}
        {commentCount > 0 && (
          <View style={styles.commentRow}>
            <ChatBubbleIcon size={14} color={theme.textSecondary} />
            <Text style={[styles.commentCount, { color: theme.textSecondary }]}>
              {strings.commentsCount.replace('{count}', String(commentCount))}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  requestItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  voteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 48,
  },
  voteCount: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  requestContent: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  requestDescription: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  commentCount: {
    fontSize: 12,
  },
  pendingBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
