// Covey Planner - Big Rocks Queries & Mutations
import { storageService } from '@/lib/storage/AsyncStorageService';
import { BigRock, STORAGE_KEYS } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ============================================================================
// QUERIES
// ============================================================================

export function useBigRocksQuery(weekId?: string) {
  return useQuery({
    queryKey: weekId ? ['bigRocks', weekId] : ['bigRocks'],
    queryFn: async () => {
      const stored = await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS);
      const allRocks = stored || [];
      
      // Filter by week if weekId is provided
      return weekId ? allRocks.filter(rock => rock.weekId === weekId) : allRocks;
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useAddBigRockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<BigRock, 'id' | 'createdAt' | 'quadrant'>) => {
      const allRocks = (await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS)) || [];

      const newBigRock: BigRock = {
        ...data,
        id: `bigrock_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        createdAt: new Date().toISOString(),
        quadrant: 'II', // Big Rocks are always Quadrant II
      };

      const updated = [...allRocks, newBigRock];
      await storageService.setItem(STORAGE_KEYS.BIG_ROCKS, updated);
      return newBigRock;
    },
    onSuccess: (newRock) => {
      queryClient.invalidateQueries({ queryKey: ['bigRocks'] });
      queryClient.invalidateQueries({ queryKey: ['bigRocks', newRock.weekId] });
    },
  });
}

export function useUpdateBigRockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<BigRock, 'id' | 'createdAt' | 'quadrant'>> }) => {
      const allRocks = (await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS)) || [];
      const updated = allRocks.map(rock => (rock.id === id ? { ...rock, ...updates } : rock));
      await storageService.setItem(STORAGE_KEYS.BIG_ROCKS, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bigRocks'] });
    },
  });
}

export function useDeleteBigRockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const allRocks = (await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS)) || [];
      const updated = allRocks.filter(rock => rock.id !== id);
      await storageService.setItem(STORAGE_KEYS.BIG_ROCKS, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bigRocks'] });
    },
  });
}

// ============================================================================
// CONVENIENCE MUTATIONS
// ============================================================================

export function useCompleteBigRockMutation() {
  const { mutate, ...rest } = useUpdateBigRockMutation();
  
  return {
    ...rest,
    mutate: (id: string, options?: any) => {
      mutate({ id, updates: { completedAt: new Date().toISOString() } }, options);
    },
  };
}

export function useUncompleteBigRockMutation() {
  const { mutate, ...rest } = useUpdateBigRockMutation();
  
  return {
    ...rest,
    mutate: (id: string, options?: any) => {
      mutate({ id, updates: { completedAt: undefined } }, options);
    },
  };
}
