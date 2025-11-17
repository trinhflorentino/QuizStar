// Shared types for DisplayResponses components

export interface Response {
  id: string;
  userIdentifier: string;
  attemptId: string | null;
  name: string;
  email: string;
  class: string;
  school?: string;
  score: string;
  createDate: string;
  isGuest: boolean;
  status: string;
  attemptNumber: number;
}

export interface ResponseData {
  stud_info?: {
    name?: string;
    class?: string;
    school?: string;
    [key: string]: any;
  };
  score?: string;
  submittedAt?: any;
  isGuest?: boolean;
  status?: string;
  attemptNumber?: number;
  timeExpired?: boolean;
  [key: string]: any;
}




