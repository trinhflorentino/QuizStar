// Shared types for ImportExamQuestions components

export interface Folder {
  id: string;
  type: 'folder';
  name: string;
  parent: string;
  [key: string]: any;
}

export interface Exam {
  id: string;
  type: 'exam';
  quiz_title: string;
  folderId: string;
  [key: string]: any;
}

export type DisplayItem = Folder | Exam;

export interface Question {
  id: string;
  question_text: string;
  options?: Array<{ text?: string; option?: string; is_correct?: boolean; [key: string]: any }>;
  type?: string;
  originalFormat?: boolean;
  originalIndex?: number;
  order?: number;
  [key: string]: any;
}

export interface QuestionMapping {
  question: Question;
  selected: boolean;
  chapterIndex: number | null;
  subContentIndex: number | null;
  requirement: string | null;
  itemIndex?: number | null;
  aiSuggestion: any | null;
  manualOverride: boolean;
}

export interface AISuggestion {
  chapterIndex?: number;
  subContentIndex?: number;
  requirement?: string;
  confidence?: number;
  reason?: string;
  [key: string]: any;
}

export interface QuestionBank {
  id: string;
  title?: string;
  chapters?: Chapter[];
  matrixTemplate?: any;
  [key: string]: any;
}

export interface Chapter {
  name: string;
  subContents?: SubContent[];
  [key: string]: any;
}

export interface SubContent {
  name: string;
  requirements?: {
    nhanBiet?: RequirementItem[];
    thongHieu?: RequirementItem[];
    vanDung?: RequirementItem[];
    vanDungCao?: RequirementItem[];
  };
  [key: string]: any;
}

export interface RequirementItem {
  _template?: boolean;
  description?: string;
  question?: string;
  question_text?: string;
  [key: string]: any;
}

export interface CoverageSummary {
  summary?: CoverageItem[];
  [key: string]: any;
}

export interface CoverageItem {
  chapterIndex: number;
  subContentIndex: number;
  requirement: string;
  subContentName: string;
  existing: number;
  incoming: number;
}




