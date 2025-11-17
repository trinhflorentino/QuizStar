// Shared types for ResultFetch components

export interface Question {
  type: string;
  question: string;
  options?: Array<{ option: string; [key: string]: any }>;
  score?: number | string;
  [key: string]: any;
}

export interface Answer {
  answer: any;
  [key: string]: any;
}

export interface StudentAnswer {
  selectedAnswer: any;
  [key: string]: any;
}

export interface QuestionScore {
  score: number;
  maxScore: number;
  isCorrect: boolean | null;
}

export interface OrderMapping {
  [key: number]: {
    newIndex?: number;
    optionMapping?: { [key: number]: number };
  };
}

export interface StudentInfo {
  name?: string;
  class?: string;
  school?: string;
  email?: string;
  [key: string]: any;
}

export interface ResponseDoc {
  selected_answers?: StudentAnswer[];
  score?: string;
  stud_info?: StudentInfo;
  submittedAt?: any;
  attemptNumber?: number;
  attemptId?: string;
  scoreQ?: string;
  scoreAll?: string;
  isGuest?: boolean;
  orderMapping?: OrderMapping;
  [key: string]: any;
}




