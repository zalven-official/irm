import { create } from 'zustand';
import {
  type SubjectCreateType,
  type SubjectUpdateType,
  type SubjectResponseType,
  type SubjectPaginatedResponseType,
  type SubjectQueryType,
} from '@/validator/schema';
import api from '@/lib/api';

interface SubjectState {
  subjects: SubjectResponseType[];
  currentSubject: SubjectResponseType | null;
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
  fetchSubjects: (query?: SubjectQueryType) => Promise<void>;

  // Single subject actions
  getSubjectById: (id: number) => Promise<void>;
  createSubject: (subjectData: SubjectCreateType) => Promise<SubjectResponseType>;
  updateSubject: (id: number, subjectData: SubjectUpdateType) => Promise<void>;
  deleteSubject: (id: number) => Promise<void>;

  // State management
  resetSubjectState: () => void;
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
  subjects: [],
  currentSubject: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,

  fetchSubjects: async (query = {
    page: 0,
    pageSize: 0,
    includeUsers: false
  }) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      const { includeUsers, ...restQuery } = query;

      Object.entries(restQuery).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
      if (includeUsers) params.append('includeUsers', 'true');

      const response = await api.get<SubjectPaginatedResponseType>(
        `/subjects?${params.toString()}`
      );

      set({
        subjects: response.data.data,
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

  getSubjectById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<SubjectResponseType>(`/subjects/${id}`);
      set({ currentSubject: response.data });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createSubject: async (subjectData) => {
    set({ isCreating: true, error: null });
    try {
      const response = await api.post<SubjectResponseType>('/subjects', subjectData);
      set((state) => ({
        subjects: [...state.subjects, response.data],
        currentSubject: response.data,
      }));
      return response.data;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isCreating: false });
    }
  },

  updateSubject: async (id, subjectData) => {
    set({ isUpdating: true, error: null });
    try {
      const response = await api.put<SubjectResponseType>(`/subjects/${id}`, subjectData);
      set((state) => ({
        subjects: state.subjects.map((subject) =>
          subject.id === id ? response.data : subject
        ),
        currentSubject: response.data,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteSubject: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      await api.delete(`/subjects/${id}`);
      set((state) => ({
        subjects: state.subjects.filter((subject) => subject.id !== id),
        currentSubject: null,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isDeleting: false });
    }
  },

  resetSubjectState: () => {
    set({
      subjects: [],
      currentSubject: null,
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