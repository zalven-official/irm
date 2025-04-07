import { create } from 'zustand';
import api from '@/lib/api';
import {
  type AdminCreateType,
  type AdminUpdateType,
  type AdminResponseType,
  type AdminArrayResponseType,
} from '@/validator/schema';

interface AdminState {
  admins: AdminResponseType[];
  currentAdmin: AdminResponseType | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;

  // Admin actions
  fetchAdmins: () => Promise<void>;
  getAdminById: (id: number) => Promise<void>;
  createAdmin: (adminData: AdminCreateType) => Promise<AdminResponseType>;
  updateAdmin: (id: number, adminData: AdminUpdateType) => Promise<void>;
  deleteAdmin: (id: number) => Promise<void>;

  // State management
  resetAdminState: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  admins: [],
  currentAdmin: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,

  fetchAdmins: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<AdminArrayResponseType>('/users/admin');
      set({ admins: response.data });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getAdminById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<AdminResponseType>(`/users/admin/${id}`);
      set({ currentAdmin: response.data });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createAdmin: async (adminData) => {
    set({ isCreating: true, error: null });
    try {
      const response = await api.post<AdminResponseType>('/users/admin', adminData);
      set((state) => ({
        admins: [...state.admins, response.data],
        currentAdmin: response.data,
      }));
      return response.data;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isCreating: false });
    }
  },

  updateAdmin: async (id, adminData) => {
    set({ isUpdating: true, error: null });
    try {
      const response = await api.put<AdminResponseType>(`/users/admin/${id}`, adminData);
      set((state) => ({
        admins: state.admins.map((admin) =>
          admin.id === id ? response.data : admin
        ),
        currentAdmin: response.data,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteAdmin: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      await api.delete(`/users/admin/${id}`);
      set((state) => ({
        admins: state.admins.filter((admin) => admin.id !== id),
        currentAdmin: null,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isDeleting: false });
    }
  },

  resetAdminState: () => {
    set({
      admins: [],
      currentAdmin: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });
  },
}));