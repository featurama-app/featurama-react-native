# Components Documentation

This document describes the reusable components included in the boilerplate.

## Common Components

### Button

A versatile button component with multiple variants and sizes.

**Location:** `src/components/common/Button.tsx`

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Button label text |
| `onPress` | `() => void` | required | Press handler |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Disable interactions |
| `loading` | `boolean` | `false` | Show loading spinner |
| `fullWidth` | `boolean` | `false` | Take full container width |
| `icon` | `ReactNode` | - | Icon to display before text |
| `style` | `ViewStyle` | - | Additional container styles |
| `textStyle` | `TextStyle` | - | Additional text styles |

**Usage:**

```typescript
import { Button } from '../components/common';

// Primary button
<Button title="Submit" onPress={handleSubmit} />

// Outline with icon
<Button
  title="Add Item"
  variant="outline"
  icon={<Plus size={20} color={colors.accent} />}
  onPress={handleAdd}
/>

// Danger button
<Button
  title="Delete"
  variant="danger"
  onPress={handleDelete}
/>

// Loading state
<Button
  title="Saving..."
  loading={isSaving}
  disabled={isSaving}
  onPress={handleSave}
/>
```

---

### Card

A container component with consistent styling and optional press handling.

**Location:** `src/components/common/Card.tsx`

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Card content |
| `onPress` | `() => void` | - | Makes card pressable |
| `padding` | `'none' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Internal padding |
| `style` | `ViewStyle` | - | Additional styles |

**Usage:**

```typescript
import { Card } from '../components/common';

// Basic card
<Card>
  <Text>Card content</Text>
</Card>

// Pressable card
<Card onPress={handleCardPress} padding="large">
  <Text>Tap me!</Text>
</Card>

// Card with custom style
<Card style={{ marginBottom: 16 }}>
  <Text>Styled card</Text>
</Card>
```

---

### Header

A screen header with title, optional back button, and right action.

**Location:** `src/components/common/Header.tsx`

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Header title |
| `subtitle` | `string` | - | Optional subtitle |
| `showBack` | `boolean` | `false` | Show back button |
| `onBackPress` | `() => void` | - | Custom back handler |
| `rightAction` | `ReactNode` | - | Right side content |

**Usage:**

```typescript
import { Header } from '../components/common';

// Simple header
<Header title="Settings" />

// With back button
<Header title="Profile" showBack />

// With subtitle and right action
<Header
  title="Messages"
  subtitle="5 unread"
  rightAction={
    <Pressable onPress={handleNew}>
      <Plus size={24} color={colors.accent} />
    </Pressable>
  }
/>

// Custom back handler
<Header
  title="Edit"
  showBack
  onBackPress={() => {
    if (hasChanges) {
      showConfirmDialog();
    } else {
      router.back();
    }
  }}
/>
```

---

### ScreenLayout

Base layout component for screens with safe area handling and optional scrolling.

**Location:** `src/components/common/ScreenLayout.tsx`

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Screen content |
| `scrollable` | `boolean` | `false` | Enable scrolling |
| `safeArea` | `boolean` | `true` | *Deprecated* Use safeAreaTop/safeAreaBottom |
| `safeAreaTop` | `boolean` | `true` | Apply top safe area padding |
| `safeAreaBottom` | `boolean` | `false` | Apply bottom safe area padding |
| `androidOnly` | `boolean` | `false` | Only apply safe area on Android |
| `padding` | `boolean` | `true` | Apply horizontal padding |
| `extraPaddingTop` | `number` | `0` | Additional top padding |
| `extraPaddingBottom` | `number` | `0` | Additional bottom padding |
| `refreshControl` | `ReactElement` | - | Pull-to-refresh control |

**Usage:**

```typescript
import { ScreenLayout } from '../components/common';

// Basic screen
<ScreenLayout>
  <Text>Screen content</Text>
</ScreenLayout>

// Scrollable screen
<ScreenLayout scrollable>
  <Text>Long content...</Text>
</ScreenLayout>

// Modal with Android-only safe area
<ScreenLayout androidOnly safeAreaBottom>
  <Text>Modal content</Text>
</ScreenLayout>

// With pull-to-refresh
<ScreenLayout
  scrollable
  refreshControl={
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
    />
  }
>
  <Text>Pull to refresh</Text>
</ScreenLayout>
```

---

## Dialog Components

### ChangelogSheet

A bottom sheet for displaying app update changelogs.

**Location:** `src/components/dialogs/ChangelogSheet.tsx`

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | required | Show/hide the sheet |
| `version` | `string` | required | Version number |
| `buildNumber` | `string` | required | Build number |
| `releaseNotes` | `string` | required | Release notes text |
| `onDismiss` | `() => void` | required | Dismiss handler |

**Usage:**

```typescript
import { ChangelogSheet } from '../components/dialogs';

const [showChangelog, setShowChangelog] = useState(false);

<ChangelogSheet
  visible={showChangelog}
  version="1.2.0"
  buildNumber="45"
  releaseNotes="- New feature\n- Bug fixes\n- Performance improvements"
  onDismiss={() => setShowChangelog(false)}
/>
```

---

## Component Best Practices

### Theme Integration

Always use the theme colors from the store:

```typescript
import { useThemeStore } from '../../stores/themeStore';

function MyComponent() {
  const colors = useThemeStore((state) => state.colors);

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Themed text</Text>
    </View>
  );
}
```

### Accessibility

Include accessibility props for better UX:

```typescript
<Pressable
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  accessibilityHint="Double tap to submit the form"
>
  <Text>Submit</Text>
</Pressable>
```

### Performance

Use memoization for expensive renders:

```typescript
import React, { memo } from 'react';

export const ExpensiveComponent = memo(({ data }) => {
  // Expensive render
});
```

### Type Safety

Always define proper TypeScript interfaces:

```typescript
interface MyComponentProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
  variant = 'primary',
}) => {
  // Component implementation
};
```
