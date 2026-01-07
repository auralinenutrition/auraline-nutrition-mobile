import { View, Text, StyleSheet } from "react-native";
import { useMemo, useState, useEffect } from "react";
import { colors, spacing, typography } from "@/theme";
import { HorizontalPicker } from "@/app/components/pickers/HorizontalPicker";

type TargetWeightProps = {
  currentWeight: number; // peso atual para cálculo da diferença
  value?: number;
  onChange: (weight: number) => void;
};

export default function TargetWeightQuestion({
  currentWeight,
  value,
  onChange,
}: TargetWeightProps) {
  const weights = useMemo(() => {
    const list: number[] = [];
    for (let w = 30; w <= 200; w += 0.5) {
      list.push(Number(w.toFixed(1)));
    }
    return list;
  }, []);

  const [target, setTarget] = useState<number>(value ?? currentWeight);

  const diff = Number((target - currentWeight).toFixed(1));
  const diffText =
    diff === 0
      ? "Manter o peso atual"
      : diff > 0
      ? `+${diff} kg`
      : `${diff} kg`;

  return (
    <View style={styles.container}>
      {/* Pergunta */}
      <Text style={styles.title}>Qual é o peso que você deseja alcançar?</Text>

      <Text style={styles.subtitle}>
        Ajustamos o plano com base no seu objetivo
      </Text>

      {/* Valor em destaque */}
      <View style={styles.valueBox}>
        <Text style={styles.value}>{target.toFixed(1)} kg</Text>
        <Text style={styles.diff}>{diffText}</Text>
      </View>

      {/* Picker horizontal */}
      <HorizontalPicker
        data={weights}
        value={target}
        onChange={(v) => {
          setTarget(v);
          onChange(v);
        }}
        renderLabel={(w) => w.toFixed(1)}
      />
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

  valueBox: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  value: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  diff: {
    ...typography.base,
    color: colors.primary,
  },
});
