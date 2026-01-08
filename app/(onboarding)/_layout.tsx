import { Stack } from "expo-router";
import { QuizProvider } from "@/hooks/QuizContext";

export default function OnboardingLayout() {
  return (
    <QuizProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </QuizProvider>
  );
}
