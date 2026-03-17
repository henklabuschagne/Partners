import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Users,
  Receipt,
  TrendingUp,
  Clock,
  Hash,
  Percent,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import { Contract, Invoice } from '../types';
import { ContractDialog } from './ContractDialog';
import { RenewContractDialog } from './RenewContractDialog';
import { RecordPaymentDialog } from './RecordPaymentDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { SortableHeader } from './SortableHeader';
import { TablePagination } from './TablePagination';
import { useAppStore } from '../hooks/useAppStore';
import { useTableControls } from '../hooks/useTableControls';
import { toast } from 'sonner@2.0.3';
import { NotesSection } from './NotesSection';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { partners, contracts, invoices, actions } = useAppStore('partners', 'contracts', 'invoices');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [renewSaving, setRenewSaving] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentSaving, setPaymentSaving] = useState(false);

  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('all');

  const contract = useMemo(() => contracts.find((c) => c.id === id), [contracts, id]);
  const partner = useMemo(() => contract ? partners.find((p) => p.id === contract.partnerId) : undefined, [partners, contract]);
  const contractInvoices = useMemo(() => invoices.filter((i) => i.contractId === id), [invoices, id]);

  const invoiceTable = useTableControls<Invoice>({
    data: contractInvoices,
    searchFields: ['invoiceNumber'],
    defaultSort: { key: 'issueDate', direction: 'desc' },
    defaultPageSize: 10,
    filterFn: invoiceStatusFilter === 'all' ? undefined : (i) => i.status === invoiceStatusFilter,
  });

  // Stats
  const stats = useMemo(() => {
    const totalBilled = contractInvoices.reduce((s, i) => s + i.totalAmount, 0);
    const totalPaid = contractInvoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0);
    const totalPending = contractInvoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.totalAmount, 0);
    const totalOverdue = contractInvoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.totalAmount, 0);
    const totalUnits = contractInvoices.reduce((s, i) => s + i.units, 0);

    // Days remaining
    let daysRemaining = 0;
    let contractDuration = 0;
    let daysElapsed = 0;
    if (contract) {
      const end = new Date(contract.endDate);
      const start = new Date(contract.startDate);
      const now = new Date();
      daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      contractDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      daysElapsed = Math.max(0, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // Commission earned
    const commissionEarned = contract ? totalPaid * (contract.commissionRate / 100) : 0;

    return {
      totalBilled,
      totalPaid,
      totalPending,
      totalOverdue,
      totalUnits,
      daysRemaining,
      contractDuration,
      daysElapsed,
      commissionEarned,
      invoiceCount: contractInvoices.length,
    };
  }, [contract, contractInvoices]);

  const handleEditContract = async (updated: Contract) => {
    setSaving(true);
    const result = await actions.updateContract(updated.id, updated);
    setSaving(false);
    if (result.success) {
      toast.success('Contract updated successfully');
      setIsEditOpen(false);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleRenewContract = async (overrides: Partial<Omit<Contract, 'id' | 'renewedFromId'>>) => {
    if (!contract) return;
    setRenewSaving(true);
    const result = await actions.renewContract(contract.id, overrides);
    setRenewSaving(false);
    if (result.success) {
      toast.success('Contract renewed successfully');
      setIsRenewOpen(false);
      // Navigate to the new contract
      navigate(`/contracts/${result.data.id}`);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleRecordPayment = async (paidDate: string, paymentNotes?: string) => {
    if (!paymentInvoice) return;
    setPaymentSaving(true);
    const result = await actions.recordPayment(paymentInvoice.id, paidDate, paymentNotes);
    setPaymentSaving(false);
    if (result.success) {
      toast.success(`Payment recorded for ${paymentInvoice.invoiceNumber}`);
      setPaymentInvoice(null);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleDeleteContract = async () => {
    if (!contract) return;
    setDeleting(true);
    const result = await actions.deleteContract(contract.id);
    setDeleting(false);
    if (result.success) {
      toast.success(`Contract has been deleted`);
      navigate('/contracts');
    } else {
      toast.error(result.error.message);
    }
  };

  if (!contract) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/contracts')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contracts
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Contract not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercent = stats.contractDuration > 0
    ? Math.min(100, (stats.daysElapsed / stats.contractDuration) * 100)
    : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/contracts')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contracts
        </Button>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl">Contract for {contract.partnerName}</h1>
            <Badge
              variant="outline"
              className={
                contract.status === 'active'
                  ? 'bg-brand-success-light text-brand-success border-brand-success-mid'
                  : contract.status === 'expired'
                  ? 'bg-brand-error-light text-brand-error border-brand-error-mid'
                  : 'bg-brand-warning-light text-brand-warning border-brand-warning-mid'
              }
            >
              {contract.status}
            </Badge>
          </div>
          {partner && (
            <Link to={`/partners/${partner.id}`} className="text-brand-primary hover:underline text-sm">
              View Partner Profile →
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="text-destructive hover:bg-brand-error-light border-brand-error-mid" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline" onClick={() => setIsRenewOpen(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Renew
          </Button>
        </div>
      </div>

      {/* Contract Details + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Contract Terms Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Start Date</span>
              </div>
              <span className="font-semibold">{new Date(contract.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>End Date</span>
              </div>
              <span className="font-semibold">{new Date(contract.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>Implementation</span>
              </div>
              <span className="font-semibold">R{contract.implementationFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>License/Unit</span>
              </div>
              <span className="font-semibold">R{contract.licenseFeePerUnit}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="w-4 h-4" />
                <span>Min. Units</span>
              </div>
              <span className="font-semibold">{contract.minimumUnits}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="w-4 h-4" />
                <span>Commission</span>
              </div>
              <span className="font-semibold">{contract.commissionRate}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Total Billed</span>
                <p className="text-2xl font-bold">R{stats.totalBilled.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Paid</span>
                <p className="text-2xl font-bold text-brand-success">R{stats.totalPaid.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Outstanding</span>
                <p className="text-2xl font-bold text-brand-warning">R{(stats.totalPending + stats.totalOverdue).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Commission Earned</span>
                <p className="text-2xl font-bold text-brand-primary">R{Math.round(stats.commissionEarned).toLocaleString()}</p>
              </div>
            </div>

            {/* Revenue bar */}
            {stats.totalBilled > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-brand-success inline-block" />
                    Paid: R{stats.totalPaid.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-brand-warning inline-block" />
                    Pending: R{stats.totalPending.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-brand-error inline-block" />
                    Overdue: R{stats.totalOverdue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 flex overflow-hidden">
                  <div className="bg-brand-success h-3" style={{ width: `${(stats.totalPaid / stats.totalBilled) * 100}%` }} />
                  <div className="bg-brand-warning h-3" style={{ width: `${(stats.totalPending / stats.totalBilled) * 100}%` }} />
                  <div className="bg-brand-error h-3" style={{ width: `${(stats.totalOverdue / stats.totalBilled) * 100}%` }} />
                </div>
              </div>
            )}

            {/* Contract timeline progress */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Contract Progress</span>
                </div>
                <span className="text-sm font-semibold">
                  {contract.status === 'expired'
                    ? 'Expired'
                    : `${stats.daysRemaining} days remaining`}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    contract.status === 'expired'
                      ? 'bg-brand-error'
                      : progressPercent > 75
                      ? 'bg-brand-warning'
                      : 'bg-brand-primary'
                  }`}
                  style={{ width: `${contract.status === 'expired' ? 100 : progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                <span>{new Date(contract.startDate).toLocaleDateString()}</span>
                <span>{new Date(contract.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Invoices</p>
                <p className="text-xl font-bold">{stats.invoiceCount}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="text-xl font-bold">{stats.totalUnits}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Min Required</p>
                <p className="text-xl font-bold">{contract.minimumUnits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2>Invoices ({contractInvoices.length})</h2>
          <Select value={invoiceStatusFilter} onValueChange={(v) => { setInvoiceStatusFilter(v); invoiceTable.setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader label="Invoice #" sortKey="invoiceNumber" direction={invoiceTable.getSortDirection('invoiceNumber')} onSort={(k) => invoiceTable.requestSort(k as keyof Invoice)} />
                  <SortableHeader label="Issue Date" sortKey="issueDate" direction={invoiceTable.getSortDirection('issueDate')} onSort={(k) => invoiceTable.requestSort(k as keyof Invoice)} />
                  <SortableHeader label="Due Date" sortKey="dueDate" direction={invoiceTable.getSortDirection('dueDate')} onSort={(k) => invoiceTable.requestSort(k as keyof Invoice)} />
                  <SortableHeader label="Implementation" sortKey="implementationFee" direction={invoiceTable.getSortDirection('implementationFee')} onSort={(k) => invoiceTable.requestSort(k as keyof Invoice)} />
                  <SortableHeader label="License" sortKey="licenseFee" direction={invoiceTable.getSortDirection('licenseFee')} onSort={(k) => invoiceTable.requestSort(k as keyof Invoice)} />
                  <SortableHeader label="Units" sortKey="units" direction={invoiceTable.getSortDirection('units')} onSort={(k) => invoiceTable.requestSort(k as keyof Invoice)} />
                  <SortableHeader label="Total" sortKey="totalAmount" direction={invoiceTable.getSortDirection('totalAmount')} onSort={(k) => invoiceTable.requestSort(k as keyof Invoice)} />
                  <SortableHeader label="Status" sortKey="status" direction={invoiceTable.getSortDirection('status')} onSort={(k) => invoiceTable.requestSort(k as keyof Invoice)} />
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceTable.paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {invoiceStatusFilter !== 'all' ? 'No invoices match this filter.' : 'No invoices for this contract.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  invoiceTable.paginatedData.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>R{invoice.implementationFee.toLocaleString()}</TableCell>
                      <TableCell>R{invoice.licenseFee.toLocaleString()}</TableCell>
                      <TableCell>{invoice.units}</TableCell>
                      <TableCell>R{invoice.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {invoice.status !== 'paid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-brand-success hover:text-brand-success hover:bg-brand-success-light"
                            onClick={() => setPaymentInvoice(invoice)}
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Pay
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {invoiceTable.totalItems > 0 && (
              <TablePagination
                currentPage={invoiceTable.currentPage}
                totalPages={invoiceTable.totalPages}
                totalItems={invoiceTable.totalItems}
                pageSize={invoiceTable.pageSize}
                onPageChange={invoiceTable.setCurrentPage}
                onPageSizeChange={invoiceTable.setPageSize}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <ContractDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditContract}
        contract={contract}
        partners={partners}
        saving={saving}
      />

      <RenewContractDialog
        open={isRenewOpen}
        onClose={() => setIsRenewOpen(false)}
        onSubmit={handleRenewContract}
        contract={contract}
        saving={renewSaving}
      />

      <RecordPaymentDialog
        open={!!paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        onSubmit={handleRecordPayment}
        invoice={paymentInvoice}
        saving={paymentSaving}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteContract}
        title="Delete Contract"
        description={`Are you sure you want to delete this contract for "${contract.partnerName}"? This will also remove ${stats.invoiceCount} associated invoice(s). This action cannot be undone.`}
        loading={deleting}
      />

      {/* Notes Section */}
      <div className="mt-8">
        <NotesSection entityType="contract" entityId={contract.id} />
      </div>
    </div>
  );
}