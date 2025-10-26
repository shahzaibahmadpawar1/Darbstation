import AssetTable from "../AssetTable";

export default function AssetTableExample() {
  const assets = [
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
  ];

  return (
    <div className="p-8">
      <AssetTable
        assets={assets}
        onEdit={(id) => console.log("Edit asset:", id)}
        onDelete={(id) => console.log("Delete asset:", id)}
      />
    </div>
  );
}
