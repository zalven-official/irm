"use client"
import { Church } from "lucide-react"
import { useEffect, useState } from "react"
import { useChurchStore } from "@/store/church-store"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/churches/columns"

export default function ChurchPage() {
  const { church, fetchchurch, total, page, pageSize, totalPages } = useChurchStore()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchchurch({
      page: 1,
      pageSize: 10,
    })
  }, [fetchchurch])

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    fetchchurch({
      page: newPage,
      pageSize: newPageSize,
      address: searchQuery || undefined,
    })
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    fetchchurch({
      page: 1,
      pageSize: 10,
      address: value || undefined,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Church className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Church Management</h1>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={church}
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