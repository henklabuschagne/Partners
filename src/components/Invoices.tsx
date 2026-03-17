import { Plus, Filter, Search, Trash2, CreditCard, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Invoice } from '../types';
import { InvoiceDialog } from './InvoiceDialog';
import { RecordPaymentDialog } from './RecordPaymentDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { BulkActionBar } from './BulkActionBar';
import { SortableHeader } from './SortableHeader';
import { TablePagination } from './TablePagination';
import { useAppStore } from '../hooks/useAppStore';
import { useTableControls } from '../hooks/useTableControls';
import { toast } from 'sonner@2.0.3';
import { exportToCsv } from '../utils/exportCsv';
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

export function Invoices() {
  const { invoices, partners, contracts, actions } = useAppStore('invoices', 'partners', 'contracts');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>();
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Payment recording state
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentSaving, setPaymentSaving] = useState(false);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  // Status filter
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const table = useTableControls<Invoice>({
    data: invoices,
    searchFields: ['invoiceNumber', 'partnerName'],
    defaultSort: { key: 'issueDate', direction: 'desc' },
    defaultPageSize: 50,
    filterFn: statusFilter === 'all' ? undefined : (inv) => inv.status === statusFilter,
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const pageIds = table.paginatedData.map(i => i.id);
    const allSelected = pageIds.every(id => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        pageIds.forEach(id => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        pageIds.forEach(id => next.add(id));
        return next;
      });
    }
  };

  const handleAddInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    setSaving(true);
    const result = await actions.createInvoice(invoice);
    setSaving(false);
    if (result.success) {
      toast.success('Invoice created successfully');
      setIsDialogOpen(false);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleEditInvoice = async (invoice: Invoice) => {
    setSaving(true);
    const result = await actions.updateInvoice(invoice.id, invoice);
    setSaving(false);
    if (result.success) {
      toast.success('Invoice updated successfully');
      setIsDialogOpen(false);
      setEditingInvoice(undefined);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await actions.deleteInvoice(deleteTarget.id);
    setDeleting(false);
    if (result.success) {
      toast.success(`Invoice ${deleteTarget.invoiceNumber} has been deleted`);
      setDeleteTarget(null);
      selectedIds.delete(deleteTarget.id);
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

  const handleBulkMarkPaid = async () => {
    setBulkLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const result = await actions.bulkUpdateInvoiceStatus(Array.from(selectedIds), 'paid', today);
    setBulkLoading(false);
    if (result.success) {
      toast.success(`${result.data} invoice(s) marked as paid`);
      setSelectedIds(new Set());
    } else {
      toast.error(result.error.message);
    }
  };

  const handleBulkDelete = async () => {
    setBulkLoading(true);
    const result = await actions.bulkDeleteInvoices(Array.from(selectedIds));
    setBulkLoading(false);
    if (result.success) {
      toast.success(`${result.data} invoice(s) deleted`);
      setSelectedIds(new Set());
    } else {
      toast.error(result.error.message);
    }
  };

  const openEditDialog = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingInvoice(undefined);
  };

  const pageIds = table.paginatedData.map(i => i.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
  const somePageSelected = pageIds.some(id => selectedIds.has(id));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">Invoices</h1>
          <p className="text-muted-foreground">Manage partner invoices and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => exportToCsv('invoices', invoices, [
              { key: 'invoiceNumber', label: 'Invoice #' },
              { key: 'partnerName', label: 'Partner' },
              { key: 'issueDate', label: 'Issue Date' },
              { key: 'dueDate', label: 'Due Date' },
              { key: 'implementationFee', label: 'Implementation Fee' },
              { key: 'licenseFee', label: 'License Fee' },
              { key: 'units', label: 'Units' },
              { key: 'totalAmount', label: 'Total Amount' },
              { key: 'status', label: 'Status' },
              { key: 'paidDate', label: 'Paid Date' },
            ])}
          >
            Export CSV
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Invoice
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice number or partner name..."
            value={table.searchQuery}
            onChange={(e) => table.setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); table.setCurrentPage(1); }}>
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
        <p className="text-sm text-muted-foreground ml-auto">
          {table.totalItems} invoice{table.totalItems !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        actions={[
          {
            label: 'Mark Paid',
            icon: <CheckCircle className="w-4 h-4 mr-1" />,
            onClick: handleBulkMarkPaid,
            loading: bulkLoading,
          },
          {
            label: 'Delete',
            icon: <Trash2 className="w-4 h-4 mr-1" />,
            onClick: handleBulkDelete,
            variant: 'destructive',
            loading: bulkLoading,
          },
        ]}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <SortableHeader
                  label="Invoice #"
                  sortKey="invoiceNumber"
                  direction={table.getSortDirection('invoiceNumber')}
                  onSort={(k) => table.requestSort(k as keyof Invoice)}
                />
                <SortableHeader
                  label="Partner"
                  sortKey="partnerName"
                  direction={table.getSortDirection('partnerName')}
                  onSort={(k) => table.requestSort(k as keyof Invoice)}
                />
                <SortableHeader
                  label="Issue Date"
                  sortKey="issueDate"
                  direction={table.getSortDirection('issueDate')}
                  onSort={(k) => table.requestSort(k as keyof Invoice)}
                />
                <SortableHeader
                  label="Due Date"
                  sortKey="dueDate"
                  direction={table.getSortDirection('dueDate')}
                  onSort={(k) => table.requestSort(k as keyof Invoice)}
                />
                <SortableHeader
                  label="Total"
                  sortKey="totalAmount"
                  direction={table.getSortDirection('totalAmount')}
                  onSort={(k) => table.requestSort(k as keyof Invoice)}
                />
                <SortableHeader
                  label="Status"
                  sortKey="status"
                  direction={table.getSortDirection('status')}
                  onSort={(k) => table.requestSort(k as keyof Invoice)}
                />
                <TableHead className="w-[140px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    {table.searchQuery || statusFilter !== 'all'
                      ? 'No invoices match your search criteria.'
                      : 'No invoices yet. Create your first invoice to get started.'}
                  </TableCell>
                </TableRow>
              ) : (
                table.paginatedData.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className={`cursor-pointer ${selectedIds.has(invoice.id) ? 'bg-brand-primary-light' : ''}`}
                    onClick={() => openEditDialog(invoice)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(invoice.id)}
                        onCheckedChange={() => toggleSelect(invoice.id)}
                        aria-label={`Select ${invoice.invoiceNumber}`}
                      />
                    </TableCell>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.partnerName}</TableCell>
                    <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>R{invoice.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          invoice.status === 'paid'
                            ? 'bg-brand-success-light text-brand-success border-brand-success-mid'
                            : invoice.status === 'overdue'
                            ? 'bg-brand-error-light text-brand-error border-brand-error-mid'
                            : 'bg-brand-warning-light text-brand-warning border-brand-warning-mid'
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {invoice.status !== 'paid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-brand-success hover:text-brand-success hover:bg-brand-success-light"
                            onClick={() => setPaymentInvoice(invoice)}
                          >
                            <CreditCard className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(invoice)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-brand-error-light h-8 w-8 p-0"
                          onClick={() => setDeleteTarget(invoice)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            currentPage={table.currentPage}
            totalPages={table.totalPages}
            totalItems={table.totalItems}
            pageSize={table.pageSize}
            onPageChange={table.setCurrentPage}
            onPageSizeChange={table.setPageSize}
          />
        </CardContent>
      </Card>

      <InvoiceDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={editingInvoice ? handleEditInvoice : handleAddInvoice}
        invoice={editingInvoice}
        partners={partners}
        contracts={contracts}
        saving={saving}
      />

      <RecordPaymentDialog
        open={!!paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        onSubmit={handleRecordPayment}
        invoice={paymentInvoice}
        saving={paymentSaving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteInvoice}
        title="Delete Invoice"
        description={
          deleteTarget
            ? `Are you sure you want to delete invoice "${deleteTarget.invoiceNumber}" for ${deleteTarget.partnerName}? This action cannot be undone.`
            : ''
        }
        loading={deleting}
      />
    </div>
  );
}