// stores/subjectStore.ts
import { create } from 'zustand'
import { Subject, User } from '@prisma/client'

interface SubjectState {
  subjects: (Subject & { User: User | null })[]
  currentSubject: (Subject & { User: User | null }) | null
  loading: boolean
  error: string | null
  total: number
  filters: {
    name?: string
    description?: string
    disabled?: boolean
    userId?: number
  }

  // Actions
  fetchSubjects: () => Promise<void>
  getSubjectById: (id: number) => Promise<void>
  createSubject: (subjectData: {
    name?: string
    description: string
    disabled?: boolean
    userId?: number
  }) => Promise<void>
  updateSubject: (
    id: number,
    subjectData: {
      name?: string
      description?: string
      disabled?: boolean
      userId?: number | null
    }
  ) => Promise<void>
  deleteSubject: (id: number) => Promise<void>
  setFilters: (filters: {
    name?: string
    description?: string
    disabled?: boolean
    userId?: number
  }) => void
  resetFilters: () => void
  resetState: () => void
}

const useSubjectStore = create<SubjectState>((set, get) => ({
  subjects: [],
  currentSubject: null,
  loading: false,
  error: null,
  total: 0,
  filters: {},

  fetchSubjects: async () => {
    set({ loading: true, error: null })
    try {
      const { filters } = get()
      const queryParams = new URLSearchParams({
        ...(filters.name && { name: filters.name }),
        ...(filters.description && { description: filters.description }),
        ...(filters.disabled !== undefined && { disabled: String(filters.disabled) }),
        ...(filters.userId && { userId: String(filters.userId) }),
      })

      const response = await fetch(`/api/subjects?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch subjects')

      const { data, total } = await response.json()
      set({
        subjects: data,
        total,
        loading: false
      })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch subjects', loading: false })
    }
  },

  getSubjectById: async (id: number) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/subjects/${id}`)
      if (!response.ok) throw new Error('Failed to fetch subject')
      const subject = await response.json()
      set({ currentSubject: subject, loading: false })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch subject', loading: false })
    }
  },

  createSubject: async (subjectData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectData)
      })

      if (!response.ok) throw new Error('Failed to create subject')

      const newSubject = await response.json()
      set(state => ({
        subjects: [...state.subjects, newSubject],
        total: state.total + 1,
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create subject', loading: false })
    }
  },

  updateSubject: async (id, subjectData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectData)
      })

      if (!response.ok) throw new Error('Failed to update subject')

      const updatedSubject = await response.json()
      set(state => ({
        subjects: state.subjects.map(subject =>
          subject.id === id ? updatedSubject : subject
        ),
        currentSubject: updatedSubject,
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update subject', loading: false })
    }
  },

  deleteSubject: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/subjects/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete subject')

      set(state => ({
        subjects: state.subjects.filter(subject => subject.id !== id),
        total: state.total - 1,
        currentSubject: null,
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete subject', loading: false })
    }
  },

  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} }),
  resetState: () => set({
    subjects: [],
    currentSubject: null,
    loading: false,
    error: null,
    total: 0,
    filters: {}
  })
}))

export default useSubjectStore