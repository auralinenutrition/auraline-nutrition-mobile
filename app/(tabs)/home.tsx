import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/services/supabase";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, layout } from "@/theme";

export default function HomeScreen() {
  const router = useRouter();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name);
    }
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.greeting}>
        Olá{name ? `, ${name}` : ""} 👋
      </Text>
      <Text style={styles.subtitle}>
        Pronto para cuidar da sua saúde hoje?
      </Text>

      {/* CARDS */}
      <View style={styles.cards}>
        {/* Plano do dia */}
        <TouchableOpacity
          style={styles.cardPrimary}
          onPress={() => {
            // futuramente: plano gerado por IA
          }}
        >
          <Ionicons
            name="restaurant-outline"
            size={28}
            color={colors.primary}
          />
          <Text style={styles.cardTitle}>
            Plano do dia
          </Text>
          <Text style={styles.cardText}>
            Veja suas refeições personalizadas
          </Text>
        </TouchableOpacity>

        <View style={styles.row}>
          {/* Progresso */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(tabs)/progress")}
          >
            <Ionicons
              name="trending-up-outline"
              size={24}
              color={colors.textPrimary}
            />
            <Text style={styles.cardTitleSmall}>
              Progresso
            </Text>
          </TouchableOpacity>

          {/* Receitas */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              // tela de receitas depois
            }}
          >
            <Ionicons
              name="book-outline"
              size={24}
              color={colors.textPrimary}
            />
            <Text style={styles.cardTitleSmall}>
              Receitas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RESUMO */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>
          Resumo rápido
        </Text>

        <Text style={styles.summaryItem}>
          • Acompanhe seu progresso regularmente
        </Text>
        <Text style={styles.summaryItem}>
          • Registre seu peso semanalmente
        </Text>
        <Text style={styles.summaryItem}>
          • Siga o plano para melhores resultados
        </Text>
      </View>
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
    padding: spacing.lg,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "600",
    marginTop: 50,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  cards: {
    gap: 40,
    marginTop: 30,
  },
  cardPrimary: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  cardTitle: {
    marginTop: spacing.sm,
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  cardText: {
    marginTop: 4,
    color: colors.textSecondary,
  },
  cardTitleSmall: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  summary: {
    marginTop: 40,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  summaryItem: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
