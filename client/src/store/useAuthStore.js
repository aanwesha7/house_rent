import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Signup
      signup: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.signup(userData);
          
          if (response.success) {
            const { data } = response;
            localStorage.setItem('authToken', data.token);
            set({
              user: data,
              token: data.token,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            return data;
          } else {
            throw new Error(response.message || 'Signup failed');
          }
        } catch (error) {
          const errorMessage = error.message || 'Signup failed';
          set({ loading: false, error: errorMessage });
          throw error;
        }
      },

      // Login
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await api.login(credentials);
          
          if (response.success) {
            const { data } = response;
            localStorage.setItem('authToken', data.token);
            set({
              user: data,
              token: data.token,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            return data;
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          const errorMessage = error.message || 'Login failed';
          set({ loading: false, error: errorMessage });
          throw error;
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('authToken');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      // Get Profile
      getProfile: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.getProfile();
          
          if (response.success) {
            set({
              user: response.data,
              isAuthenticated: true,
              loading: false,
            });
            return response.data;
          }
        } catch (error) {
          set({ loading: false, error: error.message });
          // If token is invalid, logout
          if (error.message.includes('authorized') || error.message.includes('token')) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
            localStorage.removeItem('authToken');
          }
          throw error;
        }
      },

      // Clear Error
      clearError: () => set({ error: null }),

      // Set Loading
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
