import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useUserPlan } from "@/hooks/useUserPlan";
import { colors, spacing, typography, layout } from "@/theme";

export default function ManagePlanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { plan, loading, isFree, isPremium, isLifetime } =
    useUserPlan();

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando plano...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      {/* 🔙 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Gerenciar Plano
        </Text>
      </View>

      {/* 📦 CARD PLANO */}
      <View style={styles.card}>
        <Text style={styles.label}>
          Plano atual
        </Text>

        <Text style={styles.planName}>
          {isFree && "Gratuito"}
          {isPremium && "Premium"}
          {isLifetime && "Vitalício"}
        </Text>

        <Text style={styles.status}>
          Status: {plan?.status === "active"
            ? "Ativo"
            : "Inativo"}
        </Text>
      </View>

      {/* 🔥 AÇÕES */}
      {isFree && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Libere todos os recursos
          </Text>

          <Text style={styles.cardText}>
            Tenha acesso completo ao plano alimentar,
            progresso avançado e receitas ilimitadas.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              router.push("/(onboarding)/plans")
            }
          >
            <Text style={styles.primaryButtonText}>
              Ver planos
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {(isPremium || isLifetime) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Alterar plano
          </Text>

          <Text style={styles.cardText}>
            Deseja trocar ou cancelar seu plano?
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              router.push("/(onboarding)/plans")
            }
          >
            <Text style={styles.secondaryButtonText}>
              Gerenciar assinatura
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* =========================
   🎨 STYLES
========================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  planName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  status: {
    ...typography.sm,
    color: colors.textSecondary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  cardText: {
    ...typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: layout.borderRadius.base,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: layout.borderRadius.base,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
