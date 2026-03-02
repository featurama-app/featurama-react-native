# @featurama/react-native

React Native SDK for [Featurama](https://featurama.io) - Feature request management for mobile apps.

> Status: MVP available. This is the currently supported production SDK.

This is a JavaScript-only SDK (no native modules) that works with both React Native and React web applications.
It also works in Expo apps (managed workflow and development builds).

The API base URL is fixed to `https://featurama.app` and is not configurable in the SDK.

## Installation

```bash
npm install @featurama/react-native
# or
yarn add @featurama/react-native
```

## Quick Start

### 1. Wrap your app with the provider

```tsx
import { FeaturamaProvider } from '@featurama/react-native';

function App() {
  return (
    <FeaturamaProvider
      config={{
        apiKey: 'fm_live_xxxxxxxxxxxxxxxxxxxx',
      }}
    >
      <YourApp />
    </FeaturamaProvider>
  );
}
```

### 2. Use the hooks

```tsx
import { useRequests, useFeaturama } from '@featurama/react-native';

function FeatureRequestList() {
  const { data, isLoading, error, refetch, hasNextPage, fetchNextPage } = useRequests({
    pageSize: 20,
  });

  if (isLoading && !data) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={data?.items}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
          <Text>{item.voteCount} votes</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      onEndReached={() => hasNextPage && fetchNextPage()}
      refreshing={isLoading}
      onRefresh={refetch}
    />
  );
}
```

### 3. Create and vote on requests

```tsx
import { useFeaturama, FeaturamaError } from '@featurama/react-native';

function CreateRequestForm() {
  const { client } = useFeaturama();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      const request = await client.createRequest({
        title,
        description,
        submitterIdentifier: 'user-unique-id', // Your user's unique identifier
      });
      console.log('Created request:', request.id);
    } catch (error) {
      if (error instanceof FeaturamaError) {
        console.error('Error code:', error.code);
      }
    }
  };

  return (
    <View>
      <TextInput value={title} onChangeText={setTitle} placeholder="Title" />
      <TextInput value={description} onChangeText={setDescription} placeholder="Description" />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
```

### 4. Vote toggle

```tsx
function VoteButton({ requestId }: { requestId: string }) {
  const { client } = useFeaturama();
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    const result = await client.toggleVote(requestId, 'user-unique-id');
    setIsVoting(result.isVoting);
    console.log('Vote count:', result.request.voteCount);
  };

  return (
    <Button
      title={isVoting ? 'Remove Vote' : 'Vote'}
      onPress={handleVote}
    />
  );
}
```

## API Reference

### FeaturamaProvider

Provider component that initializes the SDK.

```tsx
<FeaturamaProvider config={FeaturamaConfig}>
  {children}
</FeaturamaProvider>
```

#### FeaturamaConfig

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `apiKey` | `string` | Yes | - | Your API key (starts with `fm_live_`) |
| `timeout` | `number` | No | `10000` | Request timeout in ms |

### useFeaturama()

Hook to access the Featurama client.

```tsx
const { client, isInitialized } = useFeaturama();
```

### useRequests(options?)

Hook for fetching feature requests with pagination.

```tsx
const {
  data,        // PaginatedResponse<FeatureRequest> | null
  isLoading,   // boolean
  error,       // Error | null
  refetch,     // () => Promise<void>
  hasNextPage, // boolean
  fetchNextPage, // () => Promise<void>
} = useRequests({ pageSize: 20 });
```

### FeaturamaClient

The client can be used directly for more control.

#### Methods

```typescript
// Get paginated feature requests
client.getRequests({ page?: number, pageSize?: number }): Promise<PaginatedResponse<FeatureRequest>>

// Create a new feature request
client.createRequest({
  title: string,
  description: string,
  submitterIdentifier: string,
}): Promise<FeatureRequest>

// Update a feature request (only by original submitter)
client.updateRequest(
  id: string,
  { title: string, description: string },
  submitterIdentifier: string
): Promise<FeatureRequest>

// Vote for a request
client.vote(requestId: string, voterIdentifier: string): Promise<FeatureRequest>

// Remove vote from a request
client.removeVote(requestId: string, voterIdentifier: string): Promise<FeatureRequest>

// Toggle vote (vote if not voted, remove if already voted)
client.toggleVote(requestId: string, voterIdentifier: string): Promise<ToggleVoteResult>
```

## Types

### FeatureRequest

```typescript
interface FeatureRequest {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  source: FeatureRequestSource;
  voteCount: number;
  submitterIdentifier: string;
  createdAt: string;
}
```

### FeatureRequestStatus

```typescript
enum FeatureRequestStatus {
  Requested = 0,
  Roadmap = 1,
  InProgress = 2,
  Done = 3,
  Declined = 4,
}
```

### FeatureRequestSource

```typescript
enum FeatureRequestSource {
  SDK = 0,
  Dashboard = 1,
}
```

## Error Handling

The SDK throws `FeaturamaError` for API errors.

```typescript
import { FeaturamaError, FeaturamaErrorCode } from '@featurama/react-native';

try {
  await client.vote(requestId, voterId);
} catch (error) {
  if (error instanceof FeaturamaError) {
    switch (error.code) {
      case FeaturamaErrorCode.CONFLICT:
        console.log('Already voted');
        break;
      case FeaturamaErrorCode.NOT_FOUND:
        console.log('Request not found');
        break;
      case FeaturamaErrorCode.UNAUTHORIZED:
        console.log('Invalid API key');
        break;
      case FeaturamaErrorCode.NETWORK_ERROR:
        console.log('Network error');
        break;
      case FeaturamaErrorCode.TIMEOUT:
        console.log('Request timed out');
        break;
    }
  }
}
```

## License

MIT
