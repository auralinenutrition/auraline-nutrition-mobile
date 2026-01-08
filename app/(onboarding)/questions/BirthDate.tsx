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

export default function BirthDateQuestion({ value, onChange }: BirthDateProps) {
  const safeDate =
    value instanceof Date && !isNaN(value.getTime())
      ? value
      : new Date(2000, 0, 1);

  const day = safeDate.getDate();
  const month = safeDate.getMonth();
  const year = safeDate.getFullYear();

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
          onChange={(d) => onChange(new Date(year, month, d))}
        />

        <VerticalPicker
          data={MONTHS.map((_, i) => i)}
          value={month}
          onChange={(m) => onChange(new Date(year, m, day))}
          renderLabel={(m) => MONTHS[m]}
        />

        <VerticalPicker
          data={years}
          value={year}
          onChange={(y) => onChange(new Date(y, month, day))}
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
  pickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
});
