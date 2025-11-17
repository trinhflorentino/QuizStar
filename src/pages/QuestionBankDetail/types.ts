// Shared types for QuestionBankDetail components

export interface QuestionBank {
  id: string;
  title?: string;
  chapters?: Chapter[];
  matrixSource?: {
    snapshot?: any;
    prompt?: string;
    promptVersion?: string;
    processedAt?: any;
    reanalyzedAt?: any;
    filename?: string;
  };
  matrixTemplate?: any;
  filename?: string;
  createdAt?: any;
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
  questionId?: string;
  [key: string]: any;
}

export interface Question {
  questionId: string;
  description?: string;
  question?: string;
  question_text?: string;
  formattedQuestion?: {
    question: string;
    options?: Array<{ option?: string; text?: string; is_correct?: boolean; [key: string]: any }>;
    type?: string;
  };
  classificationMeta?: {
    suggestedByAI?: boolean;
    manualOverride?: boolean;
    suggestionReason?: string;
    [key: string]: any;
  };
  importedFrom?: {
    examTitle?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface DeleteTarget {
  name?: string;
  description?: string;
  [key: string]: any;
}

export interface EditTarget {
  name?: string;
  description?: string;
  [key: string]: any;
}

export interface SelectedRequirement {
  chapterName: string;
  subContentName: string;
  levelName: string;
  level: string;
  item: RequirementItem;
  chapterIndex: number;
  subContentIndex: number;
  itemIndex: number;
}




