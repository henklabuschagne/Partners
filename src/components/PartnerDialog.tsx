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
import { Partner } from '../types';
import { Loader2 } from 'lucide-react';

interface PartnerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (partner: Partner | Omit<Partner, 'id'>) => void;
  partner?: Partner;
  saving?: boolean;
}

export function PartnerDialog({ open, onClose, onSubmit, partner, saving }: PartnerDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active' as 'active' | 'inactive',
    joinedDate: new Date().toISOString().split('T')[0],
    region: '',
  });

  useEffect(() => {
    if (partner) {
      setFormData(partner);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        region: '',
      });
    }
  }, [partner, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partner) {
      onSubmit({ ...formData, id: partner.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{partner ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
          <DialogDescription>
            {partner ? 'Update partner information below.' : 'Enter the details for the new partner.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="joinedDate">Joined Date</Label>
              <Input
                id="joinedDate"
                type="date"
                value={formData.joinedDate}
                onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {partner ? 'Update' : 'Add'} Partner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}