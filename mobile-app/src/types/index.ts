export type Priority = 'low' | 'medium' | 'high';

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  user: string;
  title: string;
  description?: string;
  dueDate: string | null; // ISO string
  priority: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse extends User {
  token: string;
}

export interface NewTaskInput {
  title: string;
  description?: string;
  dueDate?: string | null;
  priority: Priority;
}
