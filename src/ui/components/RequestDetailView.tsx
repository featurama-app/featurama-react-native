import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ChevronLeftIcon, ChevronUpIcon } from '../icons';
import { CommentItem } from './CommentItem';
import { AddCommentForm } from './AddCommentForm';
import type { FeatureRequest, Comment } from '../../types';
import type { FeaturamaStrings } from '../strings/en';

interface RequestDetailViewProps {
  request: FeatureRequest;
  comments: Comment[];
  isLoadingComments: boolean;
  isSubmittingComment: boolean;
  isVotingRequest: boolean;
  commentVotingIds: Set<string>;
  strings: FeaturamaStrings;
  insetTop: number;
  onBack: () => void;
  onToggleRequestVote: () => void;
  onToggleCommentVote: (commentId: string) => void;
  onAddComment: (content: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  Requested: 'New',
  Roadmap: 'Planned',
  InProgress: 'In Progress',
  Done: 'Done',
  Declined: 'Declined',
};

export function RequestDetailView({
  request,
  comments,
  isLoadingComments,
  isSubmittingComment,
  isVotingRequest,
  commentVotingIds,
  strings,
  insetTop,
  onBack,
  onToggleRequestVote,
  onToggleCommentVote,
  onAddComment,
}: RequestDetailViewProps): JSX.Element {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insetTop + 8, backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ChevronLeftIcon size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{request.title}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title + status */}
        <Text style={[styles.title, { color: theme.text }]}>{request.title}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.statusBadge, { backgroundColor: theme.accentLight }]}>
            <Text style={[styles.statusText, { color: theme.accent }]}>
              {STATUS_LABELS[request.status] ?? request.status}
            </Text>
          </View>
          {!request.isApproved && (
            <View style={[styles.statusBadge, { backgroundColor: theme.warningLight }]}>
              <Text style={[styles.statusText, { color: theme.warningText }]}>
                {strings.pendingReview}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text style={[styles.description, { color: theme.textSecondary }]}>{request.description}</Text>

        {/* Vote button */}
        <TouchableOpacity
          style={[styles.voteButton, { backgroundColor: theme.accentLight }]}
          onPress={onToggleRequestVote}
          disabled={isVotingRequest || !request.isApproved}
        >
          {isVotingRequest ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <>
              <ChevronUpIcon size={18} color={theme.accent} />
              <Text style={[styles.voteCount, { color: theme.accent }]}>{request.voteCount}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Comments section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {strings.comments} ({comments.length})
        </Text>

        {isLoadingComments ? (
          <ActivityIndicator size="small" color={theme.accent} style={styles.commentsLoading} />
        ) : comments.length === 0 ? (
          <View style={styles.emptyComments}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{strings.noComments}</Text>
            <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>{strings.noCommentsHint}</Text>
          </View>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isVoting={commentVotingIds.has(comment.id)}
              strings={strings}
              onToggleVote={onToggleCommentVote}
            />
          ))
        )}
      </ScrollView>

      {/* Add comment form */}
      <AddCommentForm
        strings={strings}
        isSubmitting={isSubmittingComment}
        onSubmit={onAddComment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  voteCount: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  commentsLoading: {
    marginTop: 16,
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 13,
    marginTop: 4,
  },
});
