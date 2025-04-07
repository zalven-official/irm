import { create } from 'zustand';
import {
  type ChurchCreateType,
  type ChurchUpdateType,
  type ChurchResponseType,
  type ChurchPaginatedResponseType,
  type ChurchQueryType,
} from '@/validator/schema';
import api from '@/lib/api';

interface ChurchState {
  church: ChurchResponseType[];
  currentChurch: ChurchResponseType | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;

  // Paginated fetch
  fetchchurch: (query?: ChurchQueryType) => Promise<void>;

  // Single church actions
  getChurchById: (id: number) => Promise<void>;
  createChurch: (churchData: ChurchCreateType) => Promise<ChurchResponseType>;
  updateChurch: (id: number, churchData: ChurchUpdateType) => Promise<void>;
  deleteChurch: (id: number) => Promise<void>;

  // State management
  resetChurchState: () => void;
}

export const useChurchStore = create<ChurchState>((set, get) => ({
  church: [],
  currentChurch: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,

  fetchchurch: async (query = {
    page: 0,
    pageSize: 0
  }) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });

      const response = await api.get<ChurchPaginatedResponseType>(
        `/church?${params.toString()}`
      );

      set({
        church: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getChurchById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ChurchResponseType>(`/church/${id}`);
      set({ currentChurch: response.data });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createChurch: async (churchData) => {
    set({ isCreating: true, error: null });
    try {
      const response = await api.post<ChurchResponseType>('/church', churchData);
      set((state) => ({
        church: [...state.church, response.data],
        currentChurch: response.data,
      }));
      return response.data;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isCreating: false });
    }
  },

  updateChurch: async (id, churchData) => {
    set({ isUpdating: true, error: null });
    try {
      const response = await api.put<ChurchResponseType>(`/church/${id}`, churchData);
      set((state) => ({
        church: state.church.map((church) =>
          church.id === id ? response.data : church
        ),
        currentChurch: response.data,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteChurch: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      await api.delete(`/church/${id}`);
      set((state) => ({
        church: state.church.filter((church) => church.id !== id),
        currentChurch: null,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isDeleting: false });
    }
  },

  resetChurchState: () => {
    set({
      church: [],
      currentChurch: null,
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