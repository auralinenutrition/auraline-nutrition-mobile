import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // 👈 animação principal
        gestureEnabled: true,          // swipe para voltar (iOS)
      }}
    />
  );
}
