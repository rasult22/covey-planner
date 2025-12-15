// Covey Planner - Weekly Plan Queries & Mutations
import { storageService } from '@/lib/storage/AsyncStorageService';
import { STORAGE_KEYS, WeeklyPlan } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endOfWeek, getWeek, getYear, startOfWeek } from 'date-fns';

// Helpers
export function getWeekId(date: Date): string {
  const year = getYear(date);
  const weekNumber = getWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

export function getCurrentWeekId(): string {
  return getWeekId(new Date());
}

export function getWeekDates(weekId: string): { startDate: string; endDate: string } {
  try {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 0 });
    const end = endOfWeek(now, { weekStartsOn: 0 });

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  } catch (error) {
    console.error('Error getting week dates:', error);
    const now = new Date();
    return {
      startDate: now.toISOString(),
      endDate: now.toISOString(),
    };
  }
}

// ============================================================================
// QUERIES
// ============================================================================

export function useWeeklyPlanQuery(weekId?: string) {
  const currentWeekId = weekId || getCurrentWeekId();
  
  return useQuery({
    queryKey: ['weeklyPlan', currentWeekId],
    queryFn: async () => {
      const stored = await storageService.getItem<WeeklyPlan[]>(STORAGE_KEYS.WEEKLY_PLAN);
      const allPlans = stored || [];
      return allPlans.find(p => p.weekId === currentWeekId) || null;
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateWeeklyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ weekId, bigRockIds, notes }: { weekId: string; bigRockIds: string[]; notes?: string }) => {
      const allPlans = (await storageService.getItem<WeeklyPlan[]>(STORAGE_KEYS.WEEKLY_PLAN)) || [];
      const { startDate, endDate } = getWeekDates(weekId);

      const newPlan: WeeklyPlan = {
        id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        weekId,
        startDate,
        endDate,
        bigRockIds,
        notes,
        createdAt: new Date().toISOString(),
      };

      const updated = [...allPlans, newPlan];
      await storageService.setItem(STORAGE_KEYS.WEEKLY_PLAN, updated);
      return newPlan;
    },
    onSuccess: (newPlan) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyPlan', newPlan.weekId] });
    },
  });
}

export function useUpdateWeeklyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, weekId, updates }: { id: string; weekId: string; updates: Partial<Omit<WeeklyPlan, 'id' | 'weekId' | 'createdAt'>> }) => {
      const allPlans = (await storageService.getItem<WeeklyPlan[]>(STORAGE_KEYS.WEEKLY_PLAN)) || [];
      const updated = allPlans.map(plan => (plan.id === id ? { ...plan, ...updates } : plan));
      await storageService.setItem(STORAGE_KEYS.WEEKLY_PLAN, updated);
      return updated;
    },
    onSuccess: (_, { weekId }) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyPlan', weekId] });
    },
  });
}

// ============================================================================
// CONVENIENCE MUTATIONS
// ============================================================================

export function useAddBigRockToPlanMutation() {
  const { mutate, ...rest } = useUpdateWeeklyPlanMutation();
  const queryClient = useQueryClient();
  
  return {
    ...rest,
    mutate: (args: { id: string; weekId: string; bigRockId: string }, options?: any) => {
      const plan = queryClient.getQueryData<WeeklyPlan>(['weeklyPlan', args.weekId]);
      if (!plan) return;
      
      const updatedBigRockIds = [...plan.bigRockIds, args.bigRockId];
      mutate({ id: args.id, weekId: args.weekId, updates: { bigRockIds: updatedBigRockIds } }, options);
    },
  };
}

export function useRemoveBigRockFromPlanMutation() {
  const { mutate, ...rest } = useUpdateWeeklyPlanMutation();
  const queryClient = useQueryClient();
  
  return {
    ...rest,
    mutate: (args: { id: string; weekId: string; bigRockId: string }, options?: any) => {
      const plan = queryClient.getQueryData<WeeklyPlan>(['weeklyPlan', args.weekId]);
      if (!plan) return;
      
      const updatedBigRockIds = plan.bigRockIds.filter(id => id !== args.bigRockId);
      mutate({ id: args.id, weekId: args.weekId, updates: { bigRockIds: updatedBigRockIds } }, options);
    },
  };
}

export function useCompleteWeeklyPlanMutation() {
  const { mutate, ...rest } = useUpdateWeeklyPlanMutation();
  
  return {
    ...rest,
    mutate: (args: { id: string; weekId: string }, options?: any) => {
      mutate({ id: args.id, weekId: args.weekId, updates: { completedAt: new Date().toISOString() } }, options);
    },
  };
}
