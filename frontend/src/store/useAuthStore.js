import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts true until checkAuth is called
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosClient.post('/auth/login', credentials);
      const { token } = response.data;
      
      localStorage.setItem('accessToken', token);
      
      // Fetch user profile immediately after login
      await get().fetchUserProfile();
    } catch (error) {
      set({ error: error.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosClient.post('/auth/register', userData);
      const { token } = response.data;
      
      localStorage.setItem('accessToken', token);
      
      // Fetch user profile immediately after register
      await get().fetchUserProfile();
    } catch (error) {
      set({ error: error.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  googleLogin: async (token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosClient.post('/auth/google', { token });
      const { token: jwt } = response.data;
      
      localStorage.setItem('accessToken', jwt);
      await get().fetchUserProfile();
    } catch (error) {
      set({ error: error.message || 'Google Login failed', isLoading: false });
      throw error;
    }
  },

  fetchUserProfile: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosClient.get('/users/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem('accessToken');
    }
  },

  updateProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosClient.put('/users/me', profileData);
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message || 'Update failed', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null });
      return;
    }
    await get().fetchUserProfile();
  }
}));

export default useAuthStore;

