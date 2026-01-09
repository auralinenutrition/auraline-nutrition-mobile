import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, layout } from "@/theme";

export default function OnboardingWeightProgress() {
  return (
    <View style={styles.container}>
      {/* TÍTULO */}
      <Text style={styles.title}>
        Você está mais perto da sua meta do que imagina
      </Text>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Evolução esperada do seu peso
        </Text>

        {/* GRÁFICO (placeholder) */}
        <View style={styles.chart}>
          <View style={styles.chartLine} />
          <View style={[styles.dot, styles.dotLeft]} />
          <View style={[styles.dot, styles.dotCenter]} />
          <View style={[styles.dot, styles.dotRight]} />

          <View style={styles.chartLabels}>
            <Text style={styles.label}>3 dias</Text>
            <Text style={styles.label}>7 dias</Text>
            <Text style={styles.label}>30 dias</Text>
          </View>
        </View>

        {/* TEXTO */}
        <Text style={styles.description}>
          Com base nos dados reais de milhares de usuários, quem segue um plano
          personalizado costuma notar mudanças logo nos primeiros dias.
          {"\n"}Você já está progredindo.
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

  chart: {
    height: 140,
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  chartLine: {
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  dot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    top: "50%",
    marginTop: -5,
  },

  dotLeft: {
    left: 0,
  },

  dotCenter: {
    left: "50%",
    marginLeft: -5,
  },

  dotRight: {
    right: 0,
  },

  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },

  label: {
    ...typography.sm,
    color: colors.textTertiary,
  },

  description: {
    ...typography.sm,
    color: colors.textSecondary,
  },
});
