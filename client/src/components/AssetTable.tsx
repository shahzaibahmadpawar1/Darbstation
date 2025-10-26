import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

export interface Asset {
  id: number;
  serialNumber: string;
  assetName: string;
  assetNumber: string;
  barcode: string;
  quantity: number;
  units: string;
  remarks?: string;
}

interface AssetTableProps {
  assets: Asset[];
  onEdit: (assetId: number) => void;
  onDelete: (assetId: number) => void;
}

export default function AssetTable({ assets, onEdit, onDelete }: AssetTableProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No assets found. Click "Add Asset" to get started.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Serial No.</TableHead>
              <TableHead className="font-semibold">Asset Name</TableHead>
              <TableHead className="font-semibold">Asset No.</TableHead>
              <TableHead className="font-semibold">Barcode</TableHead>
              <TableHead className="font-semibold">Quantity</TableHead>
              <TableHead className="font-semibold">Units</TableHead>
              <TableHead className="font-semibold">Remarks</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} data-testid={`row-asset-${asset.id}`}>
                <TableCell className="font-mono text-sm" data-testid={`text-serial-${asset.id}`}>
                  {asset.serialNumber}
                </TableCell>
                <TableCell data-testid={`text-asset-name-${asset.id}`}>
                  {asset.assetName}
                </TableCell>
                <TableCell className="font-mono text-sm" data-testid={`text-asset-number-${asset.id}`}>
                  {asset.assetNumber}
                </TableCell>
                <TableCell className="font-mono text-sm" data-testid={`text-barcode-${asset.id}`}>
                  {asset.barcode}
                </TableCell>
                <TableCell data-testid={`text-quantity-${asset.id}`}>
                  {asset.quantity}
                </TableCell>
                <TableCell data-testid={`text-units-${asset.id}`}>
                  {asset.units}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm" data-testid={`text-remarks-${asset.id}`}>
                  {asset.remarks || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(asset.id)}
                      data-testid={`button-edit-asset-${asset.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(asset.id)}
                      data-testid={`button-delete-asset-${asset.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
