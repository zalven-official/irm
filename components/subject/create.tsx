
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FileSpreadsheetIcon, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

export function CreateSubject() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-end w-full items-end space-x-2">
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="h-4 w-4" />
            Add Subject
          </Button>
        </DialogTrigger>
        <Button className="gap-2" variant={'outline'}>
          <FileSpreadsheetIcon className="h-4 w-4" />
          Export
        </Button>
      </div>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Subject</DialogTitle>
          <DialogDescription>Add a new Subject to the system. Fill in the details below.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
} 