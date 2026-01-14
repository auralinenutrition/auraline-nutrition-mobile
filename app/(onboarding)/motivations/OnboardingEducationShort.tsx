import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/theme";

export default function OnboardingEducationShort() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Você não precisa fazer tudo perfeito
      </Text>

      <Text style={styles.text}>
        Resultados reais vêm da constância, não da restrição extrema.
        Um plano que cabe na sua rotina é o que você consegue seguir —
        e é isso que gera mudança de verdade.
      </Text>

      <Text style={styles.highlight}>
        Pequenas decisões diárias &gt; grandes sacrifícios
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

  text: {
    ...typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },

  highlight: {
    ...typography.base,
    color: colors.primary,
    fontWeight: "600",
  },
});
