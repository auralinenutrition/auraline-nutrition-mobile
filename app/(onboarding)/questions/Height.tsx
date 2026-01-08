import { View, Text, StyleSheet } from "react-native";
import { useMemo } from "react";
import { colors, spacing, typography } from "@/theme";
import { VerticalPicker } from "@/components/pickers/VerticalPicker";


type HeightQuestionProps = {
  value?: number;
  onChange: (height: number) => void;
};

export default function HeightQuestion({
  value,
  onChange,
}: HeightQuestionProps) {
  const heights = useMemo(() => {
    const list: number[] = [];
    for (let h = 130; h <= 220; h++) list.push(h);
    return list;
  }, []);

  // ✅ fallback só se NÃO houver resposta
  const heightValue = value === undefined ? 170 : value;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual é a sua altura?</Text>

      <Text style={styles.subtitle}>
        Usamos essa informação para ajustar suas metas nutricionais
      </Text>

      <View style={styles.pickerContainer}>
        <VerticalPicker
          data={heights}
          value={heightValue}
          onChange={onChange}
          renderLabel={(h) => `${h} cm`}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  pickerContainer: {
    alignItems: "center",
  },
});
