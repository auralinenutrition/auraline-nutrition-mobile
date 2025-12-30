import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="quiz" />
        <Stack.Screen name="result" />
        <Stack.Screen name="plans" />
        <Stack.Screen name="checkout" />
      </Stack>
  );
}

