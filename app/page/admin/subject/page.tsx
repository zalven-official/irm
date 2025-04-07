"use client"
import { useSubjectStore } from "@/store/subject-store"
import { SubjectQueryType } from "@/validator/schema"
import { BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/subject/columns"
import { CreateSubject } from "@/components/subject/create"


export default function SubjectPage() {
  const { subjects, fetchSubjects, total, page, pageSize, totalPages } = useSubjectStore()
  const [searchQuery, setSearchQuery] = useState("")
  useEffect(() => {
    fetchSubjects({
      page: 1,
      pageSize: 10,
      includeUsers: false
    })
  }, [fetchSubjects])

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    fetchSubjects({
      page: newPage,
      pageSize: newPageSize,
      name: searchQuery || undefined,
      includeUsers: false
    })
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    fetchSubjects({
      page: 1,
      pageSize: 10,
      name: value || undefined,
      includeUsers: false
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Subject Management</h1>
      </div>
      <p>Manage subjects and topics here.</p>
      <CreateSubject />
      <DataTable
        columns={columns}
        data={subjects}
        onPaginationChange={handlePaginationChange}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        onSearch={handleSearch}
      />
    </div>
  )
}

