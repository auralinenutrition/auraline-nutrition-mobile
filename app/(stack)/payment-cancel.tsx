import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing } from "@/theme";

export default function PaymentCancelScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pagamento cancelado
      </Text>
      <Text style={styles.subtitle}>
        Você pode tentar novamente quando quiser.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.replace("/(onboarding)/plans")
        }
      >
        <Text style={styles.buttonText}>
          Ver planos novamente
        </Text>
      </TouchableOpacity>
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
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
  },
});
