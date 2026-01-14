import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuiz } from "@/hooks/QuizContext";
import { colors, spacing, typography, layout } from "@/theme";

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useQuiz();

  const pesoAtual = Number(state.answers["12"]);
  const pesoDesejado = Number(state.answers["13"]);

  const diferenca = pesoDesejado - pesoAtual;
  const tendencia = diferenca < 0 ? "perder" : "ganhar";
  const valorAbs = Math.abs(diferenca);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Seu plano está pronto! 💪</Text>
          <Text style={styles.subtitle}>
            Criamos um plano totalmente personalizado para atingir seu objetivo
            real, considerando seu peso, rotina, nível de disciplina e estilo
            de vida.
          </Text>
        </View>

        {/* BLOCO PESO */}
        <View style={styles.weightCard}>
          <Text style={styles.cardTitle}>Sua evolução projetada</Text>

          <View style={styles.weightRow}>
            <View style={styles.weightBlock}>
              <Text style={styles.weightLabel}>Peso atual</Text>
              <Text style={styles.weightValue}>{pesoAtual}kg</Text>
            </View>

            <Text style={styles.arrow}>→</Text>

            <View style={styles.weightBlock}>
              <Text style={styles.weightLabel}>Peso desejado</Text>
              <Text style={styles.weightTarget}>{pesoDesejado}kg</Text>
            </View>
          </View>

          <Text style={styles.weightFooter}>
            Você precisa <Text style={styles.bold}>{tendencia}</Text>{" "}
            <Text style={styles.bold}>{valorAbs}kg</Text>
          </Text>
        </View>

        {/* BENEFÍCIOS */}
        <View style={styles.benefits}>
          <Text style={styles.benefitsTitle}>
            Você está muito perto do seu novo corpo 🎯
          </Text>

          <Text style={styles.benefitsText}>
            Preparamos um plano completo com refeições, metas diárias, lista
            de compras e organização — tudo para você ganhar consistência
            sem precisar pensar ou montar nada sozinho.
          </Text>

          <View style={styles.list}>
            <Text style={styles.item}>✔ Metas alimentares personalizadas</Text>
            <Text style={styles.item}>✔ Refeições feitas para o seu objetivo</Text>
            <Text style={styles.item}>✔ Lista de compras automática</Text>
            <Text style={styles.item}>✔ Estratégias para sua disciplina atual</Text>
            <Text style={styles.item}>✔ Plano adaptado à sua rotina real</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.9}
          onPress={() => router.replace("/(onboarding)/plans")}
        >
          <Text style={styles.ctaText}>Acessar meu plano completo →</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.retry}>Refazer quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  subtitle: {
    ...typography.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  weightCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.lg,
    textAlign: "center",
  },

  weightRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  weightBlock: {
    alignItems: "center",
  },

  weightLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  weightValue: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  weightTarget: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
  },

  arrow: {
    fontSize: 32,
    color: colors.textTertiary,
  },

  weightFooter: {
    marginTop: spacing.md,
    textAlign: "center",
    color: colors.textSecondary,
  },

  bold: {
    fontWeight: "700",
    color: colors.textPrimary,
  },

  benefits: {
    alignItems: "center",
  },

  benefitsTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: spacing.sm,
    textAlign: "center",
  },

  benefitsText: {
    ...typography.base,
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  list: {
    backgroundColor: "#F7F7F7",
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    width: "100%",
    gap: spacing.sm,
  },

  item: {
    fontSize: 15,
    fontWeight: "500",
  },

  footer: {
    paddingHorizontal: spacing.lg,
  },

  cta: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: spacing.md + 6,
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  ctaText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },

  retry: {
    textAlign: "center",
    color: colors.textSecondary,
    textDecorationLine: "underline",
  },
});
