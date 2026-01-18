export type QuizQuestionType =
  | "single"
  | "multiple"
  | "number"
  | "date";

export type QuizBaseQuestion = {
  id: string;
  question: string;
  type: QuizQuestionType;
};

export type SingleChoiceQuestion = QuizBaseQuestion & {
  type: "single";
  options: string[];
};

export type MultipleChoiceQuestion = QuizBaseQuestion & {
  type: "multiple";
  options: string[];
  allowOther?: boolean;
};

export type NumberQuestion = QuizBaseQuestion & {
  type: "number";
  unit: "kg" | "cm";
};

export type DateQuestion = QuizBaseQuestion & {
  type: "date";
};

export type QuizQuestion =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | NumberQuestion
  | DateQuestion;

/**
 * 🔥 TIPOS DE RESPOSTA (PARTE CRÍTICA)
 */

// single → string
// number → number
// date → Date
// multiple → array OU objeto (quando allowOther)
export type QuizAnswer =
  | string
  | number
  | Date
  | string[]
  | {
      selected: string[];
      other?: string;
    };

export type QuizAnswersMap = Record<string, QuizAnswer>;
