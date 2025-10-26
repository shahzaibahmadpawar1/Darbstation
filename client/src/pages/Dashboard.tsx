import { useState } from "react";
import { Button } from "@/components/ui/button";
import PumpCard, { type Pump } from "@/components/PumpCard";
import PumpForm, { type PumpFormData } from "@/components/PumpForm";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PrintPumps from "@/components/PrintPumps";
import { Plus, Printer, FileDown } from "lucide-react";

interface DashboardProps {
  onViewAssets: (pumpId: number) => void;
}

export default function Dashboard({ onViewAssets }: DashboardProps) {
  // todo: remove mock functionality
  const [pumps, setPumps] = useState<Pump[]>([
    {
      id: 1,
      name: "Al-Kharj Station",
      location: "Riyadh Road, Al-Kharj",
      manager: "Ahmed Al-Rashid",
      assetCount: 24,
    },
    {
      id: 2,
      name: "Qiddiya Station",
      location: "Tuwaiq Road, Qiddiya",
      manager: "Mohammed Al-Saud",
      assetCount: 18,
    },
    {
      id: 3,
      name: "Umrah District Station",
      location: "Makkah, Umrah District",
      manager: "Khalid Al-Harbi",
      assetCount: 32,
    },
  ]);

  const [showPumpForm, setShowPumpForm] = useState(false);
  const [editingPump, setEditingPump] = useState<Pump | null>(null);
  const [deletingPumpId, setDeletingPumpId] = useState<number | null>(null);

  const handleAddPump = (data: PumpFormData) => {
    // todo: remove mock functionality
    const newPump: Pump = {
      id: Math.max(...pumps.map((p) => p.id), 0) + 1,
      name: data.name,
      location: data.location,
      manager: data.manager,
      assetCount: 0,
    };
    setPumps([...pumps, newPump]);
  };

  const handleEditPump = (pumpId: number) => {
    const pump = pumps.find((p) => p.id === pumpId);
    if (pump) {
      setEditingPump(pump);
      setShowPumpForm(true);
    }
  };

  const handleUpdatePump = (data: PumpFormData) => {
    if (editingPump) {
      // todo: remove mock functionality
      setPumps(
        pumps.map((p) =>
          p.id === editingPump.id
            ? { ...p, name: data.name, location: data.location, manager: data.manager }
            : p
        )
      );
      setEditingPump(null);
    }
  };

  const handleDeletePump = () => {
    if (deletingPumpId) {
      // todo: remove mock functionality
      setPumps(pumps.filter((p) => p.id !== deletingPumpId));
      setDeletingPumpId(null);
    }
  };

  const handlePrint = () => {
    console.log("Print pumps list");
    window.print();
  };

  const handleExport = () => {
    // todo: remove mock functionality
    console.log("Export to Excel");
    alert("Excel export functionality will be implemented in the full version");
  };

  return (
    <div className="min-h-screen bg-background">
      <PrintPumps pumps={pumps} />
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 no-print">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Petrol Pump Stations</h1>
            <p className="text-muted-foreground mt-1">
              Manage your petrol pump stations and their assets
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={handlePrint}
              data-testid="button-print-pumps"
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              data-testid="button-export-pumps"
              className="gap-2"
            >
              <FileDown className="w-4 h-4" />
              Export
            </Button>
            <Button
              onClick={() => {
                setEditingPump(null);
                setShowPumpForm(true);
              }}
              data-testid="button-add-pump"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Pump
            </Button>
          </div>
        </div>

        {pumps.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No petrol pumps added yet. Click "Add Pump" to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pumps.map((pump) => (
              <PumpCard
                key={pump.id}
                pump={pump}
                onViewAssets={onViewAssets}
                onEdit={handleEditPump}
                onDelete={(id) => setDeletingPumpId(id)}
              />
            ))}
          </div>
        )}
      </div>

      <PumpForm
        open={showPumpForm}
        onClose={() => {
          setShowPumpForm(false);
          setEditingPump(null);
        }}
        onSubmit={editingPump ? handleUpdatePump : handleAddPump}
        initialData={
          editingPump
            ? {
                name: editingPump.name,
                location: editingPump.location,
                manager: editingPump.manager,
              }
            : undefined
        }
        title={editingPump ? "Edit Petrol Pump" : "Add Petrol Pump"}
      />

      <DeleteConfirmDialog
        open={deletingPumpId !== null}
        onClose={() => setDeletingPumpId(null)}
        onConfirm={handleDeletePump}
        title="Delete Pump Station"
        description="Are you sure you want to delete this pump station? This action cannot be undone and will also delete all associated assets."
      />
    </div>
  );
}
