import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  useColorScheme,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  useFeaturama,
  useRequests,
  FeatureRequestStatus,
  type FeatureRequest,
  type RequestFilter,
} from '@featurama/react-native';
import { USER_ID } from '../../src/config';

const FILTERS: Array<{ label: string; value: RequestFilter | undefined }> = [
  { label: 'All', value: undefined },
  { label: 'New', value: 'new' },
  { label: 'Planned', value: 'planned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
];

const STATUS_LABELS: Record<FeatureRequestStatus, string> = {
  [FeatureRequestStatus.Requested]: 'New',
  [FeatureRequestStatus.Roadmap]: 'Planned',
  [FeatureRequestStatus.InProgress]: 'In Progress',
  [FeatureRequestStatus.Done]: 'Done',
  [FeatureRequestStatus.Declined]: 'Declined',
};

const STATUS_COLORS: Record<FeatureRequestStatus, string> = {
  [FeatureRequestStatus.Requested]: '#3b82f6',
  [FeatureRequestStatus.Roadmap]: '#8b5cf6',
  [FeatureRequestStatus.InProgress]: '#f59e0b',
  [FeatureRequestStatus.Done]: '#22c55e',
  [FeatureRequestStatus.Declined]: '#ef4444',
};

export default function ManualScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const { client } = useFeaturama();
  const [activeFilter, setActiveFilter] = useState<RequestFilter | undefined>(
    undefined,
  );
  const { data, isLoading, error, refetch, hasNextPage, fetchNextPage } =
    useRequests({
      filter: activeFilter,
      pageSize: 15,
    });

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<FeatureRequest | null>(
    null,
  );
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Vote loading state (track by request ID)
  const [votingIds, setVotingIds] = useState<Set<string>>(new Set());

  const bg = isDark ? '#111' : '#f9fafb';
  const cardBg = isDark ? '#1c1c1e' : '#fff';
  const textColor = isDark ? '#f1f1f1' : '#111';
  const secondaryText = isDark ? '#8e8e93' : '#6b7280';
  const borderColor = isDark ? '#333' : '#e5e7eb';
  const inputBg = isDark ? '#2c2c2e' : '#f3f4f6';
  const modalBg = isDark ? '#1c1c1e' : '#fff';

  const handleVote = useCallback(
    async (requestId: string) => {
      if (votingIds.has(requestId)) return;

      setVotingIds((prev) => new Set(prev).add(requestId));
      try {
        await client.toggleVote(requestId, USER_ID);
        await refetch();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to toggle vote';
        Alert.alert('Vote Error', message);
      } finally {
        setVotingIds((prev) => {
          const next = new Set(prev);
          next.delete(requestId);
          return next;
        });
      }
    },
    [client, refetch, votingIds],
  );

  const handleCreate = useCallback(async () => {
    if (!createTitle.trim()) {
      Alert.alert('Validation', 'Title is required');
      return;
    }

    setIsCreating(true);
    try {
      await client.createRequest({
        title: createTitle.trim(),
        description: createDescription.trim(),
        submitterIdentifier: USER_ID,
      });
      setShowCreateModal(false);
      setCreateTitle('');
      setCreateDescription('');
      await refetch();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create request';
      Alert.alert('Create Error', message);
    } finally {
      setIsCreating(false);
    }
  }, [client, createTitle, createDescription, refetch]);

  const handleEdit = useCallback(async () => {
    if (!editingRequest || !editTitle.trim()) {
      Alert.alert('Validation', 'Title is required');
      return;
    }

    setIsEditing(true);
    try {
      await client.updateRequest(
        editingRequest.id,
        {
          title: editTitle.trim(),
          description: editDescription.trim(),
        },
        USER_ID,
      );
      setShowEditModal(false);
      setEditingRequest(null);
      await refetch();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update request';
      Alert.alert('Edit Error', message);
    } finally {
      setIsEditing(false);
    }
  }, [client, editingRequest, editTitle, editDescription, refetch]);

  const openEditModal = useCallback((request: FeatureRequest) => {
    setEditingRequest(request);
    setEditTitle(request.title);
    setEditDescription(request.description);
    setShowEditModal(true);
  }, []);

  const renderRequestCard = ({ item }: { item: FeatureRequest }) => {
    const isOwnRequest = item.submitterIdentifier === USER_ID;
    const isVoting = votingIds.has(item.id);

    return (
      <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text
              style={[styles.cardTitle, { color: textColor }]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            {isOwnRequest && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEditModal(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[item.status] + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: STATUS_COLORS[item.status] },
              ]}
            >
              {STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>

        {item.description ? (
          <Text
            style={[styles.cardDescription, { color: secondaryText }]}
            numberOfLines={3}
          >
            {item.description}
          </Text>
        ) : null}

        <View style={styles.cardFooter}>
          <Text style={[styles.cardMeta, { color: secondaryText }]}>
            by {item.submitterIdentifier}
          </Text>

          <TouchableOpacity
            style={[
              styles.voteButton,
              isVoting && styles.voteButtonDisabled,
            ]}
            onPress={() => handleVote(item.id)}
            disabled={isVoting}
            activeOpacity={0.7}
          >
            {isVoting ? (
              <ActivityIndicator size="small" color="#6366f1" />
            ) : (
              <>
                <Text style={styles.voteArrow}>{'\u25B2'}</Text>
                <Text style={styles.voteCount}>{item.voteCount}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) return null;

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: textColor }]}>
            Error Loading Requests
          </Text>
          <Text style={[styles.emptySubtitle, { color: secondaryText }]}>
            {error.message}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refetch}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyTitle, { color: textColor }]}>
          No Feature Requests
        </Text>
        <Text style={[styles.emptySubtitle, { color: secondaryText }]}>
          {activeFilter
            ? `No requests found with filter "${activeFilter}".`
            : 'Tap the + button to create one.'}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Filter chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.value;
            return (
              <TouchableOpacity
                key={f.label}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? '#6366f1' : cardBg,
                    borderColor: isActive ? '#6366f1' : borderColor,
                  },
                ]}
                onPress={() => setActiveFilter(f.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isActive ? '#fff' : secondaryText },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Request count */}
      {data && (
        <Text style={[styles.countText, { color: secondaryText }]}>
          {data.totalCount} request{data.totalCount !== 1 ? 's' : ''} found
        </Text>
      )}

      {/* Request list */}
      <FlatList
        data={data?.items ?? []}
        renderItem={renderRequestCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      {/* FAB to create */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Create modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.modalContainer, { backgroundColor: modalBg }]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.modalCancel, { color: '#6366f1' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              New Request
            </Text>
            <TouchableOpacity onPress={handleCreate} disabled={isCreating}>
              <Text
                style={[
                  styles.modalSubmit,
                  {
                    color: isCreating ? secondaryText : '#6366f1',
                  },
                ]}
              >
                {isCreating ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={[styles.label, { color: secondaryText }]}>Title</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBg, color: textColor, borderColor },
              ]}
              value={createTitle}
              onChangeText={setCreateTitle}
              placeholder="Feature title..."
              placeholderTextColor={secondaryText}
              autoFocus
            />

            <Text style={[styles.label, { color: secondaryText }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: inputBg, color: textColor, borderColor },
              ]}
              value={createDescription}
              onChangeText={setCreateDescription}
              placeholder="Describe the feature..."
              placeholderTextColor={secondaryText}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <Text style={[styles.submitterNote, { color: secondaryText }]}>
              Submitting as: {USER_ID}
            </Text>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.modalContainer, { backgroundColor: modalBg }]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={[styles.modalCancel, { color: '#6366f1' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              Edit Request
            </Text>
            <TouchableOpacity onPress={handleEdit} disabled={isEditing}>
              <Text
                style={[
                  styles.modalSubmit,
                  {
                    color: isEditing ? secondaryText : '#6366f1',
                  },
                ]}
              >
                {isEditing ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={[styles.label, { color: secondaryText }]}>Title</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBg, color: textColor, borderColor },
              ]}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Feature title..."
              placeholderTextColor={secondaryText}
              autoFocus
            />

            <Text style={[styles.label, { color: secondaryText }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: inputBg, color: textColor, borderColor },
              ]}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Describe the feature..."
              placeholderTextColor={secondaryText}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingTop: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  countText: {
    fontSize: 13,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#6366f120',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#6366f1',
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardMeta: {
    fontSize: 12,
    flex: 1,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6366f115',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 56,
    justifyContent: 'center',
  },
  voteButtonDisabled: {
    opacity: 0.5,
  },
  voteArrow: {
    color: '#6366f1',
    fontSize: 12,
  },
  voteCount: {
    color: '#6366f1',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 96,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 30,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  modalCancel: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  modalSubmit: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalBody: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 120,
  },
  submitterNote: {
    fontSize: 12,
    marginTop: 16,
    fontFamily: 'monospace',
  },
});
