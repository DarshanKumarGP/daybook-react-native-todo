import { apiClient } from './client';
import { NewTaskInput, Task } from '../types';

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const { data } = await apiClient.get<Task[]>('/tasks');
    return data;
  },

  create: async (input: NewTaskInput): Promise<Task> => {
    const { data } = await apiClient.post<Task>('/tasks', input);
    return data;
  },

  update: async (id: string, input: Partial<NewTaskInput>): Promise<Task> => {
    const { data } = await apiClient.put<Task>(`/tasks/${id}`, input);
    return data;
  },

  toggleComplete: async (id: string): Promise<Task> => {
    const { data } = await apiClient.patch<Task>(`/tasks/${id}/complete`);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
