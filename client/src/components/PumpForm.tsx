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

export interface PumpFormData {
  name: string;
  location: string;
  manager: string;
  contactNumber?: string;
  details?: string;
}

interface PumpFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PumpFormData) => void;
  initialData?: PumpFormData;
  title?: string;
}

export default function PumpForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Add Petrol Pump",
}: PumpFormProps) {
  const [formData, setFormData] = useState<PumpFormData>(
    initialData || {
      name: "",
      location: "",
      manager: "",
      contactNumber: "",
      details: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field: keyof PumpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for the petrol pump station
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Pump Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Al-Kharj Station"
                data-testid="input-pump-name"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g., Riyadh Road"
                data-testid="input-location"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager" className="text-sm font-medium">
                Manager Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="manager"
                required
                value={formData.manager}
                onChange={(e) => handleChange("manager", e.target.value)}
                placeholder="e.g., Ahmed Al-Rashid"
                data-testid="input-manager"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber" className="text-sm font-medium">
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
                placeholder="e.g., +966 50 123 4567"
                data-testid="input-contact"
                className="h-10"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="details" className="text-sm font-medium">
                Additional Details
              </Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => handleChange("details", e.target.value)}
                placeholder="Any additional information..."
                rows={3}
                data-testid="input-details"
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
            <Button type="submit" data-testid="button-save-pump">
              Save Pump
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
