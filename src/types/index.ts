export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  region: string;
}

export interface Contract {
  id: string;
  partnerId: string;
  partnerName: string;
  startDate: string;
  endDate: string;
  implementationFee: number;
  licenseFeePerUnit: number;
  minimumUnits: number;
  status: 'active' | 'expired' | 'pending';
  commissionRate: number;
  renewedFromId?: string;  // links to the previous contract in the renewal chain
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  partnerId: string;
  partnerName: string;
  contractId: string;
  issueDate: string;
  dueDate: string;
  implementationFee: number;
  licenseFee: number;
  units: number;
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;       // date the payment was recorded
  paymentNotes?: string;   // optional notes on payment
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: 'created' | 'updated' | 'deleted' | 'renewed' | 'payment_recorded' | 'bulk_update' | 'bulk_delete';
  entityType: 'partner' | 'contract' | 'invoice';
  entityId: string;
  entityName: string;
  details?: string;
}

export interface Note {
  id: string;
  entityType: 'partner' | 'contract';
  entityId: string;
  content: string;
  createdAt: string;
  author?: string;
}