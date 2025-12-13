// Covey Planner - Modals Layout
import { Stack } from 'expo-router';
import { COLORS } from '@/lib/constants/colors';

export default function ModalsLayout() {
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
        name="mission"
        options={{
          title: 'Personal Mission',
        }}
      />
      <Stack.Screen
        name="values"
        options={{
          title: 'Core Values',
        }}
      />
      <Stack.Screen
        name="roles"
        options={{
          title: 'Life Roles',
        }}
      />
    </Stack>
  );
}
