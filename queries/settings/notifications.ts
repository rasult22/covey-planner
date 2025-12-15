// Covey Planner - Notification Settings Query
import { NotificationService } from '@/lib/notifications/NotificationService';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { NotificationSettings, STORAGE_KEYS } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const DEFAULT_SETTINGS: NotificationSettings = {
  weeklyPlanningEnabled: true,
  weeklyPlanningDay: 0,
  weeklyPlanningTime: '18:00',
  dailyPlanningEnabled: true,
  dailyPlanningTime: '08:00',
  weeklyCompassEnabled: true,
  weeklyCompassTime: '09:00',
  weeklyReflectionEnabled: true,
  weeklyReflectionDay: 0,
  weeklyReflectionTime: '20:00',
};

// ============================================================================
// QUERIES
// ============================================================================

export function useNotificationSettingsQuery() {
  return useQuery({
    queryKey: ['notificationSettings'],
    queryFn: async () => {
      const stored = await storageService.getItem<NotificationSettings>(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      return stored || DEFAULT_SETTINGS;
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useSaveNotificationSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSettings: NotificationSettings) => {
      await storageService.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, newSettings);
      // Apply notification schedules
      await NotificationService.scheduleWeeklyPlanning(newSettings);
      await NotificationService.scheduleDailyPlanning(newSettings);
      await NotificationService.scheduleWeeklyCompass(newSettings);
      await NotificationService.scheduleWeeklyReflection(newSettings);
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
    },
  });
}
