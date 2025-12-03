import { createCollection } from '@tanstack/react-db';
import client, { API_URL, getAuthToken } from './client';
import type { CreateTodoData, Todo, UpdateTodoData } from './types';
import { electricCollectionOptions } from '@tanstack/electric-db-collection';
import z from 'zod/v4';



export const todosApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await client.get<Todo[]>('/todos');
    return response.data;
  },

  get: async (id: number): Promise<Todo> => {
    const response = await client.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  create: async (data: CreateTodoData): Promise<{ todo: Todo; txid: string }> => {
    const response = await client.post<{ todo: Todo; txid: string }>('/todos', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTodoData): Promise<{ todo: Todo; txid: string }> => {
    const response = await client.put<{ todo: Todo; txid: string }>(`/todos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ txid: string }> => {
    const response = await client.delete<{ txid: string }>(`/todos/${id}`);
    return response.data;
  },

  syncLabels: async (id: number, labelIds: number[]): Promise<{ txid: string }> => {
    const response = await client.put<{ txid: string }>(`/todos/${id}/labels`, { label_ids: labelIds });
    return response.data;
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
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified;
      const response = await todosApi.create({
        title: newItem.title,
        description: newItem.description ?? undefined,
      });
      return { txid: Number(response.txid) };
    },
    onUpdate: async ({ transaction }) => {
      const updatedItem = transaction.mutations[0].modified;
      const response = await todosApi.update(updatedItem.id, {
        title: updatedItem.title,
        description: updatedItem.description ?? undefined,
      });
      return { txid: Number(response.txid) };
    },
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original;
      const response = await todosApi.delete(deletedItem.id);
      return { txid: Number(response.txid) };
    },
    getKey: (item) => item.id,
  })
)