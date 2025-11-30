import client from './client';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from './types';

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/register', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await client.post('/logout');
  },

  getUser: async (): Promise<User> => {
    const response = await client.get<User>('/user');
    return response.data;
  },
};

