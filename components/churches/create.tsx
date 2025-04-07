
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

export function CreateChurch() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Church
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Church</DialogTitle>
          <DialogDescription>Add a new Church to the system. Fill in the details below.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
} 