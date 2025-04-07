import { create } from 'zustand';
import {
  type PositionCreateType,
  type PositionUpdateType,
  type PositionResponseType,
  type PositionPaginatedResponseType,
  type PositionQueryType,
} from '@/validator/schema';
import api from '@/lib/api';

interface PositionState {
  positions: PositionResponseType[];
  currentPosition: PositionResponseType | null;
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
  fetchPositions: (query?: PositionQueryType) => Promise<void>;

  // Single position actions
  getPositionById: (id: number) => Promise<void>;
  createPosition: (positionData: PositionCreateType) => Promise<PositionResponseType>;
  updatePosition: (id: number, positionData: PositionUpdateType) => Promise<void>;
  deletePosition: (id: number) => Promise<void>;

  // State management
  resetPositionState: () => void;
}

export const usePositionStore = create<PositionState>((set, get) => ({
  positions: [],
  currentPosition: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,

  fetchPositions: async (query = {
    page: 0,
    pageSize: 0,
    includeUsers: false
  }) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      const { includeUsers, ...restQuery } = query;

      // Convert query object to URL params
      Object.entries(restQuery).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
      if (includeUsers) params.append('includeUsers', 'true');

      const response = await api.get<PositionPaginatedResponseType>(
        `/positions?${params.toString()}`
      );

      set({
        positions: response.data.data,
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

  getPositionById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<PositionResponseType>(`/positions/${id}`);
      set({ currentPosition: response.data });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createPosition: async (positionData) => {
    set({ isCreating: true, error: null });
    try {
      const response = await api.post<PositionResponseType>('/positions', positionData);
      set((state) => ({
        positions: [...state.positions, response.data],
        currentPosition: response.data,
      }));
      return response.data;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isCreating: false });
    }
  },

  updatePosition: async (id, positionData) => {
    set({ isUpdating: true, error: null });
    try {
      const response = await api.put<PositionResponseType>(`/positions/${id}`, positionData);
      set((state) => ({
        positions: state.positions.map((position) =>
          position.id === id ? response.data : position
        ),
        currentPosition: response.data,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isUpdating: false });
    }
  },

  deletePosition: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      await api.delete(`/positions/${id}`);
      set((state) => ({
        positions: state.positions.filter((position) => position.id !== id),
        currentPosition: null,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isDeleting: false });
    }
  },

  resetPositionState: () => {
    set({
      positions: [],
      currentPosition: null,
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