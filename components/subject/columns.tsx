import { ColumnDef } from "@tanstack/react-table"
import { SubjectResponseType } from "@/validator/schema"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<SubjectResponseType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "disabled",
    header: "Status",
    cell: ({ row }) => (
      <div className={`${row.getValue("disabled") ? "text-red-500" : "text-green-500"}`}>
        {row.getValue("disabled") ? "Disabled" : "Active"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    },
  },
]