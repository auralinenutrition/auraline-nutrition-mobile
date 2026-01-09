import React, { createContext, useContext, useMemo, useState } from "react";
import { QUIZ_QUESTIONS } from "@/hooks/quiz.questions";
import { QUIZ_MOTIVATIONS_BY_QUESTION } from "@/hooks/quiz.motivations";

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
  activeMotivation: string | null;
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
  const [activeMotivation, setActiveMotivation] = useState<string | null>(null);

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
      const current = QUIZ_QUESTIONS[prev.currentStep];
      const motivation = QUIZ_MOTIVATIONS_BY_QUESTION[current.id];

      // 1️⃣ Abrir motivação se existir
      if (motivation && !activeMotivation) {
        setActiveMotivation(motivation);
        return prev;
      }

      // 2️⃣ Fechar motivação e avançar
      setActiveMotivation(null);

      if (prev.currentStep >= totalSteps - 1) return prev;
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  }

  function goToPrevious() {
    // se estiver em motivação, apenas fecha
    if (activeMotivation) {
      setActiveMotivation(null);
      return;
    }

    setState((prev) => {
      if (prev.currentStep <= 0) return prev;
      return { ...prev, currentStep: prev.currentStep - 1 };
    });
  }

  function resetQuiz() {
    setActiveMotivation(null);
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
        activeMotivation,
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
