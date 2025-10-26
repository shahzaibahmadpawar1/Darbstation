import { useState } from "react";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { Button } from "@/components/ui/button";

export default function DeleteConfirmDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete Item
      </Button>
      <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          console.log("Deleted!");
          setOpen(false);
        }}
        title="Delete Pump Station"
        description="Are you sure you want to delete this pump station? This action cannot be undone and will also delete all associated assets."
      />
    </div>
  );
}
