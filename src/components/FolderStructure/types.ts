export interface Folder {
  id: string;
  type: 'folder';
  name: string;
  parent: string;
  createdAt?: any;
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

export interface PathItem {
  id: string;
  name: string;
}

export const ROOT_ID = '__root__';




