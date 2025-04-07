import { create } from 'zustand';
import api from '@/lib/api';
import {
  type LoginType,
  type SessionUserType,
  type SessionResponseType,
  SessionResponseSchema,
  ErrorResponseSchema,
  type ErrorResponseType,
} from '@/validator/schema';
import { AxiosError } from 'axios';

interface AuthState {
  currentUser: SessionUserType | null;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  error: string | null;

  // Authentication actions
  login: (credentials: LoginType) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;

  // State management
  resetAuthState: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isLoading: false,
  isLoggingIn: false,
  isLoggingOut: false,
  error: null,

  login: async (credentials) => {
    set({ isLoggingIn: true, error: null });
    try {
      // Call NextAuth credentials provider
      const loginResponse = await api.post('/api/auth/callback/credentials', {
        ...credentials,
        redirect: false,
      });

      if (loginResponse.data.error) {
        throw new Error(loginResponse.data.error);
      }

      // Get session data after successful login
      const sessionResponse = await api.get<SessionResponseType>('/api/auth/session');
      const parsedSession = SessionResponseSchema.parse(sessionResponse.data);

      set({ currentUser: parsedSession.user });
    } catch (err) {
      let errorMessage = 'Login failed';

      // Proper error type checking
      if (err instanceof AxiosError) {
        const errorData = err.response?.data;
        const parsedError = ErrorResponseSchema.safeParse(errorData);
        errorMessage = parsedError.success ? parsedError.data.message : errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      set({ error: errorMessage });

    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true, error: null });
    try {
      await api.post('/api/auth/logout');
      set({ currentUser: null });
    } catch (err) {
      let errorMessage = 'Logout failed';

      if (err instanceof AxiosError) {
        const errorData = err.response?.data;
        const parsedError = ErrorResponseSchema.safeParse(errorData);
        errorMessage = parsedError.success ? parsedError.data.message : errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      set({ error: errorMessage });
      throw new Error(errorMessage);
      throw err;
    } finally {
      set({ isLoggingOut: false });
    }
  },

  checkSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<SessionResponseType>('/api/auth/session');
      const parsedSession = SessionResponseSchema.parse(response.data);
      set({ currentUser: parsedSession.user });
    } catch (err) {
      set({ currentUser: null });
    } finally {
      set({ isLoading: false });
    }
  },

  resetAuthState: () => {
    set({
      currentUser: null,
      isLoading: false,
      isLoggingIn: false,
      isLoggingOut: false,
      error: null,
    });
  },
}));

// Initialize session check on store creation
useAuthStore.getState().checkSession();