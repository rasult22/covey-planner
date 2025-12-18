import { Stack } from 'expo-router';

export default function WikiLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[concept]" />
    </Stack>
  );
}
