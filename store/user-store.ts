// stores/userStore.ts
import { create } from 'zustand'
import { User, Church, Position, UserChildren, UserEducationalAttainment, UserCase, Subject, UserRoles } from '@prisma/client'
import argon2 from 'argon2'

interface AuthUser extends Omit<User, 'password'> {
  church?: Church | null
  position?: Position | null
  children?: UserChildren[]
  eudcationalAttainment?: UserEducationalAttainment[]
  cases?: UserCase[]
  subject?: Subject[]
}

interface UserState {
  currentUser: AuthUser | null
  users: AuthUser[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    role?: UserRoles
    search?: string
    churchId?: number
    positionId?: number
  }

  // Authentication Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void

  // User Management Actions
  fetchUsers: (page?: number, limit?: number) => Promise<void>
  getUserById: (id: number) => Promise<void>
  createAdmin: (data: { email: string; password: string; firstname: string; lastname: string }) => Promise<void>
  createWorker: (data: {
    email: string
    password: string
    firstname: string
    lastname: string
    churchId: number
    positionId: number
    status: string
    birthday: Date
    children?: UserChildren[]
    educationalAttainment?: UserEducationalAttainment[]
    cases?: UserCase[]
    subjects?: Subject[]
  }) => Promise<void>
  updateUser: (id: number, data: Partial<User> & {
    churchId?: number
    positionId?: number
    children?: UserChildren[]
    educationalAttainment?: UserEducationalAttainment[]
    cases?: UserCase[]
    subjects?: Subject[]
  }) => Promise<void>
  deleteUser: (id: number) => Promise<void>

  // Filter Actions
  setFilters: (filters: { role?: UserRoles; search?: string; churchId?: number; positionId?: number }) => void
  resetFilters: () => void
  resetState: () => void
}

const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  users: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  },
  filters: {},

  // Authentication
  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) throw new Error('Login failed')

      const user = await response.json()
      set({ currentUser: user, loading: false })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Login failed', loading: false })
    }
  },

  logout: () => {
    set({ currentUser: null })
    // Add API call to /api/users/logout if needed
  },

  // User Management
  fetchUsers: async (page = 1, limit = 10) => {
    set({ loading: true, error: null })
    try {
      const { filters } = get()
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      })

      const response = await fetch(`/api/users?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch users')

      const { data, pagination } = await response.json()
      set({ users: data, pagination, loading: false })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch users', loading: false })
    }
  },

  createAdmin: async (data) => {
    set({ loading: true, error: null })
    try {
      const hashedPassword = await argon2.hash(data.password)
      const response = await fetch('/api/users/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, password: hashedPassword })
      })

      if (!response.ok) throw new Error('Failed to create admin')

      const newAdmin = await response.json()
      set(state => ({
        users: [...state.users, newAdmin],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create admin', loading: false })
    }
  },

  createWorker: async (data) => {
    set({ loading: true, error: null })
    try {
      const hashedPassword = await argon2.hash(data.password)
      const response = await fetch('/api/users/worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, password: hashedPassword })
      })

      if (!response.ok) throw new Error('Failed to create worker')

      const newWorker = await response.json()
      set(state => ({
        users: [...state.users, newWorker],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create worker', loading: false })
    }
  },

  updateUser: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to update user')

      const updatedUser = await response.json()
      set(state => ({
        users: state.users.map(user =>
          user.id === id ? { ...user, ...updatedUser } : user
        ),
        currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update user', loading: false })
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete user')

      set(state => ({
        users: state.users.filter(user => user.id !== id),
        pagination: { ...state.pagination, total: state.pagination.total - 1 },
        loading: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete user', loading: false })
    }
  },

  // Filtering
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} }),
  resetState: () => set({
    currentUser: null,
    users: [],
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

export default useUserStore