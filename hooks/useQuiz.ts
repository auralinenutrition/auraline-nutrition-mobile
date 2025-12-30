import { useState, useCallback, useMemo } from "react";
import {
  QuizState,
  QuizQuestion,
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
  const currentAnswer = state.answers[currentQuestion?.id];
  const hasAnswer = currentAnswer !== undefined && currentAnswer !== null;

  // Pode avançar apenas se tiver resposta e não houver motivação pendente
  const canGoNext = useMemo(() => {
    return hasAnswer && !state.pendingMotivation && hasNext;
  }, [hasAnswer, state.pendingMotivation, hasNext]);

  // Deve mostrar motivação se houver uma pendente
  const shouldShowMotivation = useMemo(() => {
    return state.pendingMotivation !== null;
  }, [state.pendingMotivation]);

  // É a última pergunta
  const isLastQuestion = useMemo(() => {
    return state.currentStep === totalSteps - 1;
  }, [state.currentStep, totalSteps]);

  // Pode finalizar se última pergunta foi respondida e não há motivação pendente
  const canComplete = useMemo(() => {
    return isLastQuestion && hasAnswer && !state.pendingMotivation;
  }, [isLastQuestion, hasAnswer, state.pendingMotivation]);

  // Apenas salva a resposta, não avança
  const answerQuestion = useCallback((answer: QuizAnswer["answer"]) => {
    setState((prev: QuizState) => {
      const currentQ = QUIZ_QUESTIONS[prev.currentStep];
      const newAnswers = {
        ...prev.answers,
        [currentQ.id]: answer,
      };

      // Se a pergunta tem motivação, prepara para mostrar
      // Converte motivationText em motivation se necessário
      let pendingMotivation: QuizMotivation | null = null;
      if (currentQ.motivation) {
        pendingMotivation = currentQ.motivation;
      } else if (currentQ.motivationText) {
        // Converte motivationText simples em QuizMotivation
        pendingMotivation = {
          title: "",
          text: currentQ.motivationText,
        };
      }

      return {
        ...prev,
        answers: newAnswers,
        pendingMotivation,
      };
    });
  }, []);

  // Avança para próxima pergunta
  const goNext = useCallback(() => {
    if (!canGoNext) return;

    setState((prev: QuizState) => {
      const isLastStep = prev.currentStep === totalSteps - 1;

      return {
        ...prev,
        currentStep: isLastStep ? prev.currentStep : prev.currentStep + 1,
        isComplete: isLastStep,
        pendingMotivation: null,
      };
    });
  }, [canGoNext, totalSteps]);

  // Volta para pergunta anterior
  const goToPrevious = useCallback(() => {
    if (!hasPrevious) return;

    setState((prev: QuizState) => ({
      ...prev,
      currentStep: prev.currentStep - 1,
      pendingMotivation: null,
    }));
  }, [hasPrevious]);

  // Fecha motivação e avança se possível
  const closeMotivation = useCallback(() => {
    setState((prev: QuizState) => {
      const isLastStep = prev.currentStep === totalSteps - 1;
      const hasAnswer =
        prev.answers[QUIZ_QUESTIONS[prev.currentStep]?.id] !== undefined;

      // Se for última pergunta e tiver resposta, marca como completo
      if (isLastStep && hasAnswer) {
        return {
          ...prev,
          pendingMotivation: null,
          isComplete: true,
        };
      }

      // Caso contrário, apenas fecha motivação
      return {
        ...prev,
        pendingMotivation: null,
      };
    });
  }, [totalSteps]);

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
    shouldShowMotivation,
    isLastQuestion,
    canComplete,
    answerQuestion,
    goNext,
    goToPrevious,
    closeMotivation,
    reset,
  };
}
