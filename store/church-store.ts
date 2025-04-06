// stores/churchStore.ts
import { create } from 'zustand'
import { Church, ChurchImage } from '@prisma/client'

interface ChurchState {
  churches: (Church & { images: ChurchImage[] })[]
  currentChurch: (Church & { images: ChurchImage[] }) | null
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  filters: {
    address?: string
    latitudeFrom?: number
    latitudeTo?: number
    longitudeFrom?: number
    longitudeTo?: number
  }

  // Actions
  fetchChurches: (page?: number, limit?: number) => Promise<void>
  getChurchById: (id: number) => Promise<void>
  createChurch: (churchData: {
    address: string
    latitude: number
    longitude: number
    images?: string[]
  }) => Promise<void>
  updateChurch: (
    id: number,
    churchData: {
      address?: string
      latitude?: number
      longitude?: number
      images?: string[]
    }
  ) => Promise<void>
  deleteChurch: (id: number) => Promise<void>
  setCurrentChurch: (church: (Church & { images: ChurchImage[] }) | null) => void
  setFilters: (filters: {
    address?: string
    latitudeFrom?: number
    latitudeTo?: number
    longitudeFrom?: number
    longitudeTo?: number
  }) => void
  resetFilters: () => void
  resetState: () => void
}

const useChurchStore = create<ChurchState>((set, get) => ({
  churches: [],
  currentChurch: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  filters: {},

  fetchChurches: async (page = 1, limit = 10) => {
    set({ loading: true, error: null })
    try {
      const { filters } = get()
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.address && { address: filters.address }),
        ...(filters.latitudeFrom && { latitudeFrom: filters.latitudeFrom.toString() }),
        ...(filters.latitudeTo && { latitudeTo: filters.latitudeTo.toString() }),
        ...(filters.longitudeFrom && { longitudeFrom: filters.longitudeFrom.toString() }),
        ...(filters.longitudeTo && { longitudeTo: filters.longitudeTo.toString() }),
      })

      const response = await fetch(`/api/churches?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch churches')

      const { data, pagination } = await response.json()
      set({
        churches: data,
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        loading: false
      })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch churches', loading: false })
    }
  },

  getChurchById: async (id: number) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/churches/${id}`)
      if (!response.ok) throw new Error('Failed to fetch church')
      const church = await response.json()
      set({ currentChurch: church, loading: false })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch church', loading: false })
    }
  },

  createChurch: async (churchData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/churches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(churchData)
      })

      if (!response.ok) throw new Error('Failed to create church')

      const newChurch = await response.json()
      set(state => ({
        churches: [...state.churches, newChurch],
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create church', loading: false })
    }
  },

  updateChurch: async (id, churchData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/churches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(churchData)
      })

      if (!response.ok) throw new Error('Failed to update church')

      const updatedChurch = await response.json()
      set(state => ({
        churches: state.churches.map(church =>
          church.id === id ? updatedChurch : church
        ),
        currentChurch: updatedChurch,
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update church', loading: false })
    }
  },

  deleteChurch: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/churches/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete church')

      set(state => ({
        churches: state.churches.filter(church => church.id !== id),
        currentChurch: null,
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete church', loading: false })
    }
  },

  setCurrentChurch: (church) => set({ currentChurch: church }),
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} }),
  resetState: () => set({
    churches: [],
    currentChurch: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    filters: {}
  })
}))

export default useChurchStore