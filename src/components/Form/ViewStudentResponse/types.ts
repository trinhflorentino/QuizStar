// Shared types for ViewStudentResponse components

export interface Question {
  type: string;
  question: string;
  options?: Array<{ option: string; [key: string]: any }>;
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

export interface StudentInfo {
  name?: string;
  class?: string;
  school?: string;
  email?: string;
  [key: string]: any;
}

export interface ResponseData {
  selected_answers?: StudentAnswer[];
  stud_info?: StudentInfo;
  score?: string;
  [key: string]: any;
}




