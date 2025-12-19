// Principle Centered Planner - Modals Layout
import { COLORS } from '@/lib/constants/colors';
import { Stack } from 'expo-router';

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
      <Stack.Screen
        name="goal"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="achievements"
        options={{
          title: 'Achievements',
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          title: 'Analytics',
        }}
      />
      <Stack.Screen
        name="reflection"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
