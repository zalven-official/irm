"use client"
import { Button } from "@/components/ui/button"
import { PlusIcon, TableIcon, Users } from "lucide-react"


export default function AccountPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Accounts Management</h1>
      </div>
      <p>Manage user accounts here.</p>
      <div className="flex  justify-end items-end w-full space-x-2">
        helo
      </div>
    </div>
  )
}