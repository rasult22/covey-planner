// Principle Centered Planner - Goal Modals Layout
import { COLORS } from '@/lib/constants/colors';
import { Stack } from 'expo-router';

export default function GoalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen
        name="new"
        options={{
          title: 'New Goal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Goal Details',
        }}
      />
    </Stack>
  );
}
