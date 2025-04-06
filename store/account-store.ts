import { create } from "zustand"
import { z } from "zod"
import { toast } from "sonner"
import { User } from "@prisma/client"

type CreateAdmin = {
  firstName: string
  lastName: string
  email: string
  password: string
}

type AccountStore = {
  // Create
  createAdmin: (data: CreateAdmin, onSuccess?: () => void) => Promise<void>
  createWorker: (data: User, onSuccess?: () => void) => Promise<void>

  // Login
  loginAdmin: (data: User) => Promise<void>
  loginWorker: (data: User) => Promise<void>

  // Password
  changeAdminPassword: (data: { oldPassword: string; newPassword: string }) => Promise<void>
  changeWorkerPassword: (data: { oldPassword: string; newPassword: string }) => Promise<void>

  // Fetch
  fetchAdmins: () => Promise<User[]>
  fetchWorkers: () => Promise<User[]>

  // Update
  updateAdmin: (id: number, data: Partial<User>) => Promise<void>
  updateWorker: (id: number, data: Partial<User>) => Promise<void>
}


export const useAccountStore = create<AccountStore>(() => ({
  createAdmin: async (data, onSuccess) => {
    try {
      const res = await fetch("/api/create-admin", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      toast.success("Admin created successfully!")
      onSuccess?.()
    } catch (err) {
      toast.error("Failed to create admin.")
    }
  },

  createWorker: async (data, onSuccess) => {
    try {
      const res = await fetch("/api/admin/create-worker", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      toast.success("Worker created successfully!")
      onSuccess?.()
    } catch {
      toast.error("Failed to create worker.")
    }
  },

  loginAdmin: async ({ email, password }) => {
    try {
      const res = await fetch("/api/auth/login-admin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      toast.success("Admin login successful!")
    } catch {
      toast.error("Invalid admin credentials.")
    }
  },

  loginWorker: async ({ email, password }) => {
    try {
      const res = await fetch("/api/auth/login-worker", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      toast.success("Worker login successful!")
    } catch {
      toast.error("Invalid worker credentials.")
    }
  },

  changeAdminPassword: async ({ oldPassword, newPassword }) => {
    try {
      const res = await fetch("/api/admin/change-admin-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword, newPassword }),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      toast.success("Password changed successfully!")
    } catch {
      toast.error("Failed to change password.")
    }
  },

  changeWorkerPassword: async ({ oldPassword, newPassword }) => {
    try {
      const res = await fetch("/api/admin/change-worker-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword, newPassword }),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      toast.success("Password changed successfully!")
    } catch {
      toast.error("Failed to change password.")
    }
  },

  fetchAdmins: async () => {
    try {
      const res = await fetch("/api/admin/fetch-admins")
      if (!res.ok) throw new Error()
      return res.json()
    } catch {
      toast.error("Failed to fetch admins.")
      return []
    }
  },

  fetchWorkers: async () => {
    try {
      const res = await fetch("/api/admin/fetch-workers")
      if (!res.ok) throw new Error()
      return res.json()
    } catch {
      toast.error("Failed to fetch workers.")
      return []
    }
  },

  updateAdmin: async (id, data) => {
    try {
      const res = await fetch(`/api/admin/update-admin/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      toast.success("Admin updated successfully!")
    } catch {
      toast.error("Failed to update admin.")
    }
  },

  updateWorker: async (id, data) => {
    try {
      const res = await fetch(`/api/admin/update-worker/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      toast.success("Worker updated successfully!")
    } catch {
      toast.error("Failed to update worker.")
    }
  },
}))