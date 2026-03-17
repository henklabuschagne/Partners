import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Contract } from '../types';
import { Loader2, RefreshCw } from 'lucide-react';

interface RenewContractDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (overrides: Partial<Omit<Contract, 'id' | 'renewedFromId'>>) => void;
  contract: Contract | null;
  saving?: boolean;
}

export function RenewContractDialog({ open, onClose, onSubmit, contract, saving }: RenewContractDialogProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    implementationFee: 0,
    licenseFeePerUnit: 0,
    minimumUnits: 0,
    commissionRate: 0,
  });

  useEffect(() => {
    if (contract && open) {
      // Default: new contract starts the day after the old one ends, same duration
      const oldEnd = new Date(contract.endDate);
      const oldStart = new Date(contract.startDate);
      const duration = oldEnd.getTime() - oldStart.getTime();
      const newStart = new Date(oldEnd.getTime() + 86400000); // +1 day
      const newEnd = new Date(newStart.getTime() + duration);

      setFormData({
        startDate: newStart.toISOString().split('T')[0],
        endDate: newEnd.toISOString().split('T')[0],
        implementationFee: contract.implementationFee,
        licenseFeePerUnit: contract.licenseFeePerUnit,
        minimumUnits: contract.minimumUnits,
        commissionRate: contract.commissionRate,
      });
    }
  }, [contract, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!contract) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Renew Contract
          </DialogTitle>
          <DialogDescription>
            Create a renewal contract for <span className="font-medium">{contract.partnerName}</span>. The existing contract will be marked as expired.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="p-3 bg-brand-primary-light rounded-lg text-sm text-brand-primary">
              Previous term: {new Date(contract.startDate).toLocaleDateString()} – {new Date(contract.endDate).toLocaleDateString()}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="renewStartDate">New Start Date</Label>
                <Input
                  id="renewStartDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="renewEndDate">New End Date</Label>
                <Input
                  id="renewEndDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="renewImplFee">Implementation Fee ($)</Label>
                <Input
                  id="renewImplFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.implementationFee}
                  onChange={(e) => setFormData({ ...formData, implementationFee: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="renewLicFee">License Fee per Unit ($)</Label>
                <Input
                  id="renewLicFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.licenseFeePerUnit}
                  onChange={(e) => setFormData({ ...formData, licenseFeePerUnit: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="renewMinUnits">Minimum Units</Label>
                <Input
                  id="renewMinUnits"
                  type="number"
                  min="0"
                  value={formData.minimumUnits}
                  onChange={(e) => setFormData({ ...formData, minimumUnits: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="renewCommission">Commission Rate (%)</Label>
                <Input
                  id="renewCommission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Renewal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}