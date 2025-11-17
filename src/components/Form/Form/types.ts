export interface Question {
  id?: string;
  type: 'mcq' | 'truefalse' | 'shortanswer' | 'textblock';
  question?: string;
  options?: Array<{ option: string; optionNo?: number }>;
  score?: number;
  imageUrl?: string;
}

export interface Answer {
  answer: number | string | string[] | boolean[];
}

export interface StudentInfo {
  name: string;
  email: string;
  roll_no?: string;
  class: string;
  school?: string;
  timeSpent?: number;
}

export interface StudentAnswer {
  selectedAnswer?: number | string | boolean[] | null;
  questionIndex?: number;
}

export interface QuestionResult {
  isCorrect: boolean | null;
  score: number;
  maxScore: number;
}

export interface OrderMapping {
  [originalIndex: string]: {
    newIndex: number;
    optionMapping?: { [newIndex: string]: number };
  };
}

export interface Attempt {
  id: string;
  attemptNumber?: number;
  submittedAt?: any;
  score?: number;
  status?: string;
}

export interface QuizData {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  originalQuestions: Question[];
  originalOrder: OrderMapping;
  setOriginalOrder: (order: OrderMapping) => void;
  answers: Answer[];
  title: string;
  status: string;
  duration: number | null;
}

export interface PreviousAttemptData {
  attempted: boolean;
  canResume: boolean;
  startTime?: any;
  remainingTime?: number;
  studInfo?: StudentInfo;
  selected_answers?: StudentAnswer[];
  orderMapping?: OrderMapping;
  attemptId?: string;
  previousAttempts?: Attempt[];
}

export type SelectedAnswersAction =
  | { type: 'SET_MCQ_ANSWER'; questionIndex: number; optionIndex: number }
  | { type: 'SET_TF_ANSWER'; questionIndex: number; optionIndex: number; isTrue: boolean }
  | { type: 'RESTORE_ANSWERS'; answers: any }
  | { type: 'RESET' };

export interface ScoreResult {
  score: number;
  totalScore: number;
  scoreQ: number;
  scoreAll: number;
}

