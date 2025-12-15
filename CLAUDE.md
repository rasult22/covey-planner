# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Principle-Centered Planner is a React Native mobile application built with Expo that implements time management principles including quadrants, priorities, and big rocks. It helps users plan their days and weeks with foundation elements (mission, values, roles, goals).

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
- **React**: Version 19.1.0 (with new React compiler enabled)
- **Routing**: Expo Router 6.0.19 (file-based routing)
- **Styling**: NativeWind 4.2.1 (Tailwind CSS for React Native) + StyleSheet.create
- **State Management**: React hooks + AsyncStorage (no external state library)
- **Language**: TypeScript 5.9.2 with strict mode enabled
- **Date Utilities**: date-fns 4.1.0
- **Path Aliases**: `@/*` maps to project root
- **Testing**: No testing framework configured

### Route Groups & Navigation

The app uses Expo Router with three main route groups defined in [app/_layout.tsx](app/_layout.tsx):

1. **`(onboarding)/`** - Stack-based onboarding flow with 7 screens:
   - `welcome.tsx` - Welcome screen
   - `philosophy.tsx` - Philosophy introduction
   - `setup-mission.tsx` - Mission statement setup
   - `setup-values.tsx` - Values selection
   - `setup-roles.tsx` - Life roles definition
   - `setup-goals.tsx` - Goal setting
   - `complete.tsx` - Onboarding completion

2. **`(tabs)/`** - Main app navigation with 5 bottom tabs:
   - `today` - Daily task planning with A-B-C priorities
   - `week` - Weekly planning with "big rocks"
   - `matrix` - Quadrant-based view
   - `goals` - Long-term goal management
   - `profile` - User profile and settings

3. **`(modals)/`** - Modal presentation screens:
   - `achievements.tsx` - Achievement list
   - `analytics.tsx` - Analytics dashboard
   - `mission.tsx`, `roles.tsx`, `values.tsx` - Foundation editors
   - `goal/new.tsx`, `goal/[id].tsx` - Goal creation and editing (dynamic route)
   - `reflection/weekly.tsx` - Weekly reflection form
   - `settings/data.tsx`, `settings/notifications.tsx` - Settings screens

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

**Quadrants** (Time Management Matrix):
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
- [colors.ts](lib/constants/colors.ts) - Monochrome dark theme with black background, white/gray text, and semantic colors for priorities (A/B/C), quadrants (I/II/III/IV), and status indicators
- [typography.ts](lib/constants/typography.ts) - Font sizes (xs-5xl), weights (light-extrabold), and presets (h1-h4, body, caption, button, quote)
- [spacing.ts](lib/constants/spacing.ts) - 4px base unit system with presets for padding, margin, gap, radius, and icon sizes
- [predefinedValues.ts](lib/constants/predefinedValues.ts) - Curated list of values for user selection
- [roleExamples.ts](lib/constants/roleExamples.ts) - Example life roles to guide users

### Services

- [AsyncStorageService.ts](lib/storage/AsyncStorageService.ts) - All local storage operations
- [NotificationService.ts](lib/notifications/NotificationService.ts) - Push notification scheduling
- [DataService.ts](lib/import-export/DataService.ts) - Data import/export functionality

## Development Notes

### Experimental Features
- New React compiler enabled via `experiments.reactCompiler: true` in [app.json](app.json)
- Typed routes enabled via `experiments.typedRoutes: true`
- New architecture enabled via `newArchEnabled: true`

### Code Organization Philosophy
- **Minimal component abstraction**: Only 3 UI components in `components/ui/`. Most UI is built directly in screen files.
- **Domain-organized hooks**: Hooks are organized by business domain (foundation, planning, gamification, etc.) rather than technical concerns
- **Centralized types**: All TypeScript types live in a single file [types/index.ts](types/index.ts) for easy reference
- **Styling approach**: Despite NativeWind setup, most styling uses `StyleSheet.create` with some inline styles

### Configuration
- First day of week is Sunday (US standard)
- Dark mode support configured but implementation may be incomplete
- All storage keys prefixed with `@covey_planner:` (21 keys total in [types/index.ts](types/index.ts))
- VSCode workspace settings include auto-fix on save for ESLint
