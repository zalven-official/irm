"use client"
import { Church } from "lucide-react"

export default function ChurchPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Church className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Church Management</h1>
      </div>
      <p>Manage church information and events here.</p>
    </div>
  )
}

