import { useState } from "react";
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

export default function Assets({ pumpId, pumpName, pumpLocation = "", pumpManager = "", onBack }: AssetsProps) {
  // todo: remove mock functionality
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 1,
      serialNumber: "SN-001",
      assetName: "Fuel Dispenser",
      assetNumber: "FD-2024-001",
      barcode: "1234567890123",
      quantity: 4,
      units: "Units",
      remarks: "Main dispensers",
    },
    {
      id: 2,
      serialNumber: "SN-002",
      assetName: "Storage Tank",
      assetNumber: "ST-2024-001",
      barcode: "1234567890124",
      quantity: 2,
      units: "Units",
      remarks: "Underground storage",
    },
    {
      id: 3,
      serialNumber: "SN-003",
      assetName: "Fire Extinguisher",
      assetNumber: "FE-2024-001",
      barcode: "1234567890125",
      quantity: 8,
      units: "Units",
    },
  ]);

  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAssetId, setDeletingAssetId] = useState<number | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState("");

  const handleAddAsset = (data: AssetFormData) => {
    // todo: remove mock functionality
    const newAsset: Asset = {
      id: Math.max(...assets.map((a) => a.id), 0) + 1,
      ...data,
    };
    setAssets([...assets, newAsset]);
  };

  const handleEditAsset = (assetId: number) => {
    const asset = assets.find((a) => a.id === assetId);
    if (asset) {
      setEditingAsset(asset);
      setShowAssetForm(true);
    }
  };

  const handleUpdateAsset = (data: AssetFormData) => {
    if (editingAsset) {
      // todo: remove mock functionality
      setAssets(
        assets.map((a) =>
          a.id === editingAsset.id ? { ...a, ...data } : a
        )
      );
      setEditingAsset(null);
    }
  };

  const handleDeleteAsset = () => {
    if (deletingAssetId) {
      // todo: remove mock functionality
      setAssets(assets.filter((a) => a.id !== deletingAssetId));
      setDeletingAssetId(null);
    }
  };

  const handleScanBarcode = () => {
    setShowScanner(true);
  };

  const handleBarcodeScanned = (barcode: string) => {
    setScannedBarcode(barcode);
    setShowAssetForm(true);
  };

  const handlePrint = () => {
    console.log("Print assets list");
    window.print();
  };

  const handleExport = () => {
    // todo: remove mock functionality
    console.log("Export to Excel");
    alert("Excel export functionality will be implemented in the full version");
  };

  return (
    <div className="min-h-screen bg-background">
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Total Assets: <span className="font-semibold text-foreground">{assets.length}</span>
            </p>
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

        <AssetTable
          assets={assets}
          onEdit={handleEditAsset}
          onDelete={(id) => setDeletingAssetId(id)}
        />
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
            ? { barcode: scannedBarcode, serialNumber: "", assetName: "", assetNumber: "", quantity: 1, units: "Units" }
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
