# Coding Standards — My Golf App

Expo React Native app built with TypeScript, NativeWind, and Expo Router. These standards are derived from the conventions established in the [Personal_Native_App](https://github.com/RSpan2/Personal_Native_App) project.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [TypeScript](#typescript)
3. [Naming Conventions](#naming-conventions)
4. [Component Structure](#component-structure)
5. [Styling](#styling)
6. [State Management](#state-management)
7. [Data Fetching](#data-fetching)
8. [Navigation & Routing](#navigation--routing)
9. [Imports](#imports)
10. [Error Handling & Loading States](#error-handling--loading-states)
11. [Code Organization](#code-organization)
12. [Configuration](#configuration)

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

- Use **NativeWind utility classes** for all layout and styling. Avoid custom `StyleSheet.create` unless a style cannot be expressed with Tailwind utilities.
- Use inline `style` props only for computed/dynamic values (e.g., pixel dimensions, animated transform values).
- Maintain a consistent dark theme. Use the configured background color across screens.
- Stick to the Tailwind color palette — do not hard-code hex values unless they are in `tailwind.config.js`.

```typescript
// Good — NativeWind classes
<View className="flex-1 bg-gray-950 px-4">
  <Text className="text-white text-lg font-semibold">Player Name</Text>
</View>

// Acceptable — computed dimension only
<Image style={{ width: 48, height: 48 }} source={{ uri: logoUrl }} />

// Avoid — mixing StyleSheet and NativeWind unnecessarily
const styles = StyleSheet.create({ container: { padding: 16 } });
<View style={styles.container} className="bg-gray-950" />
```

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
