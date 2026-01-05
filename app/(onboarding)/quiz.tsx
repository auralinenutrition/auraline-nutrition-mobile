import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { MotivationOverlay } from '@/components/MotivationOverlay';
import { colors, spacing, typography, layout } from '@/theme';

export default function QuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    state, 
    currentQuestion,
    totalSteps,
    hasNext,
    hasPrevious,
    hasAnswer,
    canGoNext,
    canComplete,
    shouldShowMotivation,
    isLastQuestion,
    answerQuestion,
    goNext,
    goToPrevious,
    closeMotivation,
  } = useQuiz();

  // Redirecionar quando quiz estiver completo
  useEffect(() => {
  if (state.isComplete && !shouldShowMotivation) {
    // Delay pequeno garante que o Modal já foi desmontado
    const timeout = setTimeout(() => {
      router.replace('/(onboarding)/result');
    }, 50);

    return () => clearTimeout(timeout);
  }
}, [state.isComplete, shouldShowMotivation]);

  if (!currentQuestion) {
    return null;
  }

  const handleAnswer = (answer: string | number | string[]) => {
    answerQuestion(answer);
  };

  const handleContinue = () => {
    if (canComplete) {
      // Última pergunta respondida, fechar motivação vai completar
      closeMotivation();
    } else if (canGoNext) {
      // Avançar para próxima pergunta
      goNext();
    }
  };

const [closing, setClosing] = useState(false);

const handleCloseMotivation = () => {
  if (closing) return;
  setClosing(true);
  closeMotivation();
};

  const progress = ((state.currentStep + 1) / totalSteps) * 100;
  const currentAnswer = state.answers[currentQuestion.id];
  const isOptionSelected = (option: string) => {
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(currentAnswer) && currentAnswer.includes(option);
    }
    return currentAnswer === option;
  };
  const isScaleSelected = (value: number) => currentAnswer === value;
  
  // Estados para inputs
  const [dateValue, setDateValue] = useState('');
  const [numberValue, setNumberValue] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {state.currentStep + 1} de {totalSteps}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.question}>{currentQuestion.question}</Text>

        {currentQuestion.type === 'single' && currentQuestion.options && (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  isOptionSelected(option) && styles.optionSelected,
                ]}
                onPress={() => handleAnswer(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isOptionSelected(option) && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentQuestion.type === 'multiple' && currentQuestion.options && (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  isOptionSelected(option) && styles.optionSelected,
                ]}
                onPress={() => {
                  const current = Array.isArray(currentAnswer) ? currentAnswer : [];
                  const newAnswer = current.includes(option)
                    ? current.filter((o) => o !== option)
                    : [...current, option];
                  handleAnswer(newAnswer);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isOptionSelected(option) && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentQuestion.type === 'scale' && (
          <View style={styles.scaleContainer}>
            {Array.from(
              { length: (currentQuestion.max || 10) - (currentQuestion.min || 1) + 1 },
              (_, i) => (currentQuestion.min || 1) + i
            ).map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.scaleButton,
                  isScaleSelected(value) && styles.scaleButtonSelected,
                ]}
                onPress={() => handleAnswer(value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.scaleButtonText,
                    isScaleSelected(value) && styles.scaleButtonTextSelected,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentQuestion.type === 'date' && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={dateValue}
              onChangeText={setDateValue}
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
              onBlur={() => {
                if (dateValue) handleAnswer(dateValue);
              }}
            />
            <Text style={styles.inputHint}>
              Digite sua data de nascimento
            </Text>
          </View>
        )}

        {currentQuestion.type === 'number' && (
          <View style={styles.inputContainer}>
            <View style={styles.numberInputWrapper}>
              <TextInput
                style={styles.numberInput}
                placeholder="0"
                value={numberValue}
                onChangeText={(text) => {
                  const num = text.replace(/[^0-9]/g, '');
                  setNumberValue(num);
                  if (num) handleAnswer(Number(num));
                }}
                keyboardType="numeric"
                placeholderTextColor={colors.textTertiary}
              />
              {currentQuestion.unit && (
                <Text style={styles.unitText}>{currentQuestion.unit}</Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {hasPrevious && (
          <TouchableOpacity
            style={styles.backButtonFooter}
            onPress={goToPrevious}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonFooterText}>Voltar</Text>
          </TouchableOpacity>
        )}
        
        {hasAnswer && (canGoNext || canComplete) && !shouldShowMotivation && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              {isLastQuestion ? 'Finalizar' : 'Continuar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <MotivationOverlay
        visible={shouldShowMotivation}
        motivation={state.pendingMotivation}
        questionId={currentQuestion.id}
        answers={state.answers}
        onClose={handleCloseMotivation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: spacing.sm,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary,
  },
  progressContainer: {
    marginTop: spacing.base,
    gap: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    ...typography.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  question: {
    ...typography.xl,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.xxl,
  },
  optionsContainer: {
    gap: spacing.base,
  },
  option: {
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: spacing.lg - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: layout.borderRadius.base,
    borderWidth: 1,
    borderColor: colors.optionBorder,
  },
  optionSelected: {
    backgroundColor: colors.optionSelected,
    borderColor: colors.primary,
  },
  optionText: {
    ...typography.base,
    color: colors.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  scaleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
    justifyContent: 'center',
  },
  scaleButton: {
    width: 60,
    height: 60,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: layout.borderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.optionBorder,
  },
  scaleButtonSelected: {
    backgroundColor: colors.optionSelected,
    borderColor: colors.primary,
  },
  scaleButtonText: {
    ...typography.lg,
    fontWeight: typography.semibold,
    color: colors.text,
  },
  scaleButtonTextSelected: {
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    flexDirection: 'row',
    gap: spacing.base,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButtonFooter: {
    paddingVertical: spacing.base,
    alignItems: 'center',
    flex: 1,
  },
  backButtonFooterText: {
    ...typography.base,
    color: colors.primary,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: layout.borderRadius.base,
    alignItems: 'center',
    flex: 2,
  },
  continueButtonText: {
    ...typography.base,
    fontWeight: typography.semibold,
    color: colors.white,
  },
  inputContainer: {
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: layout.borderRadius.base,
    borderWidth: 1,
    borderColor: colors.optionBorder,
    ...typography.base,
    color: colors.text,
  },
  inputHint: {
    ...typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  numberInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: layout.borderRadius.base,
    borderWidth: 1,
    borderColor: colors.optionBorder,
    paddingHorizontal: spacing.lg,
  },
  numberInput: {
    flex: 1,
    paddingVertical: spacing.md,
    ...typography.base,
    color: colors.text,
  },
  unitText: {
    ...typography.base,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
});
