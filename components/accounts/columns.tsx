import { ColumnDef } from "@tanstack/react-table"
import { WorkerResponseType } from "@/validator/schema"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export const columns: ColumnDef<WorkerResponseType>[] = [
  {
    accessorKey: "profilePicture",
    header: "Avatar",
    cell: ({ row }) => {
      const name = row.original.firstname || ""
      const initials = name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()

      return (
        <Avatar>
          <AvatarImage src={row.original.profilePicture} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      return row.getValue("isActive") ? "Yes" : "No"
    },
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
