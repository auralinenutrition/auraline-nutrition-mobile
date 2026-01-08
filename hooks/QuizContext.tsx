import React, { createContext, useContext, useMemo, useState } from "react";
import { QUIZ_QUESTIONS } from "@/hooks/quiz.questions";

type QuizState = {
  currentStep: number;
  answers: Record<string, any>;
  isComplete: boolean;
};

type QuizContextType = {
  state: QuizState;
  currentQuestion: (typeof QUIZ_QUESTIONS)[number] | null;
  totalSteps: number;
  hasPrevious: boolean;
  hasAnswer: boolean;
  canGoNext: boolean;
  canComplete: boolean;
  isLastQuestion: boolean;
  answerQuestion: (value: any) => void;
  goNext: () => void;
  goToPrevious: () => void;
  resetQuiz: () => void;
};

const QuizContext = createContext<QuizContextType | null>(null);

const initialState: QuizState = {
  currentStep: 0,
  answers: {},
  isComplete: false,
};

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuizState>(initialState);

  const totalSteps = QUIZ_QUESTIONS.length;

  const currentQuestion =
    QUIZ_QUESTIONS[state.currentStep] ?? null;

  const hasPrevious = state.currentStep > 0;

  const hasAnswer = useMemo(() => {
    if (!currentQuestion) return false;
    const value = state.answers[currentQuestion.id];
    return value !== undefined && value !== null;
  }, [state.answers, currentQuestion]);

  const isLastQuestion = state.currentStep === totalSteps - 1;

  const canGoNext = hasAnswer && !isLastQuestion;
  const canComplete = hasAnswer && isLastQuestion;

  function answerQuestion(value: any) {
    if (!currentQuestion) return;

    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: value,
      },
    }));
  }

  function goNext() {
    setState((prev) => {
      if (prev.currentStep >= totalSteps - 1) return prev;
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  }

  function goToPrevious() {
    setState((prev) => {
      if (prev.currentStep <= 0) return prev;
      return { ...prev, currentStep: prev.currentStep - 1 };
    });
  }

  function resetQuiz() {
    setState(initialState);
  }

  return (
    <QuizContext.Provider
      value={{
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
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
