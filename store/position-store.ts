// stores/positionStore.ts
import { create } from 'zustand'
import { Position, User } from '@prisma/client'

interface PositionState {
  positions: (Position & { User: User[] })[]
  currentPosition: (Position & { User: User[] }) | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    name?: string
    description?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }

  // Actions
  fetchPositions: (page?: number, limit?: number) => Promise<void>
  getPositionById: (id: number) => Promise<void>
  createPosition: (positionData: { name?: string; description: string }) => Promise<void>
  updatePosition: (id: number, positionData: { name?: string; description?: string }) => Promise<void>
  deletePosition: (id: number) => Promise<void>
  setFilters: (filters: {
    name?: string
    description?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => void
  resetFilters: () => void
  resetState: () => void
}

const usePositionStore = create<PositionState>((set, get) => ({
  positions: [],
  currentPosition: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  },
  filters: {},

  fetchPositions: async (page = 1, limit = 10) => {
    set({ loading: true, error: null })
    try {
      const { filters } = get()
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.name && { name: filters.name }),
        ...(filters.description && { description: filters.description }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
      })

      const response = await fetch(`/api/positions?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch positions')

      const { data, pagination } = await response.json()
      set({
        positions: data,
        pagination,
        loading: false
      })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch positions', loading: false })
    }
  },

  getPositionById: async (id: number) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/positions/${id}`)
      if (!response.ok) throw new Error('Failed to fetch position')
      const position = await response.json()
      set({ currentPosition: position, loading: false })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch position', loading: false })
    }
  },

  createPosition: async (positionData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(positionData)
      })

      if (!response.ok) throw new Error('Failed to create position')

      const newPosition = await response.json()
      set(state => ({
        positions: [...state.positions, newPosition],
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create position', loading: false })
    }
  },

  updatePosition: async (id, positionData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/positions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(positionData)
      })

      if (!response.ok) throw new Error('Failed to update position')

      const updatedPosition = await response.json()
      set(state => ({
        positions: state.positions.map(position =>
          position.id === id ? updatedPosition : position
        ),
        currentPosition: updatedPosition,
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update position', loading: false })
    }
  },

  deletePosition: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/positions/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete position')

      set(state => ({
        positions: state.positions.filter(position => position.id !== id),
        currentPosition: null,
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete position', loading: false })
    }
  },

  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} }),
  resetState: () => set({
    positions: [],
    currentPosition: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    },
    filters: {}
  })
}))

export default usePositionStore