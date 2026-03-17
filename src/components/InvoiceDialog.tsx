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
import { Invoice, Partner, Contract } from '../types';
import { Loader2 } from 'lucide-react';

interface InvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (invoice: Invoice | Omit<Invoice, 'id'>) => void;
  invoice?: Invoice;
  partners: Partner[];
  contracts: Contract[];
  saving?: boolean;
}

export function InvoiceDialog({ open, onClose, onSubmit, invoice, partners, contracts, saving }: InvoiceDialogProps) {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    partnerId: '',
    partnerName: '',
    contractId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    implementationFee: 0,
    licenseFee: 0,
    units: 0,
    totalAmount: 0,
    status: 'pending' as 'paid' | 'pending' | 'overdue',
  });

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
    } else {
      const nextInvoiceNum = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      setFormData({
        invoiceNumber: nextInvoiceNum,
        partnerId: '',
        partnerName: '',
        contractId: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        implementationFee: 0,
        licenseFee: 0,
        units: 0,
        totalAmount: 0,
        status: 'pending',
      });
    }
  }, [invoice, open]);

  const handleContractChange = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      const partner = partners.find(p => p.id === contract.partnerId);
      setFormData({
        ...formData,
        contractId,
        partnerId: contract.partnerId,
        partnerName: partner?.company || contract.partnerName,
        implementationFee: contract.implementationFee,
        licenseFee: 0,
      });
    }
  };

  const handleUnitsChange = (units: number) => {
    const contract = contracts.find(c => c.id === formData.contractId);
    if (contract) {
      const licenseFee = units * contract.licenseFeePerUnit;
      const totalAmount = formData.implementationFee + licenseFee;
      setFormData({
        ...formData,
        units,
        licenseFee,
        totalAmount,
      });
    } else {
      setFormData({ ...formData, units });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoice) {
      onSubmit({ ...formData, id: invoice.id });
    } else {
      onSubmit(formData);
    }
  };

  const availableContracts = contracts.filter(c => c.status === 'active');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
          <DialogDescription>
            {invoice ? 'Modify invoice details and payment status.' : 'Generate a new invoice for a partner contract.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contract">Contract</Label>
              <Select value={formData.contractId} onValueChange={handleContractChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contract" />
                </SelectTrigger>
                <SelectContent>
                  {availableContracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.partnerName} - {contract.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="units">Number of Units</Label>
              <Input
                id="units"
                type="number"
                min="0"
                value={formData.units}
                onChange={(e) => handleUnitsChange(parseInt(e.target.value) || 0)}
                required
              />
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
                  onChange={(e) => {
                    const implementationFee = parseFloat(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      implementationFee,
                      totalAmount: implementationFee + formData.licenseFee,
                    });
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="licenseFee">License Fee ($)</Label>
                <Input
                  id="licenseFee"
                  type="number"
                  value={formData.licenseFee}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalAmount">Total Amount ($)</Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'paid' | 'pending' | 'overdue') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
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
              {invoice ? 'Update' : 'Create'} Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}