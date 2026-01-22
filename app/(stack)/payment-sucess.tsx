import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useUserPlan } from "@/hooks/useUserPlan";
import { colors, spacing } from "@/theme";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { refreshPlan } = useUserPlan();

  useEffect(() => {
    async function finalize() {
      await refreshPlan();
      router.replace("/(tabs)/home");
    }

    finalize();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pagamento confirmado 🎉
      </Text>
      <Text style={styles.subtitle}>
        Ativando seu plano...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
  },
});
