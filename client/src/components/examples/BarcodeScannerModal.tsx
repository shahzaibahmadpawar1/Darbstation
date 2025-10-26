import { useState } from "react";
import BarcodeScannerModal from "../BarcodeScannerModal";
import { Button } from "@/components/ui/button";

export default function BarcodeScannerModalExample() {
  const [open, setOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState("");

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Scanner</Button>
      {scannedCode && (
        <p className="mt-4 text-sm">Last scanned: {scannedCode}</p>
      )}
      <BarcodeScannerModal
        open={open}
        onClose={() => setOpen(false)}
        onScan={(code) => {
          setScannedCode(code);
          console.log("Scanned:", code);
        }}
      />
    </div>
  );
}
