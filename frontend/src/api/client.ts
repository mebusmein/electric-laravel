import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper to get auth headers for Electric shape requests
export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : "";
};

const client = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;

