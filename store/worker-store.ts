import { create } from 'zustand';
import api from '@/lib/api';
import {
  type WorkerCreateType,
  type WorkerUpdateType,
  type WorkerResponseType,
  type WorkerQueryType,
} from '@/validator/schema';

interface WorkerState {
  workers: WorkerResponseType[];
  currentWorker: WorkerResponseType | null;
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
  fetchWorkers: (query?: WorkerQueryType) => Promise<void>;

  // Single worker actions
  getWorkerById: (id: number) => Promise<void>;
  createWorker: (workerData: WorkerCreateType) => Promise<WorkerResponseType>;
  updateWorker: (id: number, workerData: WorkerUpdateType) => Promise<void>;
  deleteWorker: (id: number) => Promise<void>;

  // State management
  resetWorkerState: () => void;
}

export const useWorkerStore = create<WorkerState>((set, get) => ({
  workers: [],
  currentWorker: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,

  fetchWorkers: async (query = {
    page: 0,
    pageSize: 0
  }) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();

      // Convert query object to URL params
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });

      const response = await api.get<{
        data: WorkerResponseType[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      }>(`/users/workers?${params.toString()}`);

      set({
        workers: response.data.data,
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

  getWorkerById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<WorkerResponseType>(`/users/workers/${id}`);
      set({ currentWorker: response.data });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createWorker: async (workerData) => {
    set({ isCreating: true, error: null });
    try {
      const response = await api.post<WorkerResponseType>('/users/workers', workerData);
      set((state) => ({
        workers: [...state.workers, response.data],
        currentWorker: response.data,
      }));
      return response.data;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isCreating: false });
    }
  },

  updateWorker: async (id, workerData) => {
    set({ isUpdating: true, error: null });
    try {
      const response = await api.put<WorkerResponseType>(`/users/workers/${id}`, workerData);
      set((state) => ({
        workers: state.workers.map((worker) =>
          worker.id === id ? response.data : worker
        ),
        currentWorker: response.data,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteWorker: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      await api.delete(`/users/workers/${id}`);
      set((state) => ({
        workers: state.workers.filter((worker) => worker.id !== id),
        currentWorker: null,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isDeleting: false });
    }
  },

  resetWorkerState: () => {
    set({
      workers: [],
      currentWorker: null,
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