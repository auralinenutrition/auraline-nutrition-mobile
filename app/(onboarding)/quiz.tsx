import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useQuiz } from "@/hooks/QuizContext";

import BirthDateQuestion from "./questions/BirthDate";
import HeightQuestion from "./questions/Height";
import WeightQuestion from "./questions/Weight";
import TargetWeightQuestion from "./questions/TargetWeight";

import OnboardingWeeklyEvolution from "./motivations/OnboardingWeeklyEvolution";
import OnboardingWeightProjection from "./motivations/OnboardingWeightProjection";
import OnboardingEducationShort from "./motivations/OnboardingEducationShort";

import { colors, spacing, typography, layout } from "@/theme";

export default function QuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    state,
    currentQuestion,
    totalSteps,
    hasAnswer,
    canGoNext,
    canComplete,
    isLastQuestion,
    activeMotivation,
    answerQuestion,
    goNext,
    goToPrevious,
    resetQuiz,
  } = useQuiz();

  if (!currentQuestion) return null;

  const progress = (state.currentStep + 1) / totalSteps;
  const value = state.answers[currentQuestion.id];

  async function handleContinue() {
    if (canComplete && !activeMotivation) {
      await AsyncStorage.setItem(
        "@pending_quiz",
        JSON.stringify(state.answers)
      );
      router.replace("/(onboarding)/loading");
      return;
    }

    if (canGoNext || activeMotivation) {
      goNext();
    }
  }

  function handleBack() {
    if (activeMotivation) {
      goToPrevious();
      return;
    }

    if (state.currentStep === 0) {
      resetQuiz();
      router.replace("/");
      return;
    }

    goToPrevious();
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* CONTEÚDO */}
      <View key={currentQuestion.id} style={styles.content}>
        {activeMotivation === "weekly-evolution" && (
          <OnboardingWeeklyEvolution />
        )}

        {activeMotivation === "weight-projection" && (
          <OnboardingWeightProjection />
        )}

        {activeMotivation === "education-short" && (
          <OnboardingEducationShort />
        )}

        {!activeMotivation && (
          <>
            {/* 🔹 DATA */}
            {currentQuestion.type === "date" && (
              <BirthDateQuestion
                value={value}
                onChange={(date) => answerQuestion(date)}
              />
            )}

            {/* 🔹 ALTURA */}
            {currentQuestion.type === "number" &&
              currentQuestion.unit === "cm" && (
                <HeightQuestion
                  value={value}
                  onChange={(v) => answerQuestion(v)}
                />
              )}

            {/* 🔹 PESO ATUAL */}
            {currentQuestion.type === "number" &&
              currentQuestion.unit === "kg" &&
              currentQuestion.id === "12" && (
                <WeightQuestion
                  value={value}
                  onChange={(v) => answerQuestion(v)}
                />
              )}

            {/* 🔹 PESO DESEJADO */}
            {currentQuestion.type === "number" &&
              currentQuestion.unit === "kg" &&
              currentQuestion.id === "13" && (
                <TargetWeightQuestion
                  currentWeight={state.answers["12"]}
                  value={value}
                  onChange={(v) => answerQuestion(v)}
                />
              )}

            {/* 🔹 SINGLE / MULTIPLE */}
            {(currentQuestion.type === "single" ||
              currentQuestion.type === "multiple") && (
              <>
                <Text style={styles.question}>
                  {currentQuestion.question}
                </Text>

                <View style={styles.answers}>
                  {currentQuestion.options?.map((option) => {
                    const selected =
                      currentQuestion.type === "multiple"
                        ? value?.selected?.includes(option)
                        : value === option;

                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.option,
                          selected && styles.optionSelected,
                        ]}
                        activeOpacity={0.85}
                        onPress={() => {
                          if (currentQuestion.type === "multiple") {
                            const prev: string[] = value?.selected ?? [];
                            const updated = prev.includes(option)
                            ? prev.filter((o: string) => o !== option)
                            : [...prev, option];      

                            answerQuestion({
                              selected: updated,
                              other: value?.other ?? "",
                            });
                          } else {
                            answerQuestion(option);
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selected &&
                              styles.optionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* 🔥 OUTRAS ALERGIAS (ID 21) */}
                {currentQuestion.type === "multiple" &&
                  currentQuestion.allowOther && (
                    <TextInput
                      placeholder="Outras alergias (opcional)"
                      value={value?.other ?? ""}
                      onChangeText={(text) =>
                        answerQuestion({
                          selected: value?.selected ?? [],
                          other: text,
                        })
                      }
                      style={styles.otherInput}
                    />
                  )}
              </>
            )}
          </>
        )}
      </View>

      {/* CTA */}
      {(hasAnswer || activeMotivation) && (
        <View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + spacing.md },
          ]}
        >
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.9}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>
              {isLastQuestion
                ? "Criar meu plano personalizado →"
                : "Continuar"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: { fontSize: 20, color: colors.textSecondary },
  progressContainer: { flex: 1, marginLeft: spacing.sm },
  progressTrack: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  question: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "500",
    marginBottom: 58,
    color: colors.textPrimary,
  },
  answers: { gap: spacing.md },
  option: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.base,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionText: { ...typography.base, color: colors.textPrimary },
  optionTextSelected: { color: colors.primaryDark },
  otherInput: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.base,
    padding: spacing.md,
  },
  footer: { paddingHorizontal: spacing.lg },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.base,
    paddingVertical: spacing.md + 4,
    alignItems: "center",
  },
  continueText: { ...typography.base, color: colors.white },
});
