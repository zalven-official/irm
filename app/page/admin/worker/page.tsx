"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import { useWorkerStore } from "@/store/worker-store"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/workers/columns"
import { CreateWorker } from "@/components/workers/create"

export default function WorkerPage() {
  const {
    workers,
    fetchWorkers,
    total,
    page,
    pageSize,
    totalPages
  } = useWorkerStore()

  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchWorkers({
      page: 1,
      pageSize: 10,
    })
  }, [fetchWorkers])

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    fetchWorkers({
      page: newPage,
      pageSize: newPageSize,
      firstname: searchQuery || undefined,
      lastname: searchQuery || undefined,
    })
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    fetchWorkers({
      page: 1,
      pageSize: 10,
      firstname: value || undefined,
      lastname: value || undefined,

    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Worker Management</h1>
        </div>
      </div>

      <CreateWorker />

      <DataTable
        columns={columns}
        data={workers}
        onPaginationChange={handlePaginationChange}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        total={total}
        onSearch={handleSearch}
        column={["firstname", "lastname", "middlename"]}
      />
    </div>
  )
}
