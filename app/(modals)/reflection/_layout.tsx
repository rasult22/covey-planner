import { COLORS } from '@/lib/constants/colors';
import { Stack } from 'expo-router';

export default function ReflectionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    />
  );
}
