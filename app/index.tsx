// Principle Centered Planner - Entry Point
import { COLORS } from '@/lib/constants/colors';
import { unlockInitialAchievements } from '@/lib/migrations/unlockInitialAchievements';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const isCompleted = await storageService.isOnboardingCompleted();

      if (isCompleted) {
        // Run achievement migration for existing users
        await unlockInitialAchievements();
        router.replace('/(tabs)/today');
      } else {
        router.replace('/(onboarding)/welcome');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to onboarding if error
      router.replace('/(onboarding)/welcome');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return null;
}
