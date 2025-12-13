// Covey Planner - Onboarding Layout
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#000000',
        },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="philosophy" />
      <Stack.Screen name="setup-mission" />
      <Stack.Screen name="setup-values" />
      <Stack.Screen name="setup-roles" />
      <Stack.Screen name="setup-goals" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
