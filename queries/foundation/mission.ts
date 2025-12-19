// Principle Centered Planner - Mission Queries & Mutations
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Achievement, STORAGE_KEYS } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ============================================================================
// QUERIES
// ============================================================================

export function useMissionQuery() {
  return useQuery({
    queryKey: ['mission'],
    queryFn: async () => {
      const data = await storageService.getString(STORAGE_KEYS.USER_MISSION);
      return data || '';
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useSaveMissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMission: string) => {
      const currentMission = queryClient.getQueryData<string>(['mission']) || '';
      const hadMission = !!currentMission;

      await storageService.setString(STORAGE_KEYS.USER_MISSION, newMission);

      // Unlock achievement for first mission (if this is the first time)
      if (!hadMission && newMission.trim()) {
        try {
          const achievements = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
          if (achievements) {
            const updated = achievements.map(a =>
              a.key === 'first_mission' ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() } : a
            );
            await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
            queryClient.invalidateQueries({ queryKey: ['achievements'] });
          }
        } catch (err) {
          console.error('Error unlocking achievement:', err);
        }
      }

      return newMission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission'] });
    },
  });
}

export function useClearMissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await storageService.removeItem(STORAGE_KEYS.USER_MISSION);
      return '';
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission'] });
    },
  });
}
