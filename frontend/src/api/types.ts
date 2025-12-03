export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Label {
  id: number;
  user_id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLabelData {
  name: string;
  color: string;
}

export interface UpdateLabelData {
  name?: string;
  color?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  label_ids?: number[];
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  label_ids?: number[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

