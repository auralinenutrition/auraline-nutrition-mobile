import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, layout } from "@/theme";

type Props = {
  title: string;
  description: string;
};

export function MealCard({ title, description }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="restaurant-outline"
          size={22}
          color={colors.primary}
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.description}>
        {description}
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          Ver detalhes
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  description: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 6,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: "500",
  },
});
