import { View, Text, StyleSheet } from "react-native";
import { useMemo } from "react";
import { colors, spacing, typography } from "@/theme";
import { VerticalPicker } from "@/components/pickers/VerticalPicker";


type WeightQuestionProps = {
  value?: number;
  onChange: (weight: number) => void;
};

export default function WeightQuestion({
  value,
  onChange,
}: WeightQuestionProps) {
  const weights = useMemo(() => {
    const list: number[] = [];
    for (let w = 30; w <= 200; w++) list.push(w);
    return list;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual é o seu peso atual?</Text>

      <Text style={styles.subtitle}>
        Essa informação é essencial para calcular seu plano ideal
      </Text>

      <View style={styles.pickerContainer}>
        <VerticalPicker
          data={weights}
          value={value ?? 70}
          onChange={onChange}
          renderLabel={(w) => `${w} kg`}
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
