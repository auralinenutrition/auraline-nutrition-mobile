import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, layout } from "@/theme";

export default function OnboardingWeightProjection() {
  return (
    <View style={styles.container}>
      {/* TÍTULO */}
      <Text style={styles.title}>
        Você está a poucos segundos{"\n"}
        de desbloquear seu plano ideal
      </Text>

      {/* SUBTEXTO */}
      <Text style={styles.subtitle}>
        Seus dados foram analisados e estamos prestes a gerar um plano{" "}
        <Text style={styles.bold}>100% personalizado</Text> para acelerar sua
        evolução — feito exatamente para o seu corpo, sua rotina e seu objetivo.
      </Text>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Seu objetivo (70kg → 65kg)
        </Text>

        <Text style={styles.cardDescription}>
          Com base em perfis semelhantes ao seu, você tem um{" "}
          <Text style={styles.bold}>
            alto potencial de atingir sua meta
          </Text>{" "}
          seguindo as orientações certas.
        </Text>

        {/* BARRA DE PROGRESSO */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.progressLabel}>5kg</Text>
        </View>
      </View>

      {/* TEXTO FINAL */}
      <Text style={styles.footerText}>
        Agora vamos gerar sua estratégia ideal de calorias, macros e hábitos —
        totalmente adaptada para você ter os melhores resultados possíveis.
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
    marginBottom: spacing.md,
    lineHeight: 32,
  },

  subtitle: {
    ...typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  bold: {
    fontWeight: "600",
    color: colors.textPrimary,
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
    marginBottom: spacing.sm,
  },

  cardDescription: {
    ...typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: spacing.sm,
  },

  progressFill: {
    width: "30%",
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },

  progressLabel: {
    ...typography.sm,
    color: colors.textPrimary,
    fontWeight: "500",
  },

  footerText: {
    ...typography.sm,
    color: colors.textSecondary,
  },
});
