"use client"
import { BookOpen } from "lucide-react"

export default function SubjectPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Subject Management</h1>
      </div>
      <p>Manage subjects and topics here.</p>
    </div>
  )
}

