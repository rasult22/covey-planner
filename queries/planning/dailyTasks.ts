// Principle Centered Planner - Daily Tasks Queries & Mutations
import { storageService } from '@/lib/storage/AsyncStorageService';
import { DailyTask, STORAGE_KEYS } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

// Helpers
export function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getTodayKey(): string {
  return getDateKey(new Date());
}

// ============================================================================
// QUERIES
// ============================================================================

export function useDailyTasksQuery(dateKey?: string) {
  const currentDateKey = dateKey || getTodayKey();
  
  return useQuery({
    queryKey: ['dailyTasks', currentDateKey],
    queryFn: async () => {
      const stored = await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS);
      const allTasks = stored || [];
      return allTasks.filter(task => task.date === currentDateKey);
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useAddDailyTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dateKey, data }: { dateKey: string; data: Omit<DailyTask, 'id' | 'createdAt' | 'date' | 'status'> }) => {
      const allTasks = (await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS)) || [];

      const newTask: DailyTask = {
        ...data,
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        date: dateKey,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const updated = [...allTasks, newTask];
      await storageService.setItem(STORAGE_KEYS.DAILY_TASKS, updated);
      return newTask;
    },
    onSuccess: (_, { dateKey }) => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks', dateKey] });
    },
  });
}

export function useUpdateDailyTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dateKey, updates }: { id: string; dateKey: string; updates: Partial<Omit<DailyTask, 'id' | 'createdAt' | 'date'>> }) => {
      const allTasks = (await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS)) || [];
      const updated = allTasks.map(task => (task.id === id ? { ...task, ...updates } : task));
      await storageService.setItem(STORAGE_KEYS.DAILY_TASKS, updated);
      return updated;
    },
    onSuccess: (_, { dateKey }) => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks', dateKey] });
    },
  });
}

export function useDeleteDailyTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dateKey }: { id: string; dateKey: string }) => {
      const allTasks = (await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS)) || [];
      const updated = allTasks.filter(task => task.id !== id);
      await storageService.setItem(STORAGE_KEYS.DAILY_TASKS, updated);
      return updated;
    },
    onSuccess: (_, { dateKey }) => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks', dateKey] });
    },
  });
}

// ============================================================================
// CONVENIENCE MUTATIONS
// ============================================================================

export function useCompleteDailyTaskMutation() {
  const { mutate, ...rest } = useUpdateDailyTaskMutation();
  
  return {
    ...rest,
    mutate: (args: { id: string; dateKey: string }, options?: any) => {
      mutate(
        {
          ...args,
          updates: {
            status: 'completed',
            completedAt: new Date().toISOString(),
          },
        },
        options
      );
    },
  };
}

export function useUncompleteDailyTaskMutation() {
  const { mutate, ...rest } = useUpdateDailyTaskMutation();
  
  return {
    ...rest,
    mutate: (args: { id: string; dateKey: string }, options?: any) => {
      mutate(
        {
          ...args,
          updates: {
            status: 'pending',
            completedAt: undefined,
          },
        },
        options
      );
    },
  };
}

export function useStartTimerMutation() {
  const { mutate, ...rest } = useUpdateDailyTaskMutation();
  
  return {
    ...rest,
    mutate: (args: { id: string; dateKey: string }, options?: any) => {
      mutate(
        {
          ...args,
          updates: {
            timerStartedAt: new Date().toISOString(),
            status: 'in_progress',
          },
        },
        options
      );
    },
  };
}

export function useStopTimerMutation() {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useUpdateDailyTaskMutation();
  
  return {
    ...rest,
    mutate: (args: { id: string; dateKey: string; elapsedMinutes: number }, options?: any) => {
      const tasks = queryClient.getQueryData<DailyTask[]>(['dailyTasks', args.dateKey]) || [];
      const task = tasks.find(t => t.id === args.id);
      
      if (task) {
        const currentActual = task.actualMinutes || 0;
        const newActual = currentActual + args.elapsedMinutes;
        
        mutate(
          {
            id: args.id,
            dateKey: args.dateKey,
            updates: {
              timerStartedAt: undefined,
              actualMinutes: newActual,
              status: 'pending',
            },
          },
          options
        );
      }
    },
  };
}
