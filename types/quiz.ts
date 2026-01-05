import { z } from "zod";

export const QuizAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.union([z.string(), z.number(), z.array(z.string())]),
});

export type QuizAnswer = z.infer<typeof QuizAnswerSchema>;

export interface QuizMotivation {
  title: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: "single" | "multiple" | "scale" | "date" | "number";
  question: string;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
  motivationText?: string; // Texto simples para conversão em QuizMotivation
  motivation?: QuizMotivation;
}

export interface QuizState {
  currentStep: number;
  answers: Record<string, QuizAnswer["answer"]>;
  isComplete: boolean;
  pendingMotivation: QuizMotivation | null;
}