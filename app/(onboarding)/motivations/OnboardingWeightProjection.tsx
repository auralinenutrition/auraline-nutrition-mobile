import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useQuiz } from "@/hooks/QuizContext";
import { colors, spacing, typography, layout } from "@/theme";

const CHART_HEIGHT = 160;
const CHART_PADDING = 28;

const DOT_SIZE = 10;
const DOT_RADIUS = DOT_SIZE / 2;

const MIN_WEIGHT = 20;
const MAX_WEIGHT = 100;

const Y_AXIS_VALUES = [100, 80, 60, 40, 20];

export default function OnboardingWeightProjection() {
  const { state } = useQuiz();
  const [chartWidth, setChartWidth] = useState(0);

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  const pesoAtual = Number(state.answers[12]);
  const pesoDesejado = Number(state.answers[13]);

  if (isNaN(pesoAtual) || isNaN(pesoDesejado)) {
    return null;
  }

  const points = [
    { label: "Semana 1", weight: pesoAtual },
    {
      label: "Semana 2",
      weight: pesoAtual + (pesoDesejado - pesoAtual) * 0.33,
    },
    {
      label: "Semana 3",
      weight: pesoAtual + (pesoDesejado - pesoAtual) * 0.66,
    },
    { label: "Semana 4", weight: pesoDesejado },
  ];

  function getX(index: number) {
    return (
      (index / (points.length - 1)) *
        (chartWidth - CHART_PADDING * 2) +
      CHART_PADDING
    );
  }

  function getY(weight: number) {
    const clamped = Math.min(
      MAX_WEIGHT,
      Math.max(MIN_WEIGHT, weight)
    );

    const normalized =
      (clamped - MIN_WEIGHT) / (MAX_WEIGHT - MIN_WEIGHT);

    return normalized * (CHART_HEIGHT - 20);
  }

  return (
    <View style={styles.screen}>
      {/* TÍTULO */}
      <Text style={styles.mainTitle}>
        Sua evolução pode ser{"\n"}mais rápida do que imagina
      </Text>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>
          Progresso estimado nas primeiras semanas
        </Text>

        <View
          style={styles.chart}
          onLayout={(e) =>
            setChartWidth(e.nativeEvent.layout.width)
          }
        >
          {/* EIXO Y */}
          {Y_AXIS_VALUES.map((value) => (
            <Text
              key={value}
              style={[
                styles.yLabel,
                {
                  bottom:
                    ((value - MIN_WEIGHT) /
                      (MAX_WEIGHT - MIN_WEIGHT)) *
                    (CHART_HEIGHT - 20),
                },
              ]}
            >
              {value}
            </Text>
          ))}

          {/* LINHAS */}
          {chartWidth > 0 &&
            points.map((_, index) => {
              if (index === points.length - 1) return null;

              const x1 = getX(index) + DOT_RADIUS;
              const y1 = getY(points[index].weight) + DOT_RADIUS;

              const x2 = getX(index + 1) + DOT_RADIUS;
              const y2 =
                getY(points[index + 1].weight) +
                DOT_RADIUS;

              const dx = x2 - x1;
              const dy = y1 - y2;

              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx);

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.line,
                    {
                      left: x1,
                      bottom: y1,
                      width: length,
                      transform: [
                        { rotate: `${angle}rad` },
                        { scaleX: anim },
                      ],
                    },
                  ]}
                />
              );
            })}

          {/* PONTOS */}
          {chartWidth > 0 &&
            points.map((point, index) => (
              <Animated.View
                key={point.label}
                style={[
                  styles.dot,
                  {
                    left: getX(index),
                    bottom: getY(point.weight),
                    transform: [{ scale: anim }],
                    opacity: anim,
                  },
                ]}
              />
            ))}
        </View>

        {/* EIXO X */}
        <View style={styles.xAxis}>
          {points.map((point, index) => (
            <View
              key={point.label}
              style={[
                styles.xLabelContainer,
                { left: getX(index) },
              ]}
            >
              <Text style={styles.xLabel}>
                {point.label}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.description}>
          Usuários com perfis semelhantes ao seu começam a ver
          mudanças visíveis entre 2 e 4 semanas — e você está
          iniciando exatamente no caminho certo para isso.
        </Text>
      </View>

      {/* TEXTO FINAL */}
      <Text style={styles.footerText}>
        Quanto antes você seguir seu plano, mais cedo seu corpo
        responde. É impressionante o quanto pequenas decisões
        diárias aceleram sua transformação.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: spacing.lg,
  },

  mainTitle: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: spacing.lg,
    lineHeight: 32,
  },

  card: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.md,
  },

  chart: {
    height: CHART_HEIGHT,
    position: "relative",
    marginBottom: spacing.md,
  },

  yLabel: {
    position: "absolute",
    left: -18,
    fontSize: 12,
    color: colors.textTertiary,
  },

  line: {
    position: "absolute",
    height: 2,
    backgroundColor: colors.primary,
    transformOrigin: "left center",
  },

  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_RADIUS,
    backgroundColor: colors.primary,
  },

  xAxis: {
    height: 24,
    marginTop: spacing.sm,
    position: "relative",
  },

  xLabelContainer: {
    position: "absolute",
    transform: [{ translateX: -24 }],
  },

  xLabel: {
    fontSize: 13,
    color: colors.textTertiary,
  },

  description: {
    marginTop: spacing.md,
    fontSize: 14,
    textAlign: "center",
    color: colors.textSecondary,
  },

  footerText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
