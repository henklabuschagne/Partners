import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  DollarSign,
  FileText,
  Receipt,
  TrendingUp,
} from 'lucide-react';
import { Contract, Invoice, Partner } from '../types';
import { PartnerDialog } from './PartnerDialog';
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

export function PartnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { partners, contracts, invoices, actions } = useAppStore('partners', 'contracts', 'invoices');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [contractStatusFilter, setContractStatusFilter] = useState('all');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('all');

  const partner = useMemo(() => partners.find((p) => p.id === id), [partners, id]);
  const partnerContracts = useMemo(() => contracts.filter((c) => c.partnerId === id), [contracts, id]);
  const partnerInvoices = useMemo(() => invoices.filter((i) => i.partnerId === id), [invoices, id]);

  // Contract table controls
  const contractTable = useTableControls<Contract>({
    data: partnerContracts,
    searchFields: ['partnerName'],
    defaultSort: { key: 'startDate', direction: 'desc' },
    defaultPageSize: 5,
    filterFn: contractStatusFilter === 'all' ? undefined : (c) => c.status === contractStatusFilter,
  });

  // Invoice table controls
  const invoiceTable = useTableControls<Invoice>({
    data: partnerInvoices,
    searchFields: ['invoiceNumber'],
    defaultSort: { key: 'issueDate', direction: 'desc' },
    defaultPageSize: 5,
    filterFn: invoiceStatusFilter === 'all' ? undefined : (i) => i.status === invoiceStatusFilter,
  });

  // Stats
  const stats = useMemo(() => {
    const totalRevenue = partnerInvoices.reduce((s, i) => s + i.totalAmount, 0);
    const paidRevenue = partnerInvoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0);
    const pendingRevenue = partnerInvoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.totalAmount, 0);
    const overdueRevenue = partnerInvoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.totalAmount, 0);
    const activeContracts = partnerContracts.filter((c) => c.status === 'active').length;
    const totalUnits = partnerInvoices.reduce((s, i) => s + i.units, 0);
    const avgCommission = partnerContracts.length > 0
      ? partnerContracts.reduce((s, c) => s + c.commissionRate, 0) / partnerContracts.length
      : 0;

    return {
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      overdueRevenue,
      activeContracts,
      totalContracts: partnerContracts.length,
      totalInvoices: partnerInvoices.length,
      totalUnits,
      avgCommission,
    };
  }, [partnerContracts, partnerInvoices]);

  const handleEditPartner = async (updated: Partner) => {
    setSaving(true);
    const result = await actions.updatePartner(updated.id, updated);
    setSaving(false);
    if (result.success) {
      toast.success('Partner updated successfully');
      setIsEditOpen(false);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleDeletePartner = async () => {
    if (!partner) return;
    setDeleting(true);
    const result = await actions.deletePartner(partner.id);
    setDeleting(false);
    if (result.success) {
      toast.success(`${partner.company} has been deleted`);
      navigate('/partners');
    } else {
      toast.error(result.error.message);
    }
  };

  if (!partner) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/partners')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Partners
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Partner not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/partners')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Partners
        </Button>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl">{partner.company}</h1>
            <Badge
              variant="outline"
              className={partner.status === 'active'
                ? 'bg-brand-success-light text-brand-success border-brand-success-mid'
                : 'bg-muted text-muted-foreground'
              }
            >
              {partner.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{partner.name}</p>
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
        </div>
      </div>

      {/* Partner Info + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Contact Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm truncate">{partner.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm">{partner.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm">{partner.company}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm">{partner.region}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm">Joined {new Date(partner.joinedDate).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-brand-success" />
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                </div>
                <p className="text-2xl font-bold">R{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm text-muted-foreground">Paid Revenue</span>
                </div>
                <p className="text-2xl font-bold text-brand-success">R{stats.paidRevenue.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm text-muted-foreground">Contracts</span>
                </div>
                <p className="text-2xl font-bold">
                  {stats.activeContracts}<span className="text-sm text-muted-foreground">/{stats.totalContracts}</span>
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-brand-warning" />
                  <span className="text-sm text-muted-foreground">Invoices</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalInvoices}</p>
              </div>
            </div>

            {/* Revenue breakdown bar */}
            {stats.totalRevenue > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-4 mb-2 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-brand-success inline-block" />
                    Paid: R{stats.paidRevenue.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-brand-warning inline-block" />
                    Pending: R{stats.pendingRevenue.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-brand-error inline-block" />
                    Overdue: R{stats.overdueRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 flex overflow-hidden">
                  <div
                    className="bg-brand-success h-3"
                    style={{ width: `${(stats.paidRevenue / stats.totalRevenue) * 100}%` }}
                  />
                  <div
                    className="bg-brand-warning h-3"
                    style={{ width: `${(stats.pendingRevenue / stats.totalRevenue) * 100}%` }}
                  />
                  <div
                    className="bg-brand-error h-3"
                    style={{ width: `${(stats.overdueRevenue / stats.totalRevenue) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                  <span>Total Units: {stats.totalUnits}</span>
                  <span>Avg Commission: {stats.avgCommission.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contracts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2>Contracts ({partnerContracts.length})</h2>
          <Select value={contractStatusFilter} onValueChange={(v) => { setContractStatusFilter(v); contractTable.setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader label="Start Date" sortKey="startDate" direction={contractTable.getSortDirection('startDate')} onSort={(k) => contractTable.requestSort(k as keyof Contract)} />
                  <SortableHeader label="End Date" sortKey="endDate" direction={contractTable.getSortDirection('endDate')} onSort={(k) => contractTable.requestSort(k as keyof Contract)} />
                  <SortableHeader label="Implementation Fee" sortKey="implementationFee" direction={contractTable.getSortDirection('implementationFee')} onSort={(k) => contractTable.requestSort(k as keyof Contract)} />
                  <SortableHeader label="License Fee/Unit" sortKey="licenseFeePerUnit" direction={contractTable.getSortDirection('licenseFeePerUnit')} onSort={(k) => contractTable.requestSort(k as keyof Contract)} />
                  <SortableHeader label="Min. Units" sortKey="minimumUnits" direction={contractTable.getSortDirection('minimumUnits')} onSort={(k) => contractTable.requestSort(k as keyof Contract)} />
                  <SortableHeader label="Commission" sortKey="commissionRate" direction={contractTable.getSortDirection('commissionRate')} onSort={(k) => contractTable.requestSort(k as keyof Contract)} />
                  <SortableHeader label="Status" sortKey="status" direction={contractTable.getSortDirection('status')} onSort={(k) => contractTable.requestSort(k as keyof Contract)} />
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractTable.paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {contractStatusFilter !== 'all' ? 'No contracts match this filter.' : 'No contracts for this partner.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  contractTable.paginatedData.map((contract) => (
                    <TableRow key={contract.id} className="cursor-pointer" onClick={() => navigate(`/contracts/${contract.id}`)}>
                      <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>R{contract.implementationFee.toLocaleString()}</TableCell>
                      <TableCell>R{contract.licenseFeePerUnit}</TableCell>
                      <TableCell>{contract.minimumUnits}</TableCell>
                      <TableCell>{contract.commissionRate}%</TableCell>
                      <TableCell>
                        <Badge variant={contract.status === 'active' ? 'default' : contract.status === 'expired' ? 'destructive' : 'secondary'}>
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/contracts/${contract.id}`); }}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {contractTable.totalItems > 0 && (
              <TablePagination
                currentPage={contractTable.currentPage}
                totalPages={contractTable.totalPages}
                totalItems={contractTable.totalItems}
                pageSize={contractTable.pageSize}
                onPageChange={contractTable.setCurrentPage}
                onPageSizeChange={contractTable.setPageSize}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoices Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2>Invoices ({partnerInvoices.length})</h2>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceTable.paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {invoiceStatusFilter !== 'all' ? 'No invoices match this filter.' : 'No invoices for this partner.'}
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

      <PartnerDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditPartner}
        partner={partner}
        saving={saving}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeletePartner}
        title="Delete Partner"
        description={`Are you sure you want to delete "${partner.company}"? This will also remove all ${stats.totalContracts} contract(s) and ${stats.totalInvoices} invoice(s). This action cannot be undone.`}
        loading={deleting}
      />

      {/* Notes Section */}
      <div className="mt-8">
        <NotesSection entityType="partner" entityId={partner.id} />
      </div>
    </div>
  );
}