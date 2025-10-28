import { useEffect, useState } from "react";
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
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [showPumpForm, setShowPumpForm] = useState(false);
  const [editingPump, setEditingPump] = useState<Pump | null>(null);
  const [deletingPumpId, setDeletingPumpId] = useState<number | null>(null);

  // Helper: fetch all pumps
  const fetchPumps = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/pumps", { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to load pumps (${res.status})`);

      const data = await res.json();

      // Shape adapter if your DB columns differ
      const normalized: Pump[] = (data as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        location: p.location,
        manager: p.manager,
        assetCount: p.asset_count ?? 0,
      }));

      setPumps(normalized);
    } catch (e: any) {
      setError(e.message || "Failed to load pumps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPumps();
  }, []);

  // Create
  const handleAddPump = async (data: PumpFormData) => {
    try {
      const res = await fetch("/api/pumps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          location: data.location,
          manager: data.manager,
        }),
      });

      if (!res.ok) throw new Error("Failed to add pump");
      await fetchPumps();
    } catch (e: any) {
      alert(e.message || "Failed to add pump");
    }
  };

  // Edit-open
  const handleEditPump = (pumpId: number) => {
    const pump = pumps.find((p) => p.id === pumpId);
    if (pump) {
      setEditingPump(pump);
      setShowPumpForm(true);
    }
  };

  // Update
  const handleUpdatePump = async (data: PumpFormData) => {
    if (!editingPump) return;

    try {
      const res = await fetch(`/api/pumps/${editingPump.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          location: data.location,
          manager: data.manager,
        }),
      });

      if (!res.ok) throw new Error("Failed to update pump");
      setEditingPump(null);
      await fetchPumps();
    } catch (e: any) {
      alert(e.message || "Failed to update pump");
    }
  };

  // Delete confirm action
  const handleDeletePump = async () => {
    if (!deletingPumpId) return;

    try {
      const res = await fetch(`/api/pumps/${deletingPumpId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete pump");
      setDeletingPumpId(null);
      await fetchPumps();
    } catch (e: any) {
      alert(e.message || "Failed to delete pump");
    }
  };

  // Print/export
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert("Excel export functionality will be implemented in the full version");
  };

  return (
    <div className="min-h-screen bg-white/60 dark:bg-black/40">
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

        {loading ? (
          <div className="text-muted-foreground">Loading pumps…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : pumps.length === 0 ? (
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