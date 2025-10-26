import { Asset } from "@/components/AssetTable";

interface PrintAssetsProps {
  pumpName: string;
  location: string;
  manager: string;
  assets: Asset[];
}

export default function PrintAssets({ pumpName, location, manager, assets }: PrintAssetsProps) {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="hidden print-only print:block">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-sm text-muted-foreground">{currentDate}, {currentTime}</div>
          <div className="text-sm text-muted-foreground">Petrol Pump Details</div>
        </div>

        {/* Pump Details */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{pumpName}</h1>
          <div className="space-y-1 text-sm">
            <div><span className="font-semibold">Location:</span> {location}</div>
            <div><span className="font-semibold">Manager:</span> {manager}</div>
          </div>
        </div>

        {/* Asset Register Title */}
        <h2 className="text-xl font-bold mb-4">Asset Register</h2>

        {/* Assets Table */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-foreground">
              <th className="text-left py-2 px-2 font-semibold">#</th>
              <th className="text-left py-2 px-2 font-semibold">Serial Number</th>
              <th className="text-left py-2 px-2 font-semibold">Barcode</th>
              <th className="text-left py-2 px-2 font-semibold">Asset Number</th>
              <th className="text-left py-2 px-2 font-semibold">Asset Name</th>
              <th className="text-left py-2 px-2 font-semibold">Quantity</th>
              <th className="text-left py-2 px-2 font-semibold">Unit</th>
              <th className="text-left py-2 px-2 font-semibold">Remarks</th>
              <th className="text-left py-2 px-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={asset.id} className="border-b border-border">
                <td className="py-2 px-2">{index + 1}</td>
                <td className="py-2 px-2 font-mono">{asset.serialNumber}</td>
                <td className="py-2 px-2 font-mono">{asset.barcode}</td>
                <td className="py-2 px-2 font-mono">{asset.assetNumber}</td>
                <td className="py-2 px-2">{asset.assetName}</td>
                <td className="py-2 px-2">{asset.quantity}</td>
                <td className="py-2 px-2">{asset.units}</td>
                <td className="py-2 px-2">{asset.remarks || ""}</td>
                <td className="py-2 px-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-8 text-xs text-muted-foreground text-center">
          Page 1/1
        </div>
      </div>
    </div>
  );
}
