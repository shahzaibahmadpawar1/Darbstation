import { useState } from "react";
import PumpForm from "../PumpForm";
import { Button } from "@/components/ui/button";

export default function PumpFormExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Pump Form</Button>
      <PumpForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => console.log("Pump data submitted:", data)}
      />
    </div>
  );
}
