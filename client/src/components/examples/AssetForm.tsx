import { useState } from "react";
import AssetForm from "../AssetForm";
import { Button } from "@/components/ui/button";

export default function AssetFormExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Asset Form</Button>
      <AssetForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => console.log("Asset data submitted:", data)}
        onScanBarcode={() => console.log("Scan barcode clicked")}
      />
    </div>
  );
}
