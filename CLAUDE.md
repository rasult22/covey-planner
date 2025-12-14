# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Covey Planner is a React Native mobile application built with Expo that implements Stephen Covey's time management principles (quadrants, priorities, big rocks). It helps users plan their days and weeks with foundation elements (mission, values, roles, goals).

## Development Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web

# Linting
npm run lint

# Reset project (moves starter code to app-example/)
npm run reset-project
```

## Architecture

### Tech Stack
- **Framework**: Expo 54 with React Native 0.81
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React hooks + AsyncStorage (no external state library)
- **Language**: TypeScript with strict mode enabled
- **Path Aliases**: `@/*` maps to project root

### Route Groups & Navigation

The app uses Expo Router with three main route groups defined in [app/_layout.tsx](app/_layout.tsx):

1. **`(onboarding)/`** - Initial setup flow (welcome, mission, values, roles, goals)
2. **`(tabs)/`** - Main app navigation with 5 tabs:
   - `today` - Daily task planning with A-B-C priorities
   - `week` - Weekly planning with "big rocks"
   - `matrix` - Quadrant-based view
   - `goals` - Long-term goal management
   - `profile` - User profile and settings
3. **`(modals)/`** - Modal screens for editing/viewing details

Entry point [app/index.tsx](app/index.tsx) checks onboarding status and routes to either `(onboarding)/welcome` or `(tabs)/today`.

### Data Architecture

**Storage Layer**: Centralized [AsyncStorageService](lib/storage/AsyncStorageService.ts) wraps `@react-native-async-storage/async-storage` with type-safe methods. All data persists locally.

**Data Access Pattern**: Custom hooks in `hooks/` directory provide CRUD operations:
- `hooks/foundation/` - Mission, values, roles, goals
- `hooks/planning/` - Daily tasks, weekly plans, big rocks
- `hooks/gamification/` - Streaks, achievements, promises
- `hooks/reflection/` - Weekly reflections
- `hooks/analytics/` - Quadrant statistics
- `hooks/settings/` - Notifications and data management

Each hook follows this pattern:
```typescript
export function useHookName() {
  const [data, setData] = useState<Type>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load from storage on mount
  // Return { data, isLoading, error, save, update, delete, reload }
}
```

**Type Definitions**: All types defined in [types/index.ts](types/index.ts) including:
- Foundation entities: `Value`, `Role`, `LongTermGoal`, `GoalStep`
- Planning: `DailyTask`, `BigRock`, `WeeklyPlan`, `CalendarEvent`
- Gamification: `Promise3010`, `StreakData`, `Achievement`
- Analytics: `QuadrantStats`, `WeeklyReflection`
- Enums: `Quadrant`, `Priority`, `TaskStatus`
- Storage keys in `STORAGE_KEYS` constant

### Key Concepts

**Quadrants** (Covey Matrix):
- `I` - Urgent & Important
- `II` - Not Urgent & Important (focus area)
- `III` - Urgent & Not Important
- `IV` - Not Urgent & Not Important

**Priorities**: Tasks use A-B-C prioritization (A = highest)

**Big Rocks**: Weekly high-priority items (always Quadrant II), tracked by week ID (`YYYY-WW`)

**Daily Tasks**: Date-based (`YYYY-MM-DD`), include timer functionality for time tracking

### UI Components

Reusable UI components in [components/ui/](components/ui/):
- `Button.tsx` - Primary/secondary/ghost variants
- `Input.tsx` - Text input with consistent styling
- `Card.tsx` - Container component

Design tokens centralized in `lib/constants/`:
- [colors.ts](lib/constants/colors.ts) - Color palette and theme
- [typography.ts](lib/constants/typography.ts) - Font sizes and weights
- [spacing.ts](lib/constants/spacing.ts) - Padding and gap values

### Services

- [AsyncStorageService.ts](lib/storage/AsyncStorageService.ts) - All local storage operations
- [NotificationService.ts](lib/notifications/NotificationService.ts) - Push notification scheduling
- [DataService.ts](lib/import-export/DataService.ts) - Data import/export functionality

## Development Notes

- New React compiler enabled via `experiments.reactCompiler: true` in [app.json](app.json)
- Typed routes enabled via `experiments.typedRoutes: true`
- First day of week is Sunday (US standard)
- Dark mode support configured but implementation may be incomplete
- The app uses StyleSheet.create for most styling, not Tailwind classes (despite NativeWind setup)
