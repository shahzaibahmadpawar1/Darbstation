import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";

export interface AssetFormData {
  serialNumber: string;
  assetName: string;
  assetNumber: string;
  barcode: string;
  quantity: number;
  units: string;
  remarks?: string;
}

interface AssetFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AssetFormData) => void;
  onScanBarcode: () => void;
  initialData?: AssetFormData;
  title?: string;
}

export default function AssetForm({
  open,
  onClose,
  onSubmit,
  onScanBarcode,
  initialData,
  title = "Add Asset",
}: AssetFormProps) {
  const [formData, setFormData] = useState<AssetFormData>(
    initialData || {
      serialNumber: "",
      assetName: "",
      assetNumber: "",
      barcode: "",
      quantity: 1,
      units: "Units",
      remarks: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field: keyof AssetFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the asset details. Use the camera button to scan barcodes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assetName" className="text-sm font-medium">
                Asset Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="assetName"
                required
                value={formData.assetName}
                onChange={(e) => handleChange("assetName", e.target.value)}
                placeholder="e.g., Fuel Dispenser"
                data-testid="input-asset-name"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetNumber" className="text-sm font-medium">
                Asset Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="assetNumber"
                required
                value={formData.assetNumber}
                onChange={(e) => handleChange("assetNumber", e.target.value)}
                placeholder="e.g., FD-2024-001"
                data-testid="input-asset-number"
                className="h-10 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber" className="text-sm font-medium">
                Serial Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="serialNumber"
                required
                value={formData.serialNumber}
                onChange={(e) => handleChange("serialNumber", e.target.value)}
                placeholder="e.g., SN-001"
                data-testid="input-serial-number"
                className="h-10 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode" className="text-sm font-medium">
                Barcode <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="barcode"
                  required
                  value={formData.barcode}
                  onChange={(e) => handleChange("barcode", e.target.value)}
                  placeholder="e.g., 1234567890123"
                  data-testid="input-barcode"
                  className="h-10 font-mono flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onScanBarcode}
                  data-testid="button-scan-barcode"
                  className="h-10"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)}
                data-testid="input-quantity"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="units" className="text-sm font-medium">
                Units <span className="text-destructive">*</span>
              </Label>
              <Input
                id="units"
                required
                value={formData.units}
                onChange={(e) => handleChange("units", e.target.value)}
                placeholder="e.g., Units, Liters, Pieces"
                data-testid="input-units"
                className="h-10"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="remarks" className="text-sm font-medium">
                Remarks
              </Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                placeholder="Any additional notes..."
                rows={3}
                data-testid="input-remarks"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save-asset">
              Save Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
