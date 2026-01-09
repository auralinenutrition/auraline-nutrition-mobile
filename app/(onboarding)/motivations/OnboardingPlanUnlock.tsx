import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, layout } from "@/theme";

export default function OnboardingPlanUnlock() {
  return (
    <View style={styles.container}>
      {/* TÍTULO */}
      <Text style={styles.title}>
        Sua evolução pode ser{"\n"}mais rápida do que imagina
      </Text>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Progresso estimado nas primeiras semanas
        </Text>

        {/* GRÁFICO EM ÁREA (PLACEHOLDER VISUAL) */}
        <View style={styles.chart}>
          <View style={styles.chartFill} />
          <View style={styles.chartLine} />

          <View style={styles.chartLabels}>
            <Text style={styles.label}>Semana 1</Text>
            <Text style={styles.label}>Semana 2</Text>
            <Text style={styles.label}>Semana 3</Text>
            <Text style={styles.label}>Semana 4</Text>
          </View>
        </View>

        {/* TEXTO DO CARD */}
        <Text style={styles.description}>
          Usuários com perfis semelhantes ao seu começam a ver mudanças visíveis
          entre 2 e 4 semanas — e você está iniciando exatamente no caminho
          certo para isso.
        </Text>
      </View>

      {/* TEXTO FINAL */}
      <Text style={styles.footerText}>
        Quanto antes você seguir seu plano, mais cedo seu corpo responde. É
        impressionante o quanto pequenas decisões diárias aceleram sua
        transformação.
      </Text>
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
    lineHeight: 32,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  chart: {
    height: 140,
    justifyContent: "flex-end",
    marginBottom: spacing.md,
  },

  chartFill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    height: 90,
    backgroundColor: colors.primaryLight,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  chartLine: {
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 2,
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

  footerText: {
    ...typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
