// Covey Planner - TypeScript Type Definitions

// ============================================
// FOUNDATION ENTITIES
// ============================================

export interface Value {
  id: string;
  name: string;
  statement: string; // What this value means to you
  predefined: boolean; // Pre-defined or custom
  category?: 'personal' | 'relationships' | 'professional' | 'financial' | 'spiritual';
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  statement: string; // Who you want to be in this role
  createdAt: string;
}

export interface GoalStep {
  id: string;
  title: string;
  deadline?: string;
  completed: boolean;
  completedAt?: string;
}

export interface LongTermGoal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  linkedValueIds: string[]; // Connection to values
  linkedRoleIds: string[]; // Connection to roles
  steps: GoalStep[];
  progress: number; // 0-100
  quadrant: Quadrant;
  createdAt: string;
  completedAt?: string;
}

// ============================================
// PLANNING ENTITIES
// ============================================

export interface BigRock {
  id: string;
  title: string;
  weekId: string; // Week ID in format 'YYYY-WW'
  estimatedHours: number;
  linkedGoalId?: string;
  linkedRoleId?: string;
  completedAt?: string;
  createdAt: string;
  quadrant: 'II'; // Always Quadrant II
  calendarEventId?: string; // Device calendar event ID
}

export interface DailyTask {
  id: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  date: string; // Date key in format 'YYYY-MM-DD'
  quadrant: Quadrant;
  linkedGoalId?: string;
  linkedBigRockId?: string;
  linkedRoleId?: string;
  estimatedMinutes: number;
  actualMinutes?: number; // Actual minutes tracked
  timerStartedAt?: string; // ISO timestamp when timer started
  createdAt: string;
  completedAt?: string;
  calendarEventId?: string; // Device calendar event ID
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'big_rock' | 'meeting' | 'task' | 'other';
  linkedBigRockId?: string;
  linkedTaskId?: string;
}

export interface WeeklyPlan {
  id: string;
  weekId: string; // Week ID in format 'YYYY-WW'
  startDate: string; // ISO date of week start (Sunday)
  endDate: string; // ISO date of week end (Saturday)
  bigRockIds: string[]; // References to BigRocks
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

// ============================================
// GAMIFICATION
// ============================================

export interface Promise3010 {
  id: string;
  description: string;
  date: string; // Date key 'YYYY-MM-DD'
  kept: boolean;
  keptAt?: string;
  broken: boolean;
  brokenAt?: string;
  createdAt: string;
}

export interface StreakData {
  weeklyPlanning: {
    currentStreak: number;
    longestStreak: number;
    lastWeekId?: string; // Last week that was planned
    history: {
      [weekId: string]: { // 'YYYY-WW'
        completed: boolean;
        completedAt: string;
      };
    };
  };
  dailyPlanning: {
    currentStreak: number;
    longestStreak: number;
    lastDateKey?: string; // Last date that was planned
    history: {
      [dateKey: string]: { // 'YYYY-MM-DD'
        completed: boolean;
        completedAt: string;
      };
    };
  };
}

export type AchievementKey =
  // Onboarding and Foundation
  | 'first_mission'
  | 'values_defined'
  | 'roles_complete'
  | 'first_goal'
  // Planning
  | 'first_weekly_plan'
  | 'first_big_rock'
  | 'ten_big_rocks'
  | 'fifty_big_rocks'
  | 'balanced_week'
  // Quadrants
  | 'q2_master'
  | 'q2_champion'
  | 'q4_eliminator'
  // Planning Streaks
  | 'week_streak_4'
  | 'week_streak_12'
  | 'week_streak_52'
  | 'day_streak_7'
  | 'day_streak_30'
  | 'day_streak_100'
  // Goals and Tasks
  | 'first_goal_complete'
  | 'ten_goals_complete'
  | 'priority_a_master'
  | 'task_finisher'
  // Reflection
  | 'first_reflection'
  | 'reflective_quarter';

export interface Achievement {
  id: string;
  key: AchievementKey;
  title: string;
  description: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

// ============================================
// ANALYTICS
// ============================================

export interface QuadrantStats {
  [weekKey: string]: { // 'YYYY-WW'
    quadrant_I: number; // Minutes
    quadrant_II: number;
    quadrant_III: number;
    quadrant_IV: number;
  };
}

export interface WeeklyReflection {
  id: string;
  weekStart: string; // ISO date
  questions: {
    whatWorkedWell: string; // What went well this week?
    whatToImprove: string; // What could be better next week?
    lessonsLearned: string; // What lessons were learned?
    gratitude?: string; // What are you grateful for?
  };
  completedAt: string;
}

// ============================================
// SETTINGS
// ============================================

export interface NotificationSettings {
  weeklyPlanningEnabled: boolean;
  weeklyPlanningDay: number; // 0-6 (0=Sunday)
  weeklyPlanningTime: string; // "18:00"
  dailyPlanningEnabled: boolean;
  dailyPlanningTime: string; // "08:00"
  weeklyCompassEnabled: boolean;
  weeklyCompassTime: string; // "09:00"
  weeklyReflectionEnabled: boolean;
  weeklyReflectionDay: number; // 0-6
  weeklyReflectionTime: string; // "20:00"
}

export interface AppSettings {
  firstDayOfWeek: 0; // 0 = Sunday (US standard)
  timeFormat: '12h' | '24h';
  language: 'en'; // English only
}

// ============================================
// ENUMS & UTILITY TYPES
// ============================================

export type Quadrant = 'I' | 'II' | 'III' | 'IV';

export type Priority = 'A' | 'B' | 'C';

export type TaskStatus =
  | 'pending'
  | 'completed'
  | 'forwarded'
  | 'cancelled'
  | 'delegated'
  | 'in_progress';

export type ValueCategory =
  | 'personal'
  | 'relationships'
  | 'professional'
  | 'financial'
  | 'spiritual';

// ============================================
// STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  // Foundation
  USER_MISSION: '@covey_planner:user_mission',
  USER_VALUES: '@covey_planner:user_values',
  USER_ROLES: '@covey_planner:user_roles',
  LONG_TERM_GOALS: '@covey_planner:long_term_goals',

  // Planning
  WEEKLY_PLAN: '@covey_planner:weekly_plan',
  BIG_ROCKS: '@covey_planner:big_rocks',
  DAILY_TASKS: '@covey_planner:daily_tasks',
  CALENDAR_EVENTS: '@covey_planner:calendar_events',

  // Gamification
  STREAKS: '@covey_planner:streaks',
  ACHIEVEMENTS: '@covey_planner:achievements',
  PROMISES_3010: '@covey_planner:promises_3010',

  // Analytics
  QUADRANT_STATS: '@covey_planner:quadrant_stats',
  WEEKLY_REFLECTIONS: '@covey_planner:weekly_reflections',

  // Settings
  ONBOARDING_COMPLETED: '@covey_planner:onboarding_completed',
  NOTIFICATION_SETTINGS: '@covey_planner:notification_settings',
  APP_SETTINGS: '@covey_planner:app_settings',
} as const;
