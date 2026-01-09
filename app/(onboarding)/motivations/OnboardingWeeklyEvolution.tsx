import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, layout } from "@/theme";

export default function OnboardingWeeklyEvolution() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Você tem grande potencial para alcançar sua meta
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transição do seu peso</Text>

        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>
            Gráfico de transição do peso
          </Text>
        </View>

        <Text style={styles.description}>
          Projeção feita com base no seu peso atual{" "}
          <Text style={styles.bold}>70kg</Text> e peso desejado{" "}
          <Text style={styles.bold}>65kg</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  chartPlaceholder: {
    height: 160,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  chartText: {
    ...typography.sm,
    color: colors.textTertiary,
  },

  description: {
    ...typography.sm,
    color: colors.textSecondary,
  },

  bold: {
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
