export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  createdAt: string;
  votes: number;
  answers: Answer[];
  views: number;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  author: string;
  createdAt: string;
  votes: number;
}

export interface User {
  name: string;
  email?: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export type SortOption = 'newest' | 'votes' | 'answers';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}