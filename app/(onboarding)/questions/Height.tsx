import { View, Text, StyleSheet } from "react-native";
import { useMemo, useState, useEffect } from "react";
import { colors, spacing, typography } from "@/theme";
import { VerticalPicker } from "@/app/components/pickers/VerticalPicker";

type HeightQuestionProps = {
  value?: number;
  onChange: (height: number) => void;
};

export default function HeightQuestion({
  value,
  onChange,
}: HeightQuestionProps) {
  // Intervalo realista de altura
  const heights = useMemo(() => {
    const list: number[] = [];
    for (let h = 130; h <= 220; h++) {
      list.push(h);
    }
    return list;
  }, []);

  const [height, setHeight] = useState(value ?? 170);

  useEffect(() => {
  if (typeof value === 'number') {
    setHeight(value);
  }
}, [value]);

  return (
    <View style={styles.container}>
      {/* Pergunta */}
      <Text style={styles.title}>Qual é a sua altura?</Text>

      <Text style={styles.subtitle}>
        Usamos essa informação para ajustar suas metas nutricionais
      </Text>

      {/* Picker */}
      <View style={styles.pickerContainer}>
        <VerticalPicker
          data={heights}
          value={height}
          onChange={(h) => {
            setHeight(h);
            onChange(h);
          }}
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
