import { View, Text, StyleSheet } from "react-native";
import Svg, { Polyline, Line, Circle } from "react-native-svg";
import { colors, spacing } from "@/theme";

type Props = {
  weights: number[];
  target?: number;
};

const CHART_HEIGHT = 180;
const CHART_WIDTH = 300;
const PADDING = 28;

const MIN_WEIGHT = 20;
const MAX_WEIGHT = 100;

const Y_AXIS_VALUES = [100, 80, 60, 40, 20];

export function WeightProgressChart({
  weights,
  target,
}: Props) {
  if (weights.length < 2) return null;

  function clamp(value: number) {
    return Math.min(
      MAX_WEIGHT,
      Math.max(MIN_WEIGHT, value)
    );
  }

  function getY(weight: number) {
    const clamped = clamp(weight);
    const normalized =
      (clamped - MIN_WEIGHT) /
      (MAX_WEIGHT - MIN_WEIGHT);

    return (
      normalized * (CHART_HEIGHT - PADDING * 2) +
      PADDING
    );
  }

  const points = weights
    .map((w, i) => {
      const x =
        PADDING +
        (i / (weights.length - 1)) *
          (CHART_WIDTH - PADDING * 2);
      const y = getY(w);
      return `${x},${CHART_HEIGHT - y}`;
    })
    .join(" ");

  const targetY =
    target !== undefined
      ? CHART_HEIGHT - getY(target)
      : null;

  return (
    <View style={styles.container}>
      {/* EIXO Y */}
      <View style={styles.yAxis}>
        {Y_AXIS_VALUES.map((value) => (
          <Text
            key={value}
            style={[
              styles.yLabel,
              {
                bottom:
                  ((value - MIN_WEIGHT) /
                    (MAX_WEIGHT - MIN_WEIGHT)) *
                    (CHART_HEIGHT - PADDING * 2) +
                  PADDING -
                  6,
              },
            ]}
          >
            {value}
          </Text>
        ))}
      </View>

      {/* GRÁFICO */}
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Linha da meta */}
        {targetY !== null && (
          <Line
            x1={PADDING}
            x2={CHART_WIDTH - PADDING}
            y1={targetY}
            y2={targetY}
            stroke={colors.error}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
        )}

        {/* Linha do peso */}
        <Polyline
          points={points}
          fill="none"
          stroke={colors.primary}
          strokeWidth={3}
        />

        {/* Pontos */}
        {weights.map((w, i) => {
          const x =
            PADDING +
            (i / (weights.length - 1)) *
              (CHART_WIDTH - PADDING * 2);
          const y = CHART_HEIGHT - getY(w);

          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              fill={colors.primary}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.md,
  },
  yAxis: {
    width: 32,
    height: CHART_HEIGHT,
    justifyContent: "space-between",
    position: "relative",
    marginRight: 4,
  },
  yLabel: {
    position: "absolute",
    fontSize: 12,
    color: colors.textTertiary,
    right: 4,
  },
});
