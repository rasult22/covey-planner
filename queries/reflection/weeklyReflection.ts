// Principle Centered Planner - Weekly Reflection Queries & Mutations
import { storageService } from '@/lib/storage/AsyncStorageService';
import { STORAGE_KEYS, WeeklyReflection } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, startOfWeek } from 'date-fns';

// Helper
export function getWeekStartDate(date: Date): string {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  return format(start, 'yyyy-MM-dd');
}

// ============================================================================
// QUERIES
// ============================================================================

export function useWeeklyReflectionQuery(weekStartDate?: string) {
  const currentWeekStart = weekStartDate || getWeekStartDate(new Date());
  
  return useQuery({
    queryKey: ['weeklyReflection', currentWeekStart],
    queryFn: async () => {
      const stored = await storageService.getItem<WeeklyReflection[]>(STORAGE_KEYS.WEEKLY_REFLECTIONS);
      const reflections = stored || [];
      return reflections.find(r => r.weekStart === currentWeekStart) || null;
    },
  });
}

export function useAllWeeklyReflectionsQuery() {
  return useQuery({
    queryKey: ['weeklyReflections'],
    queryFn: async () => {
      const stored = await storageService.getItem<WeeklyReflection[]>(STORAGE_KEYS.WEEKLY_REFLECTIONS);
      return stored || [];
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateWeeklyReflectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      weekStart,
      questions,
    }: {
      weekStart: string;
      questions: WeeklyReflection['questions'];
    }) => {
      const allReflections = (await storageService.getItem<WeeklyReflection[]>(STORAGE_KEYS.WEEKLY_REFLECTIONS)) || [];

      const newReflection: WeeklyReflection = {
        id: `reflection_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        weekStart,
        questions,
        completedAt: new Date().toISOString(),
      };

      const updated = [...allReflections, newReflection];
      await storageService.setItem(STORAGE_KEYS.WEEKLY_REFLECTIONS, updated);
      return newReflection;
    },
    onSuccess: (newReflection) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyReflection', newReflection.weekStart] });
      queryClient.invalidateQueries({ queryKey: ['weeklyReflections'] });
    },
  });
}

export function useUpdateWeeklyReflectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      weekStart,
      questions,
    }: {
      id: string;
      weekStart: string;
      questions: Partial<WeeklyReflection['questions']>;
    }) => {
      const allReflections = (await storageService.getItem<WeeklyReflection[]>(STORAGE_KEYS.WEEKLY_REFLECTIONS)) || [];
      
      const updated = allReflections.map(r =>
        r.id === id
          ? { ...r, questions: { ...r.questions, ...questions }, completedAt: new Date().toISOString() }
          : r
      );

      await storageService.setItem(STORAGE_KEYS.WEEKLY_REFLECTIONS, updated);
      return updated;
    },
    onSuccess: (_, { weekStart }) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyReflection', weekStart] });
      queryClient.invalidateQueries({ queryKey: ['weeklyReflections'] });
    },
  });
}

export function useDeleteWeeklyReflectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, weekStart }: { id: string; weekStart: string }) => {
      const allReflections = (await storageService.getItem<WeeklyReflection[]>(STORAGE_KEYS.WEEKLY_REFLECTIONS)) || [];
      const updated = allReflections.filter(r => r.id !== id);
      await storageService.setItem(STORAGE_KEYS.WEEKLY_REFLECTIONS, updated);
      return updated;
    },
    onSuccess: (_, { weekStart }) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyReflection', weekStart] });
      queryClient.invalidateQueries({ queryKey: ['weeklyReflections'] });
    },
  });
}
