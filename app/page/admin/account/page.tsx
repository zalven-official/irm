"use client"
import { columns } from "@/components/accounts/columns"
import { DataTable } from "@/components/data-table"
import { useAdminStore } from "@/store/admin-store"
import { PlusIcon, TableIcon, Users } from "lucide-react"
import { useEffect, useState } from "react"


export default function AccountPage() {
  const {
    admins,
    fetchAdmins,
    total,
    page,
    pageSize,
    totalPages
  } = useAdminStore()


  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchAdmins({
      page: 1,
      pageSize: 10,
    })
  }, [fetchAdmins])

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    fetchAdmins({
      page: newPage,
      pageSize: newPageSize,
      firstname: searchQuery || undefined,
      lastname: searchQuery || undefined,
    })
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    fetchAdmins({
      page: 1,
      pageSize: 10,
      firstname: value || undefined,
      lastname: value || undefined,

    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Accounts Management</h1>
      </div>
      <p>Manage user accounts here.</p>
      <DataTable
        columns={columns}
        data={admins}
        onPaginationChange={handlePaginationChange}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        total={total}
        onSearch={handleSearch}
        column={["firstname", "lastname", "email"]}
      />
    </div>
  )
}