"use client"
import { Briefcase } from "lucide-react"


export default function WorkerPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Briefcase className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Work Management</h1>
      </div>
      <p>Manage workers and assignments here.</p>
    </div>
  )
}