"use client"

import { columns } from "@/components/positions/columns"
import { DataTable } from "@/components/data-table"
import { usePositionStore } from "@/store/position-store"
import { Briefcase } from "lucide-react"
import { useEffect, useState } from "react"
import { CreatePosition } from "@/components/positions/create"

export default function PositionsPage() {

  const { positions, fetchPositions, total, page, pageSize, totalPages } = usePositionStore()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchPositions({
      page: 1,
      pageSize: 10,
      includeUsers: true,
    })
  }, [fetchPositions])

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    fetchPositions({
      page: newPage,
      pageSize: newPageSize,
      name: searchQuery || undefined,
      includeUsers: true,
    })
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    fetchPositions({
      page: 1,
      pageSize: 10,
      name: value || undefined,
      includeUsers: true,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Briefcase className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Positions for Ministers</h1>
      </div>
      <p>Manage and assign ministerial positions within our church community here.</p>
      <CreatePosition />
      <DataTable
        columns={columns}
        data={positions.map(position => ({ disabled: false, ...position }))}
        onPaginationChange={handlePaginationChange}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        total={total}
        onSearch={handleSearch}
        column="address"
      />
    </div>
  )
}
