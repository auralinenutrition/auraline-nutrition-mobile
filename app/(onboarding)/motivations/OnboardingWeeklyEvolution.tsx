import { View, Text, StyleSheet, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { colors, spacing, typography, layout } from "@/theme";
import { getRelativeWeeklyProgress } from "@/hooks/quiz.analytics";

export default function OnboardingWeeklyEvolution() {
  const data = getRelativeWeeklyProgress();
  const maxProgress = 100;

  const [chartWidth, setChartWidth] = useState(0);

  const CHART_HEIGHT = 120;
  const CHART_PADDING = 16;
  const DOT_RADIUS = 5;

  // 🔥 ANIMAÇÃO
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  function getX(index: number) {
    if (data.length === 1) return CHART_PADDING;

    return (
      (index / (data.length - 1)) *
        (chartWidth - CHART_PADDING * 2) +
      CHART_PADDING
    );
  }

  function getY(progress: number) {
    const usableHeight = CHART_HEIGHT - CHART_PADDING * 2;
    return CHART_PADDING + usableHeight * (progress / maxProgress);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Você tem grande potencial para alcançar sua meta
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Transição estimada nas próximas semanas
        </Text>

        <View
          style={[styles.chart, { height: CHART_HEIGHT }]}
          onLayout={(e) =>
            setChartWidth(e.nativeEvent.layout.width)
          }
        >
          {/* LINHAS */}
          {chartWidth > 0 &&
            data.map((point, index) => {
              if (index === data.length - 1) return null;

              const x1 = getX(index) + DOT_RADIUS;
              const y1 = getY(point.progress) + DOT_RADIUS;

              const x2 = getX(index + 1) + DOT_RADIUS;
              const y2 =
                getY(data[index + 1].progress) + DOT_RADIUS;

              const dx = x2 - x1;
              const dy = y1 - y2;

              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx);

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.segment,
                    {
                      left: x1,
                      bottom: y1,
                      width: length,
                      transform: [
                        { rotate: `${angle}rad` },
                        {
                          scaleX: anim,
                        },
                      ],
                    },
                  ]}
                />
              );
            })}

          {/* PONTOS */}
          {chartWidth > 0 &&
            data.map((point, index) => (
              <Animated.View
                key={point.week}
                style={[
                  styles.dot,
                  {
                    left: getX(index),
                    bottom: getY(point.progress),
                    transform: [{ scale: anim }],
                    opacity: anim,
                  },
                ]}
              />
            ))}
        </View>

        <View style={styles.xAxis}>
          {data.map((point, index) => (
            <View
              key={point.week}
              style={[
                styles.xLabelContainer,
                { left: getX(index) },
              ]}
            >
              <Text style={styles.xLabel}>
                Semana {point.week}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.description}>
          Essa projeção representa o ritmo médio de evolução
          nas primeiras semanas.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.md,
  },

  chart: {
    position: "relative",
    marginBottom: spacing.sm,
  },

  segment: {
    position: "absolute",
    height: 2,
    backgroundColor: colors.primary,
    transformOrigin: "left center",
  },

  dot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  xAxis: {
    height: 24,
    marginBottom: spacing.md,
  },

  xLabelContainer: {
    position: "absolute",
    transform: [{ translateX: -20 }],
  },

  xLabel: {
    ...typography.xs,
    color: colors.textTertiary,
  },

  description: {
    ...typography.sm,
    color: colors.textSecondary,
  },
});
