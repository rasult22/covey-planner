// Principle Centered Planner - Quadrant Stats Query (read-only analytics)
import { storageService } from '@/lib/storage/AsyncStorageService';
import { QuadrantStats, STORAGE_KEYS } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWeek, getYear } from 'date-fns';

// Helper
export function getWeekId(date: Date): string {
  const year = getYear(date);
  const weekNumber = getWeek(date, { weekStartsOn: 0 });
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

// ============================================================================
// QUERIES
// ============================================================================

export function useQuadrantStatsQuery() {
  return useQuery({
    queryKey: ['quadrantStats'],
    queryFn: async () => {
      const stored = await storageService.getItem<QuadrantStats>(STORAGE_KEYS.QUADRANT_STATS);
      return stored || {};
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useUpdateQuadrantStatsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      weekId,
      quadrantMinutes,
    }: {
      weekId: string;
      quadrantMinutes: {
        quadrant_I: number;
        quadrant_II: number;
        quadrant_III: number;
        quadrant_IV: number;
      };
    }) => {
      const stats = queryClient.getQueryData<QuadrantStats>(['quadrantStats']) || {};
      const updated = { ...stats, [weekId]: quadrantMinutes };
      await storageService.setItem(STORAGE_KEYS.QUADRANT_STATS, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quadrantStats'] });
    },
  });
}
