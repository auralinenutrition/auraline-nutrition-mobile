import { useState, useCallback, useMemo } from "react";
import {
  QuizState,
  QuizAnswer,
  QuizMotivation,
} from "@/types/quiz";
import { QUIZ_QUESTIONS } from "./quiz.questions";

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    currentStep: 0,
    answers: {},
    isComplete: false,
    pendingMotivation: null,
  });

  const currentQuestion = QUIZ_QUESTIONS[state.currentStep];
  const totalSteps = QUIZ_QUESTIONS.length;

  const hasNext = state.currentStep < totalSteps - 1;
  const hasPrevious = state.currentStep > 0;

  const currentAnswer =
    currentQuestion ? state.answers[currentQuestion.id] : undefined;

  const hasAnswer =
    currentAnswer !== undefined && currentAnswer !== null;

  /**
   * ⚠️ REGRA CRÍTICA
   * Não permitir avanço enquanto Modal estiver aberto
   */
  const canGoNext = useMemo(() => {
    return hasAnswer && !state.pendingMotivation && hasNext;
  }, [hasAnswer, state.pendingMotivation, hasNext]);

  const isLastQuestion = useMemo(() => {
    return state.currentStep === totalSteps - 1;
  }, [state.currentStep, totalSteps]);

  const canComplete = useMemo(() => {
    return (
      isLastQuestion &&
      hasAnswer &&
      !state.pendingMotivation
    );
  }, [isLastQuestion, hasAnswer, state.pendingMotivation]);

  const shouldShowMotivation = useMemo(() => {
    return state.pendingMotivation !== null;
  }, [state.pendingMotivation]);

  /**
   * 🧠 SALVAR RESPOSTA
   * ❌ NÃO abre motivação aqui
   * ❌ NÃO navega aqui
   */
  const answerQuestion = useCallback(
    (answer: QuizAnswer["answer"]) => {
      setState((prev) => {
        if (!QUIZ_QUESTIONS[prev.currentStep]) {
          return prev;
        }

        const question = QUIZ_QUESTIONS[prev.currentStep];

        return {
          ...prev,
          answers: {
            ...prev.answers,
            [question.id]: answer,
          },
        };
      });
    },
    []
  );

  /**
   * ▶️ AVANÇAR
   * Aqui sim decidimos se existe motivação
   */
  const goNext = useCallback(() => {
    setState((prev) => {
      const question = QUIZ_QUESTIONS[prev.currentStep];
      if (!question) return prev;

      // Se a pergunta tiver motivação, abre o overlay
      let pendingMotivation: QuizMotivation | null = null;

      if (question.motivation) {
        pendingMotivation = question.motivation;
      } else if (question.motivationText) {
        pendingMotivation = {
          title: "",
          text: question.motivationText,
        };
      }

      // Se houver motivação, NÃO avança ainda
      if (pendingMotivation) {
        return {
          ...prev,
          pendingMotivation,
        };
      }

      // Última pergunta → apenas marca como completo
      if (prev.currentStep === totalSteps - 1) {
        return {
          ...prev,
          isComplete: true,
        };
      }

      // Avança normalmente
      return {
        ...prev,
        currentStep: prev.currentStep + 1,
      };
    });
  }, [totalSteps]);

  /**
   * 🔙 VOLTAR
   * Sempre fecha qualquer overlay
   */
  const goToPrevious = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep === 0) return prev;

      return {
        ...prev,
        currentStep: prev.currentStep - 1,
        pendingMotivation: null,
      };
    });
  }, []);

  /**
   * ❌ FECHAR MOTIVAÇÃO
   * ⚠️ NÃO navega
   * ⚠️ NÃO finaliza
   */
  const closeMotivation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingMotivation: null,
    }));
  }, []);

  /**
   * 🔄 RESET TOTAL
   */
  const reset = useCallback(() => {
    setState({
      currentStep: 0,
      answers: {},
      isComplete: false,
      pendingMotivation: null,
    });
  }, []);

  return {
    state,
    currentQuestion,
    totalSteps,
    hasNext,
    hasPrevious,
    hasAnswer,
    canGoNext,
    canComplete,
    isLastQuestion,
    shouldShowMotivation,
    answerQuestion,
    goNext,
    goToPrevious,
    closeMotivation,
    reset,
  };
}
