import { useState, useCallback, useMemo } from 'react';
import { QuizState, QuizAnswerValue } from '@/types/quiz';
import { QUIZ_QUESTIONS } from './quiz.questions';

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    currentStep: 0,
    answers: {},
    isComplete: false,
    pendingMotivation: null, // mantido apenas para compatibilidade
  });

  const currentQuestion = QUIZ_QUESTIONS[state.currentStep];
  const totalSteps = QUIZ_QUESTIONS.length;

  const hasNext = state.currentStep < totalSteps - 1;
  const hasPrevious = state.currentStep > 0;

  const currentAnswer = state.answers[currentQuestion?.id];
  const hasAnswer = currentAnswer !== undefined && currentAnswer !== null;

  const isLastQuestion = state.currentStep === totalSteps - 1;

  const canGoNext = hasAnswer && hasNext;
  const canComplete = hasAnswer && isLastQuestion;

  const answerQuestion = useCallback((answer: QuizAnswerValue) => {
    setState(prev => {
      const currentQ = QUIZ_QUESTIONS[prev.currentStep];

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQ.id]: answer,
        },
      };
    });
  }, []);

  const goNext = useCallback(() => {
    setState(prev => {
      if (prev.currentStep === totalSteps - 1) {
        return { ...prev, isComplete: true };
      }

      return {
        ...prev,
        currentStep: prev.currentStep + 1,
      };
    });
  }, [totalSteps]);

  const goToPrevious = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

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
    answerQuestion,
    goNext,
    goToPrevious,
    reset,
  };
}
