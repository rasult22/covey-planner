// Covey Planner - Values Queries & Mutations
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Achievement, STORAGE_KEYS, Value } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ============================================================================
// QUERIES
// ============================================================================

export function useValuesQuery() {
  return useQuery({
    queryKey: ['values'],
    queryFn: async () => {
      const data = await storageService.getItem<Value[]>(STORAGE_KEYS.USER_VALUES);
      return data || [];
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useAddValueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: Omit<Value, 'id' | 'createdAt'>) => {
      const currentValues = queryClient.getQueryData<Value[]>(['values']) || [];
      const hadValues = currentValues.length > 0;

      const newValue: Value = {
        ...value,
        id: `value-${Date.now()}-${Math.random()}`,
        createdAt: new Date().toISOString(),
      };

      const updatedValues = [...currentValues, newValue];
      await storageService.setItem(STORAGE_KEYS.USER_VALUES, updatedValues);

      // Unlock achievement for first value
      if (!hadValues) {
        try {
          const achievements = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
          if (achievements) {
            const updated = achievements.map(a =>
              a.key === 'values_defined' ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() } : a
            );
            await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
            queryClient.invalidateQueries({ queryKey: ['achievements'] });
          }
        } catch (err) {
          console.error('Error unlocking achievement:', err);
        }
      }

      return newValue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['values'] });
    },
  });
}

export function useUpdateValueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Value> }) => {
      const currentValues = queryClient.getQueryData<Value[]>(['values']) || [];
      const updatedValues = currentValues.map(v => (v.id === id ? { ...v, ...updates } : v));
      await storageService.setItem(STORAGE_KEYS.USER_VALUES, updatedValues);
      return updatedValues;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['values'] });
    },
  });
}

export function useDeleteValueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const currentValues = queryClient.getQueryData<Value[]>(['values']) || [];
      const updatedValues = currentValues.filter(v => v.id !== id);
      await storageService.setItem(STORAGE_KEYS.USER_VALUES, updatedValues);
      return updatedValues;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['values'] });
    },
  });
}
