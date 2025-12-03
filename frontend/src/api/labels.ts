import { createCollection } from '@tanstack/react-db';
import client, { API_URL, getAuthToken } from './client';
import type { CreateLabelData, Label, UpdateLabelData } from './types';
import { electricCollectionOptions } from '@tanstack/electric-db-collection';
import z from 'zod/v4';

export const labelsApi = {
  getAll: async (): Promise<Label[]> => {
    const response = await client.get<Label[]>('/labels');
    return response.data;
  },

  get: async (id: number): Promise<Label> => {
    const response = await client.get<Label>(`/labels/${id}`);
    return response.data;
  },

  create: async (data: CreateLabelData): Promise<{ label: Label; txid: string }> => {
    const response = await client.post<{ label: Label; txid: string }>('/labels', data);
    return response.data;
  },

  update: async (id: number, data: UpdateLabelData): Promise<{ label: Label; txid: string }> => {
    const response = await client.put<{ label: Label; txid: string }>(`/labels/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ txid: string }> => {
    const response = await client.delete<{ txid: string }>(`/labels/${id}`);
    return response.data;
  },
};

const labelShape = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  color: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const labelsCollection = createCollection(
  electricCollectionOptions({
    id: 'labels',
    schema: labelShape,
    shapeOptions: {
      url: `${API_URL}/api/shape/labels`,
      headers: {
        Authorization: getAuthToken,
      },
    },
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified;
      const response = await labelsApi.create({
        name: newItem.name,
        color: newItem.color,
      });
      return { txid: Number(response.txid) };
    },
    onUpdate: async ({ transaction }) => {
      const updatedItem = transaction.mutations[0].modified;
      const response = await labelsApi.update(updatedItem.id, {
        name: updatedItem.name,
        color: updatedItem.color,
      });
      return { txid: Number(response.txid) };
    },
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original;
      const response = await labelsApi.delete(deletedItem.id);
      return { txid: Number(response.txid) };
    },
    getKey: (item) => item.id,
  })
)

const todoLabelShape = z.object({
  label_id: z.number(),
  todo_id: z.number(),
});

export const todoLabelsCollection = createCollection(
  electricCollectionOptions({
    id: 'todo-labels',
    schema: todoLabelShape,
    shapeOptions: {
      url: `${API_URL}/api/shape/todo-labels`,
      headers: {
        Authorization: getAuthToken,
      },
    },
    getKey: (item) => `${item.label_id}-${item.todo_id}`,
  })
)