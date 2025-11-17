export interface TestSession {
  id: string;
  quiz_title: string;
  original_exam_id: string;
  status: 'active' | 'inactive';
  duration: number;
  created_at?: any;
  creator?: string | null;
  creator_uid?: string;
}

export interface ExamDetails {
  title?: string;
  questions?: any[];
  answers?: any[];
  [key: string]: any;
}

export interface NewSessionForm {
  name: string;
  duration: number;
  status: 'active' | 'inactive';
}

export interface TestSessionManagerProps {
  examId: string;
  isOpen: boolean;
  handleClose: () => void;
}

