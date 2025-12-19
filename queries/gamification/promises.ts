// Principle Centered Planner - Promises (30/10) Queries & Mutations
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Promise3010, STORAGE_KEYS } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

// Helper
function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// ============================================================================
// QUERIES
// ============================================================================

export function usePromisesQuery(dateKey?: string) {
  const currentDateKey = dateKey || getDateKey(new Date());
  
  return useQuery({
    queryKey: ['promises', currentDateKey],
    queryFn: async () => {
      const stored = await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010);
      const allPromises = stored || [];
      return allPromises.filter(promise => promise.date === currentDateKey);
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useAddPromiseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dateKey, description }: { dateKey: string; description: string }) => {
      const allPromises = (await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010)) || [];

      const newPromise: Promise3010 = {
        id: `promise_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        description: description.trim(),
        date: dateKey,
        kept: false,
        broken: false,
        createdAt: new Date().toISOString(),
      };

      const updated = [...allPromises, newPromise];
      await storageService.setItem(STORAGE_KEYS.PROMISES_3010, updated);
      return newPromise;
    },
    onSuccess: (_, { dateKey }) => {
      queryClient.invalidateQueries({ queryKey: ['promises', dateKey] });
    },
  });
}

export function useKeepPromiseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dateKey }: { id: string; dateKey: string }) => {
      const allPromises = (await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010)) || [];
      const updated = allPromises.map(promise =>
        promise.id === id
          ? { ...promise, kept: true, keptAt: new Date().toISOString(), broken: false, brokenAt: undefined }
          : promise
      );
      await storageService.setItem(STORAGE_KEYS.PROMISES_3010, updated);
      return updated;
    },
    onSuccess: (_, { dateKey }) => {
      queryClient.invalidateQueries({ queryKey: ['promises', dateKey] });
    },
  });
}

export function useBreakPromiseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dateKey }: { id: string; dateKey: string }) => {
      const allPromises = (await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010)) || [];
      const updated = allPromises.map(promise =>
        promise.id === id
          ? { ...promise, broken: true, brokenAt: new Date().toISOString(), kept: false, keptAt: undefined }
          : promise
      );
      await storageService.setItem(STORAGE_KEYS.PROMISES_3010, updated);
      return updated;
    },
    onSuccess: (_, { dateKey }) => {
      queryClient.invalidateQueries({ queryKey: ['promises', dateKey] });
    },
  });
}

export function useDeletePromiseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dateKey }: { id: string; dateKey: string }) => {
      const allPromises = (await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010)) || [];
      const updated = allPromises.filter(promise => promise.id !== id);
      await storageService.setItem(STORAGE_KEYS.PROMISES_3010, updated);
      return updated;
    },
    onSuccess: (_, { dateKey }) => {
      queryClient.invalidateQueries({ queryKey: ['promises', dateKey] });
    },
  });
}
