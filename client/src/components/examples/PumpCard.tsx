import PumpCard from "../PumpCard";

export default function PumpCardExample() {
  const pump = {
    id: 1,
    name: "Al-Kharj Station",
    location: "Riyadh Road, Al-Kharj",
    manager: "Ahmed Al-Rashid",
    assetCount: 24,
  };

  return (
    <div className="p-8 max-w-sm">
      <PumpCard
        pump={pump}
        onViewAssets={(id) => console.log("View assets for pump:", id)}
        onEdit={(id) => console.log("Edit pump:", id)}
        onDelete={(id) => console.log("Delete pump:", id)}
      />
    </div>
  );
}
