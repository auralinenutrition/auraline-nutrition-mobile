import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { colors, spacing, typography } from "@/theme";

const STEPS = [
  "Analisando seus dados…",
  "Calculando suas metas ideais…",
  "Ajustando calorias e macros…",
  "Montando seu plano personalizado…",
];

export default function QuizLoadingScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 4000,
      useNativeDriver: false,
    }).start(() => {
      router.replace("/(onboarding)/result");
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.percent}>
        {Math.round((progress as any)._value)}%
      </Text>

      <Text style={styles.step}>
        {STEPS[stepIndex]}
      </Text>

      <View style={styles.bar}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: progress.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  percent: {
    fontSize: 42,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  step: {
    ...typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  bar: {
    width: "100%",
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
});
