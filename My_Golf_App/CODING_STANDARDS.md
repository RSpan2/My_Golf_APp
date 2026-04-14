# Coding Standards — My Golf App

Expo React Native app built with TypeScript, NativeWind, and Expo Router. These standards are derived from the conventions established in the [Personal_Native_App](https://github.com/RSpan2/Personal_Native_App) project.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [TypeScript](#typescript)
3. [Naming Conventions](#naming-conventions)
4. [Component Structure](#component-structure)
5. [Styling](#styling)
6. [Visual Design System](#visual-design-system)
7. [State Management](#state-management)
8. [Data Fetching](#data-fetching)
9. [Navigation & Routing](#navigation--routing)
10. [Imports](#imports)
11. [Error Handling & Loading States](#error-handling--loading-states)
12. [Code Organization](#code-organization)
13. [Configuration](#configuration)

---

## Project Structure

```
My_Golf_App/
├── app/                        # Expo Router screens (file-based routing)
│   ├── (tabs)/                 # Tabbed navigation group
│   │   ├── _layout.tsx         # Tab navigation config
│   │   └── index.tsx           # Home/default tab
│   ├── _layout.tsx             # Root layout
│   └── globals.css             # Global Tailwind directives
├── components/                 # Reusable UI components
│   └── <feature>/              # Sub-folder for feature-specific components
├── services/                   # API calls and custom hooks
│   ├── api.ts                  # API endpoints and config
│   └── useFetch.ts             # Generic data-fetching hook
├── assets/                     # Images, fonts, and static files
└── constants/                  # App-wide constants (colors, config values)
```

- Each screen lives inside `app/` following Expo Router conventions.
- Reusable UI lives in `components/`. If a component is only used within a single screen, colocate it in a sub-folder named after the screen (e.g., `components/gameDetails/`).
- All API logic and custom hooks go in `services/`.

---

## TypeScript

- **Strict mode is required.** `tsconfig.json` has `"strict": true` — never disable this.
- Use the `@/*` path alias for all imports from the project root (no relative `../../` climbing).
- Explicitly type all function parameters and return types.
- Use generic types where data shape is dynamic (e.g., `useFetch<T>`).
- Prefer `interface` for object shapes that represent component props or API responses; use `type` for unions, intersections, and utility types.

```typescript
// Good
interface GameCardProps {
  gameId: string;
  score: number;
  isLive: boolean;
}

const GameCard = ({ gameId, score, isLive }: GameCardProps): JSX.Element => { ... };

// Avoid
const GameCard = (props: any) => { ... };
```

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `ScoreCard`, `PlayerRow` |
| Screen files | camelCase | `schedule.tsx`, `standings.tsx` |
| Layout files | Expo Router convention | `_layout.tsx` |
| Dynamic route files | Bracket notation | `[id].tsx` |
| Variables & functions | camelCase | `gameDate`, `fetchScores` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `GOLF_CONFIG` |
| Boolean variables | Prefix with `is` or `has` | `isLive`, `hasError`, `isFinal` |
| Custom hooks | Prefix with `use` | `useFetch`, `useScores` |
| Type/Interface names | PascalCase | `Player`, `RoundDetails` |

---

## Component Structure

- One component per file. Exceptions are tightly coupled sub-components used only within a parent (keep them in the same file and do not export them).
- Define props inline or as a named interface directly above the component.
- Use `export default` at the end of the file.
- Destructure props in the function signature.

```typescript
// components/ScoreCard.tsx

import { View, Text } from 'react-native';

interface ScoreCardProps {
  playerName: string;
  totalScore: number;
  isLeader?: boolean;
}

const ScoreCard = ({ playerName, totalScore, isLeader = false }: ScoreCardProps) => {
  return (
    <View className="flex-row justify-between px-4 py-2">
      <Text className="text-white font-medium">{playerName}</Text>
      <Text className={isLeader ? 'text-yellow-400' : 'text-gray-300'}>
        {totalScore > 0 ? `+${totalScore}` : totalScore}
      </Text>
    </View>
  );
};

export default ScoreCard;
```

---

## Styling

- Use **`StyleSheet.create`** for all screen-level and feature component styling. NativeWind `className` props are unreliable in Expo Go (styles silently fail to apply), so `StyleSheet` is the safe default.
- Use NativeWind `className` only for simple, text-level utilities (e.g., `font-bold`, `text-center`) where a StyleSheet entry would add noise. Never rely on `className` for background colors, borders, or layout on container views.
- Use inline `style` props only for pressed-state callbacks and truly computed/dynamic values.
- Do not hard-code hex colors inline — reference the palette constants in the [Visual Design System](#visual-design-system) section below.

```typescript
// Good — StyleSheet for containers and cards
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
});
<View style={styles.card} />

// Acceptable — pressed-state inline callback
<Pressable style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]} />

// Avoid — NativeWind for background/border/layout (unreliable in Expo Go)
<View className="bg-gray-900 rounded-xl border border-gray-800" />
```

---

## Visual Design System

All screens share a single dark theme. Use these values exclusively — do not introduce new colors without updating this section.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `bg-page` | `#0d0d0d` | Screen/page background |
| `bg-header` | `#111111` | Header bars |
| `bg-card` | `#1a1a1a` | Card backgrounds |
| `bg-chip` | `#242424` | Stat chip backgrounds |
| `bg-chip-pressed` | `#2e2e2e` | Stat chip pressed state |
| `bg-badge` | `#1e3a2f` | Short-name badge background |
| `border-subtle` | `#2a2a2a` | Card and header borders |
| `text-primary` | `#ffffff` | Club names, values, headings |
| `text-muted` | `#6b7280` | Stat labels, empty states |
| `text-hint` | `#4b5563` | Placeholder / hint text |
| `text-section` | `#16a34a` | Section headers (green) |
| `text-badge` | `#4ade80` | Badge text (green-400) |
| `icon-muted` | `#9ca3af` | Secondary icons (settings, etc.) |
| `icon-empty` | `#374151` | Empty-state icons |

### Screen Layout Pattern

Every screen follows this shell:

```typescript
<SafeAreaView style={{ flex: 1, backgroundColor: '#0d0d0d' }} edges={['top']}>
  {/* Header */}
  <View style={{
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    backgroundColor: '#111111', borderBottomWidth: 1, borderBottomColor: '#2a2a2a',
  }}>
    <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '700' }}>Title</Text>
  </View>

  {/* Content */}
  <ScrollView style={{ flex: 1 }}>
    {/* Section header */}
    <Text style={{
      color: '#16a34a', fontSize: 11, fontWeight: '600',
      textTransform: 'uppercase', letterSpacing: 1.2,
      paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8,
    }}>
      Section Name
    </Text>

    {/* Cards */}
  </ScrollView>
</SafeAreaView>
```

### Card Pattern

```typescript
<View style={{
  backgroundColor: '#1a1a1a',
  borderRadius: 16,
  marginHorizontal: 20,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#2a2a2a',
}}>
  <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
    {/* Card header: title left, badge right */}
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>Name</Text>
      <View style={{ backgroundColor: '#1e3a2f', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
        <Text style={{ color: '#4ade80', fontSize: 12, fontWeight: '600' }}>Badge</Text>
      </View>
    </View>

    {/* Tappable stat chips */}
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
      <Pressable style={({ pressed }) => ({
        backgroundColor: pressed ? '#2e2e2e' : '#242424',
        borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
      })}>
        <Text style={{ color: '#6b7280', fontSize: 11 }}>Label</Text>
        <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600' }}>Value</Text>
      </Pressable>
    </View>
  </View>
</View>
```

### Typography Scale

| Role | Size | Weight | Color |
|---|---|---|---|
| Screen title | 20 | 700 | `#ffffff` |
| Card title | 16 | 700 | `#ffffff` |
| Section header | 11 | 600 | `#16a34a` |
| Chip value | 14 | 600 | `#ffffff` |
| Chip label | 11 | 400 | `#6b7280` |
| Badge text | 12 | 600 | `#4ade80` |
| Body / list item | 14–16 | 400 | `#ffffff` |
| Muted / hint | 13–16 | 400 | `#6b7280` or `#4b5563` |

---

## State Management

- Use **local component state** (`useState`) as the default. Do not introduce a global state library unless local state becomes genuinely insufficient.
- Use `useRef` for mutable values that should not trigger re-renders (e.g., scroll position, pagination cursors, interval IDs).
- Keep `useEffect` dependency arrays accurate and minimal — list exactly what the effect depends on, nothing more.
- Do not lift state higher than necessary.

```typescript
const [scores, setScores] = useState<Score[]>([]);
const pageRef = useRef<number>(0);

useEffect(() => {
  fetchScores(pageRef.current);
}, [courseId]);
```

---

## Data Fetching

- Centralize all API base URLs and headers in `services/api.ts` using a config object (e.g., `GOLF_CONFIG`).
- All API calls use `async/await`. Do not use `.then()` chains.
- Use the generic `useFetch<T>` hook for data fetching in components. It provides `data`, `loading`, `error`, `refetch`, and `reset`.
- Use `autoFetch: false` for data that should only be loaded on demand (e.g., detail stats).
- Auto-refresh live/in-progress data on a polling interval; clear the interval on unmount.

```typescript
// services/api.ts
export const GOLF_CONFIG = {
  BASE_URL: 'https://api.example.com',
  headers: { 'Content-Type': 'application/json' },
};

export const fetchLeaderboard = async (tournamentId: string) => {
  const res = await fetch(`${GOLF_CONFIG.BASE_URL}/leaderboard/${tournamentId}`, {
    headers: GOLF_CONFIG.headers,
  });
  return res.json();
};

// In a component
const { data, loading, error, refetch } = useFetch<Leaderboard>(
  () => fetchLeaderboard(tournamentId)
);
```

---

## Navigation & Routing

- Use **Expo Router file-based routing** exclusively — do not use the older React Navigation stack setup.
- Group related screens under a parenthesized folder (e.g., `(tabs)/`).
- Use `[id].tsx` for dynamic routes and `useLocalSearchParams` to read the parameter.
- Use the `<Link>` component from `expo-router` for navigation within JSX; use `router.push()` for imperative navigation.

```typescript
// Dynamic route — app/round/[id].tsx
import { useLocalSearchParams } from 'expo-router';

const RoundDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  // ...
};

// Navigation link
import { Link } from 'expo-router';
<Link href={`/round/${roundId}`} asChild>
  <Pressable>...</Pressable>
</Link>
```

---

## Imports

Order imports as follows, separated by a blank line between each group:

1. React and React Native core (`react`, `react-native`)
2. Expo and third-party libraries (`expo-router`, `nativewind`, etc.)
3. Local components (`@/components/...`)
4. Local services and hooks (`@/services/...`)
5. Local constants and types (`@/constants/...`)

```typescript
import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';

import { Link, useLocalSearchParams } from 'expo-router';

import ScoreCard from '@/components/ScoreCard';
import PlayerRow from '@/components/PlayerRow';

import { useFetch } from '@/services/useFetch';
import { fetchLeaderboard } from '@/services/api';

import { GOLF_CONFIG } from '@/constants/config';
```

---

## Error Handling & Loading States

- Always handle `loading` and `error` states returned from `useFetch` before rendering data.
- Show `ActivityIndicator` while loading.
- Show a human-readable fallback message on error — do not expose raw error objects to the UI.
- Do not silently swallow errors; at minimum log them in development.

```typescript
if (loading) return <ActivityIndicator className="flex-1" color="#fff" />;
if (error) return <Text className="text-red-400 text-center mt-4">Failed to load scores.</Text>;
```

---

## Code Organization

- **No premature abstractions.** Only extract a helper or utility when it is used in more than one place.
- Do not add docstrings, JSDoc comments, or type annotations to code you did not change.
- Only add inline comments where the logic is genuinely non-obvious.
- Do not add error handling for scenarios that cannot realistically occur.
- Keep components focused — if a component file exceeds ~200 lines, consider splitting it.

---

## Configuration

| File | Purpose |
|---|---|
| `tsconfig.json` | TypeScript — strict mode, `@/*` alias |
| `app.json` | Expo app metadata, plugins, and experiments |
| `babel.config.js` | Expo preset + NativeWind babel plugin |
| `tailwind.config.js` | Tailwind theme extension and content paths |
| `metro.config.js` | Metro bundler — NativeWind CSS support |
| `eslint.config.js` | ESLint flat config using `eslint-config-expo` |
| `nativewind-env.d.ts` | NativeWind TypeScript type definitions |

- Do not disable ESLint rules inline without a comment explaining why.
- Do not alter `tsconfig.json` `strict` settings.
- Typed routes (`experiments.typedRoutes`) and the React Compiler (`experiments.reactCompiler`) are enabled — keep them on.
