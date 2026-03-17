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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Contract, Partner } from '../types';
import { Loader2 } from 'lucide-react';

interface ContractDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (contract: Contract | Omit<Contract, 'id'>) => void;
  contract?: Contract;
  partners: Partner[];
  saving?: boolean;
}

export function ContractDialog({ open, onClose, onSubmit, contract, partners, saving }: ContractDialogProps) {
  const [formData, setFormData] = useState({
    partnerId: '',
    partnerName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    implementationFee: 0,
    licenseFeePerUnit: 0,
    minimumUnits: 0,
    status: 'active' as 'active' | 'expired' | 'pending',
    commissionRate: 0,
  });

  useEffect(() => {
    if (contract) {
      setFormData(contract);
    } else {
      setFormData({
        partnerId: '',
        partnerName: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        implementationFee: 0,
        licenseFeePerUnit: 0,
        minimumUnits: 0,
        status: 'active',
        commissionRate: 0,
      });
    }
  }, [contract, open]);

  const handlePartnerChange = (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId);
    setFormData({
      ...formData,
      partnerId,
      partnerName: partner?.company || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contract) {
      onSubmit({ ...formData, id: contract.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{contract ? 'Edit Contract' : 'Add New Contract'}</DialogTitle>
          <DialogDescription>
            {contract ? 'Update contract terms and conditions.' : 'Define the terms for the new partner contract.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="partner">Partner</Label>
              <Select value={formData.partnerId} onValueChange={handlePartnerChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a partner" />
                </SelectTrigger>
                <SelectContent>
                  {partners.filter(p => p.status === 'active').map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.company} - {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="implementationFee">Implementation Fee ($)</Label>
                <Input
                  id="implementationFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.implementationFee}
                  onChange={(e) => setFormData({ ...formData, implementationFee: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="licenseFeePerUnit">License Fee per Unit ($)</Label>
                <Input
                  id="licenseFeePerUnit"
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
                <Label htmlFor="minimumUnits">Minimum Units</Label>
                <Input
                  id="minimumUnits"
                  type="number"
                  min="0"
                  value={formData.minimumUnits}
                  onChange={(e) => setFormData({ ...formData, minimumUnits: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
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
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'expired' | 'pending') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {contract ? 'Update' : 'Add'} Contract
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}