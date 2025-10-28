import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AssetTable, { type Asset } from "@/components/AssetTable";
import AssetForm, { type AssetFormData } from "@/components/AssetForm";
import BarcodeScannerModal from "@/components/BarcodeScannerModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PrintAssets from "@/components/PrintAssets";
import { ArrowLeft, Plus, Printer, FileDown } from "lucide-react";

interface AssetsProps {
  pumpId: number;
  pumpName: string;
  pumpLocation?: string;
  pumpManager?: string;
  onBack: () => void;
}

export default function Assets({
  pumpId,
  pumpName,
  pumpLocation = "",
  pumpManager = "",
  onBack,
}: AssetsProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAssetId, setDeletingAssetId] = useState<number | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState("");

  // Fetch helpers
  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/assets/pump/${pumpId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to load assets (${res.status})`);

      const data = await res.json();

      // Map API rows to Asset type if field names differ
      const mapped: Asset[] = (data as any[]).map((row) => ({
        id: row.id,
        serialNumber: row.serial_number,
        assetName: row.asset_name,
        assetNumber: row.asset_number,
        barcode: row.barcode ?? "",
        quantity: row.quantity ?? 0,
        units: row.units ?? "",
        remarks: row.remarks ?? "",
      }));

      setAssets(mapped);
    } catch (e: any) {
      setError(e.message || "Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pumpId]);

  // CRUD handlers
  const handleAddAsset = async (data: AssetFormData) => {
    try {
      setError("");

      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pump_id: pumpId,
          serial_number: data.serialNumber,
          asset_name: data.assetName,
          asset_number: data.assetNumber,
          barcode: data.barcode || null,
          quantity: data.quantity,
          units: data.units,
          remarks: data.remarks || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to add asset");
      await fetchAssets();
    } catch (e: any) {
      setError(e.message || "Failed to add asset");
    }
  };

  const handleEditAsset = (assetId: number) => {
    const asset = assets.find((a) => a.id === assetId);
    if (asset) {
      setEditingAsset(asset);
      setShowAssetForm(true);
    }
  };

  const handleUpdateAsset = async (data: AssetFormData) => {
    if (!editingAsset) return;

    try {
      setError("");

      const res = await fetch(`/api/assets/${editingAsset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          serial_number: data.serialNumber,
          asset_name: data.assetName,
          asset_number: data.assetNumber,
          barcode: data.barcode || null,
          quantity: data.quantity,
          units: data.units,
          remarks: data.remarks || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update asset");
      setEditingAsset(null);
      await fetchAssets();
    } catch (e: any) {
      setError(e.message || "Failed to update asset");
    }
  };

  const handleDeleteAsset = async () => {
    if (!deletingAssetId) return;

    try {
      setError("");

      const res = await fetch(`/api/assets/${deletingAssetId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete asset");
      setDeletingAssetId(null);
      await fetchAssets();
    } catch (e: any) {
      setError(e.message || "Failed to delete asset");
    }
  };

  // Barcode helpers
  const handleScanBarcode = () => setShowScanner(true);

  const handleBarcodeScanned = (barcode: string) => {
    setScannedBarcode(barcode);
    setShowAssetForm(true);
  };

  // Print/export placeholders
  const handlePrint = () => window.print();

  const handleExport = () => {
    alert("Excel export functionality will be implemented in the full version");
  };

  return (
    <div className="min-h-screen bg-white/60 dark:bg-black/40">
      <PrintAssets
        pumpName={pumpName}
        location={pumpLocation}
        manager={pumpManager}
        assets={assets}
      />

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 no-print">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{pumpName}</h1>
            <p className="text-muted-foreground mt-1">Asset Inventory</p>
          </div>
        </div>

        <div className="rounded-lg bg-white/70 dark:bg-black/40 shadow-sm ring-1 ring-black/5 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Assets:{" "}
                <span className="font-semibold text-foreground">
                  {assets.length}
                </span>
              </p>
              {loading && (
                <p className="text-xs text-muted-foreground mt-1">Loading…</p>
              )}
              {!!error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={handlePrint}
                data-testid="button-print-assets"
                className="gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>

              <Button
                variant="outline"
                onClick={handleExport}
                data-testid="button-export-assets"
                className="gap-2"
              >
                <FileDown className="w-4 h-4" />
                Export
              </Button>

              <Button
                onClick={() => {
                  setEditingAsset(null);
                  setScannedBarcode("");
                  setShowAssetForm(true);
                }}
                data-testid="button-add-asset"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </Button>
            </div>
          </div>
        </div>

        {/* Table panel */}
        <div className="rounded-lg bg-white/70 dark:bg-black/40 shadow-md ring-1 ring-black/5 overflow-hidden">
          <AssetTable
            assets={assets}
            onEdit={handleEditAsset}
            onDelete={(id) => setDeletingAssetId(id)}
          />
        </div>
      </div>

      <AssetForm
        open={showAssetForm}
        onClose={() => {
          setShowAssetForm(false);
          setEditingAsset(null);
          setScannedBarcode("");
        }}
        onSubmit={editingAsset ? handleUpdateAsset : handleAddAsset}
        onScanBarcode={handleScanBarcode}
        initialData={
          editingAsset
            ? editingAsset
            : scannedBarcode
            ? {
                barcode: scannedBarcode,
                serialNumber: "",
                assetName: "",
                assetNumber: "",
                quantity: 1,
                units: "Units",
              }
            : undefined
        }
        title={editingAsset ? "Edit Asset" : "Add Asset"}
      />

      <BarcodeScannerModal
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleBarcodeScanned}
      />

      <DeleteConfirmDialog
        open={deletingAssetId !== null}
        onClose={() => setDeletingAssetId(null)}
        onConfirm={handleDeleteAsset}
        title="Delete Asset"
        description="Are you sure you want to delete this asset? This action cannot be undone."
      />
    </div>
  );
}
