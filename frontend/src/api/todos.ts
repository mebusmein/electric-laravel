import { createCollection } from '@tanstack/react-db';
import client from './client';
import type { CreateTodoData, Todo, UpdateTodoData } from './types';
import { electricCollectionOptions } from '@tanstack/electric-db-collection';
import z from 'zod/v4';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

const todoShape = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

// Helper to get auth headers for Electric shape requests
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : "";
};

export const todosCollection = createCollection(
  electricCollectionOptions({
    id: 'todos',
    schema: todoShape,
    shapeOptions: {
      url: `${API_URL}/api/shape/todos`,
      headers: {
        Authorization: getAuthToken,
      },
    },
    getKey: (item) => item.id,
  })
)