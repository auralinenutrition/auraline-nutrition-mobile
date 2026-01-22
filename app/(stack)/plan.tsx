import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, layout } from "@/theme";


export default function PlanScreen() {
  const router = useRouter();

  /* =========================
     🔙 BOTÃO FÍSICO ANDROID
  ========================== */
  useEffect(() => {
  const onBackPress = () => {
    router.replace("/(tabs)/home");
    return true;
  };

  const subscription = BackHandler.addEventListener(
    "hardwareBackPress",
    onBackPress
  );

  return () => subscription.remove();
}, []);


  return (
    <View style={styles.container}>
      {/* =========================
          HEADER
      ========================== */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/home")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Plano do dia
        </Text>
      </View>

      {/* =========================
          CONTEÚDO
      ========================== */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* CAFÉ DA MANHÃ */}
        <View style={styles.card}>
          <Text style={styles.mealTitle}>
            ☀️ Café da manhã
          </Text>
          <Text style={styles.mealText}>
            Exemplo: Aveia com banana e ovos mexidos
          </Text>
        </View>

        {/* ALMOÇO */}
        <View style={styles.card}>
          <Text style={styles.mealTitle}>
            🍽 Almoço
          </Text>
          <Text style={styles.mealText}>
            Exemplo: Arroz, frango grelhado e legumes
          </Text>
        </View>

        {/* JANTAR */}
        <View style={styles.card}>
          <Text style={styles.mealTitle}>
            🌙 Jantar
          </Text>
          <Text style={styles.mealText}>
            Exemplo: Omelete com salada
          </Text>
        </View>

        {/* OBSERVAÇÃO */}
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            💡 Este plano será ajustado automaticamente
            conforme seu progresso e objetivos.
          </Text>
        </View>
      </ScrollView>
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
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  content: {
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: colors.textPrimary,
  },
  mealText: {
    ...typography.base,
    color: colors.textSecondary,
  },
  tipBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
  },
  tipText: {
    color: colors.primaryDark,
    fontSize: 14,
  },
});
