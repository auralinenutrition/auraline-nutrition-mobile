import { z } from "zod";

/**
 * Aceitamos qualquer tipo de resposta real do quiz
 * (string, múltipla, número, data)
 */
export const QuizAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
    z.date(),
  ]),
});

export type QuizAnswerValue = z.infer<
  typeof QuizAnswerSchema
>["answer"];

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
  motivationText?: string;
  motivation?: QuizMotivation;
}

export interface QuizState {
  currentStep: number;
  answers: Record<string, QuizAnswerValue>;
  isComplete: boolean;
  pendingMotivation: QuizMotivation | null;
}
