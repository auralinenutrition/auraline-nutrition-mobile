import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useQuiz } from '@/hooks/useQuiz';
import { colors, spacing, typography, layout } from '@/theme';

export default function QuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    state,
    currentQuestion,
    totalSteps,
    hasPrevious,
    hasAnswer,
    canGoNext,
    canComplete,
    isLastQuestion,
    answerQuestion,
    goNext,
    goToPrevious,
  } = useQuiz();

  // 🔁 Redirect automático ao finalizar
  useEffect(() => {
    if (state.isComplete) {
      router.replace('/(onboarding)/result');
    }
  }, [state.isComplete, router]);

  if (!currentQuestion) {
    return null;
  }

  const handleContinue = () => {
    if (canComplete) {
      router.replace('/(onboarding)/result');
    } else if (canGoNext) {
      goNext();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        {hasPrevious && (
          <TouchableOpacity onPress={goToPrevious}>
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.stepText}>
          {state.currentStep + 1} / {totalSteps}
        </Text>
      </View>

      {/* Pergunta */}
      <View style={styles.content}>
        <Text style={styles.question}>
          {currentQuestion.question}
        </Text>

        {/* Opções */}
        <View style={styles.answers}>
          {currentQuestion.options?.map((option) => {
            const selected =
              state.answers[currentQuestion.id] === option;

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => answerQuestion(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Botão Continue */}
      {hasAnswer && (canGoNext || canComplete) && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.9}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>
              {isLastQuestion ? 'Finalizar' : 'Continuar'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  backText: {
    ...typography.sm,
    color: colors.primary,
  },

  stepText: {
    ...typography.sm,
    color: colors.textSecondary,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },

  question: {
    ...typography.xl,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  answers: {
    gap: spacing.md,
  },

  option: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.base,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },

  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  optionText: {
    ...typography.base,
    color: colors.textSecondary,
  },

  optionTextSelected: {
    color: colors.primaryDark,
  },

  footer: {
    paddingHorizontal: spacing.lg,
  },

  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.base,
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
  },

  continueText: {
    ...typography.base,
    color: colors.white,
  },
});

