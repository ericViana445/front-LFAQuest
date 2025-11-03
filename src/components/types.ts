// components/lession/types.ts
export interface QuestionData {
  question: string;
  alternatives: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AutomatonValidation {
  mustHaveInitialState: boolean;
  mustHaveFinalStates: boolean;
  requiredTransitions?: Array<{ from: string; to: string; symbol: string }>;
  validateFunction: (estados: any[], conexoes: any[]) => boolean;
}

export interface AutomatonData {
  objective: string;
  description: string;
  instructions: string[];
  validation: AutomatonValidation;
}

export interface LessonData {
  id: number;
  title: string;
  type: "normal" | "automaton";
  questions?: QuestionData[];
  automatonData?: AutomatonData;
}