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
import { Invoice } from '../types';
import { Loader2, CreditCard } from 'lucide-react';

interface RecordPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (paidDate: string, paymentNotes?: string) => void;
  invoice: Invoice | null;
  saving?: boolean;
}

export function RecordPaymentDialog({ open, onClose, onSubmit, invoice, saving }: RecordPaymentDialogProps) {
  const [paidDate, setPaidDate] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  useEffect(() => {
    if (open) {
      setPaidDate(new Date().toISOString().split('T')[0]);
      setPaymentNotes('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(paidDate, paymentNotes.trim() || undefined);
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Record Payment
          </DialogTitle>
          <DialogDescription>
            Record payment for invoice <span className="font-medium">{invoice.invoiceNumber}</span> from {invoice.partnerName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">R{invoice.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Status:</span>
                <span className={invoice.status === 'overdue' ? 'text-brand-error' : 'text-brand-warning'}>
                  {invoice.status}
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paidDate">Payment Date</Label>
              <Input
                id="paidDate"
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentNotes">Notes (optional)</Label>
              <Input
                id="paymentNotes"
                placeholder="e.g. Wire transfer #12345, Check received..."
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-brand-success hover:bg-brand-success/90">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Record Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}