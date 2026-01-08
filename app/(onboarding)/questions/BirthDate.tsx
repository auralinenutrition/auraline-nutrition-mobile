import { View, Text, StyleSheet } from "react-native";
import { useMemo } from "react";
import { colors, spacing, typography } from "@/theme";
import { VerticalPicker } from "@/components/pickers/VerticalPicker";

type BirthDateProps = {
  value?: Date;
  onChange: (date: Date) => void;
};

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

export default function BirthDateQuestion({
  value,
  onChange,
}: BirthDateProps) {
  // ✅ valor inicial APENAS se não houver resposta
  const date = value ?? new Date(2017, 0, 1);

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  }, []);

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  /**
   * 🔥 Função segura para alterar apenas parte da data
   */
  const updateDate = (newValues: Partial<{ day: number; month: number; year: number }>) => {
    const newDay = newValues.day ?? day;
    const newMonth = newValues.month ?? month;
    const newYear = newValues.year ?? year;

    onChange(new Date(newYear, newMonth, newDay));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual é a sua data de nascimento?</Text>
      <Text style={styles.subtitle}>
        Isso nos ajuda a personalizar seu plano com mais precisão
      </Text>

      <View style={styles.pickersRow}>
        <VerticalPicker
          data={days}
          value={day}
          onChange={(d) => updateDate({ day: d })}
        />

        <VerticalPicker
          data={MONTHS.map((_, i) => i)}
          value={month}
          onChange={(m) => updateDate({ month: m })}
          renderLabel={(m) => MONTHS[m]}
        />

        <VerticalPicker
          data={years}
          value={year}
          onChange={(y) => updateDate({ year: y })}
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
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  pickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
});
