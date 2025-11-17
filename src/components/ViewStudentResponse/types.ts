export interface Question {
  id?: string;
  type: 'mcq' | 'truefalse' | 'shortanswer';
  question?: string;
  options?: Array<{ option: string; optionNo?: number }>;
  score?: number;
  imageUrl?: string;
}

export interface Answer {
  answer: number | string | string[] | boolean[];
}

export interface StudentAnswer {
  selectedAnswer?: number | string | boolean[] | null;
  questionIndex?: number;
}

export interface StudentInfo {
  name?: string;
  email?: string;
  class?: string;
  school?: string;
  timeSpent?: number;
}

export interface ViewStudentResponseParams {
  pin: string;
  studentEmail: string;
  attemptId?: string;
}

