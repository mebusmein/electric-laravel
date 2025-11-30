import client from './client';
import type { CreateTodoData, Todo, UpdateTodoData } from './types';

export const todosApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await client.get<Todo[]>('/todos');
    return response.data;
  },

  get: async (id: number): Promise<Todo> => {
    const response = await client.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  create: async (data: CreateTodoData): Promise<Todo> => {
    const response = await client.post<Todo>('/todos', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTodoData): Promise<Todo> => {
    const response = await client.put<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/todos/${id}`);
  },
};

