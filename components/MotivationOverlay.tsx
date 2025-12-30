import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuizMotivation, QuizAnswer } from '@/types/quiz';
import { colors, spacing, typography, layout } from '@/theme';

interface MotivationOverlayProps {
  visible: boolean;
  motivation: QuizMotivation | null;
  questionId?: string;
  answers?: Record<string, QuizAnswer['answer']>;
  onClose: () => void;
}

export function MotivationOverlay({ 
  visible, 
  motivation, 
  questionId,
  answers,
  onClose 
}: MotivationOverlayProps) {
  const insets = useSafeAreaInsets();

  if (!motivation) return null;

  // Gerar dados do gráfico para pergunta 13
  const getChartData = () => {
    if (questionId !== '13' || !answers) return null;
    
    const currentWeight = Number(answers['12']); // Peso atual (pergunta 12)
    const targetWeight = Number(answers['13']); // Peso desejado (pergunta 13)
    
    if (!currentWeight || !targetWeight || currentWeight === targetWeight) return null;
    
    const weeks = 6;
    const totalChange = targetWeight - currentWeight;
    const weeklyChange = totalChange / weeks;
    
    const data = [];
    for (let i = 0; i <= weeks; i++) {
      data.push({
        week: i + 1,
        weight: Math.round((currentWeight + (weeklyChange * i)) * 10) / 10,
      });
    }
    
    return { data, currentWeight, targetWeight };
  };

  const chartData = getChartData();
  const showChart = questionId === '13' && chartData;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { paddingTop: insets.top + spacing.xl }]}>
          <View style={styles.card}>
            {!showChart && <Text style={styles.emoji}>✨</Text>}
            {motivation.title ? (
              <Text style={styles.title}>{motivation.title}</Text>
            ) : null}
            
            {showChart ? (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>
                  Projeção estimada baseada em perfis semelhantes ao seu
                </Text>
                <View style={styles.chartWrapper}>
                  <View style={styles.chart}>
                    {chartData.data.map((point, idx) => {
                      const maxWeight = Math.max(...chartData.data.map(d => d.weight));
                      const minWeight = Math.min(...chartData.data.map(d => d.weight));
                      const range = maxWeight - minWeight || 0.1;
                      const yPosition = 160 - ((point.weight - minWeight) / range) * 160;
                      const isLast = idx === chartData.data.length - 1;
                      const nextPoint = !isLast ? chartData.data[idx + 1] : null;
                      const nextY = nextPoint 
                        ? 160 - ((nextPoint.weight - minWeight) / range) * 160 
                        : yPosition;
                      
                      return (
                        <View key={idx} style={styles.chartItem}>
                          <View style={[styles.chartBarContainer, { height: 160 }]}>
                            <View
                              style={[
                                styles.chartPoint,
                                { bottom: yPosition - 4 }
                              ]}
                            />
                            {!isLast && (
                              <>
                                <View
                                  style={[
                                    styles.chartLineHorizontal,
                                    {
                                      bottom: yPosition - 4,
                                      left: '50%',
                                      width: '50%',
                                    }
                                  ]}
                                />
                                {Math.abs(nextY - yPosition) > 2 && (
                                  <View
                                    style={[
                                      styles.chartLineVertical,
                                      {
                                        bottom: Math.min(yPosition, nextY) - 4,
                                        left: '100%',
                                        height: Math.abs(nextY - yPosition),
                                      }
                                    ]}
                                  />
                                )}
                              </>
                            )}
                          </View>
                          <Text style={styles.chartXLabel}>
                            S{point.week}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <View style={styles.chartYLabels}>
                    <Text style={styles.chartYLabel}>
                      {Math.max(...chartData.data.map(d => d.weight)).toFixed(1)}kg
                    </Text>
                    <Text style={styles.chartYLabel}>
                      {Math.min(...chartData.data.map(d => d.weight)).toFixed(1)}kg
                    </Text>
                  </View>
                </View>
                <Text style={styles.chartSubtitle}>
                  Resultados reais dependem de consistência e acompanhamento.
                </Text>
              </View>
            ) : null}
            
            <Text style={styles.text}>{motivation.text}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...layout.shadow.medium,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.base,
  },
  title: {
    ...typography.xl,
    fontWeight: typography.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  text: {
    ...typography.lg,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xxl,
    borderRadius: layout.borderRadius.base,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.base,
    fontWeight: typography.semibold,
    color: colors.white,
  },
  chartContainer: {
    width: '100%',
    marginVertical: spacing.lg,
  },
  chartTitle: {
    ...typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 180,
    marginBottom: spacing.md,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    position: 'relative',
    paddingBottom: spacing.base,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBarContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  chartPoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00C974',
    zIndex: 2,
  },
  chartLineHorizontal: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#00C974',
    zIndex: 1,
  },
  chartLineVertical: {
    position: 'absolute',
    width: 2,
    backgroundColor: '#00C974',
    zIndex: 1,
  },
  chartXLabel: {
    ...typography.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  chartYLabels: {
    width: 50,
    justifyContent: 'space-between',
    paddingBottom: spacing.base,
    paddingRight: spacing.sm,
  },
  chartYLabel: {
    ...typography.xs,
    color: colors.textSecondary,
  },
  chartSubtitle: {
    ...typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

