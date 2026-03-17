import { Plus, Search, Trash2, Filter, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Contract } from '../types';
import { ContractDialog } from './ContractDialog';
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

export function Contracts() {
  const navigate = useNavigate();
  const { contracts, partners, actions } = useAppStore('contracts', 'partners');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | undefined>();
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Contract | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  // Status filter
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const table = useTableControls<Contract>({
    data: contracts,
    searchFields: ['partnerName'],
    defaultSort: { key: 'startDate', direction: 'desc' },
    defaultPageSize: 50,
    filterFn: statusFilter === 'all' ? undefined : (c) => c.status === statusFilter,
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
    const pageIds = table.paginatedData.map(c => c.id);
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

  const handleAddContract = async (contract: Omit<Contract, 'id'>) => {
    setSaving(true);
    const result = await actions.createContract(contract);
    setSaving(false);
    if (result.success) {
      toast.success('Contract added successfully');
      setIsDialogOpen(false);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleEditContract = async (contract: Contract) => {
    setSaving(true);
    const result = await actions.updateContract(contract.id, contract);
    setSaving(false);
    if (result.success) {
      toast.success('Contract updated successfully');
      setIsDialogOpen(false);
      setEditingContract(undefined);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleDeleteContract = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await actions.deleteContract(deleteTarget.id);
    setDeleting(false);
    if (result.success) {
      toast.success(`Contract for ${deleteTarget.partnerName} has been deleted`);
      setDeleteTarget(null);
      selectedIds.delete(deleteTarget.id);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleBulkExpire = async () => {
    setBulkLoading(true);
    const result = await actions.bulkUpdateContractStatus(Array.from(selectedIds), 'expired');
    setBulkLoading(false);
    if (result.success) {
      toast.success(`${result.data} contract(s) marked as expired`);
      setSelectedIds(new Set());
    } else {
      toast.error(result.error.message);
    }
  };

  const handleBulkActivate = async () => {
    setBulkLoading(true);
    const result = await actions.bulkUpdateContractStatus(Array.from(selectedIds), 'active');
    setBulkLoading(false);
    if (result.success) {
      toast.success(`${result.data} contract(s) activated`);
      setSelectedIds(new Set());
    } else {
      toast.error(result.error.message);
    }
  };

  const handleBulkDelete = async () => {
    setBulkLoading(true);
    const result = await actions.bulkDeleteContracts(Array.from(selectedIds));
    setBulkLoading(false);
    if (result.success) {
      toast.success(`${result.data} contract(s) deleted`);
      setSelectedIds(new Set());
    } else {
      toast.error(result.error.message);
    }
  };

  const openEditDialog = (contract: Contract) => {
    setEditingContract(contract);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingContract(undefined);
  };

  const pageIds = table.paginatedData.map(c => c.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">Contracts</h1>
          <p className="text-muted-foreground">Manage partner contracts and terms</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => exportToCsv('contracts', contracts, [
              { key: 'partnerName', label: 'Partner' },
              { key: 'startDate', label: 'Start Date' },
              { key: 'endDate', label: 'End Date' },
              { key: 'implementationFee', label: 'Implementation Fee' },
              { key: 'licenseFeePerUnit', label: 'License Fee/Unit' },
              { key: 'minimumUnits', label: 'Min Units' },
              { key: 'commissionRate', label: 'Commission Rate' },
              { key: 'status', label: 'Status' },
            ])}
          >
            Export CSV
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Contract
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by partner name..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground ml-auto">
          {table.totalItems} contract{table.totalItems !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        actions={[
          {
            label: 'Activate',
            icon: <CheckCircle className="w-4 h-4 mr-1" />,
            onClick: handleBulkActivate,
            loading: bulkLoading,
          },
          {
            label: 'Expire',
            icon: <XCircle className="w-4 h-4 mr-1" />,
            onClick: handleBulkExpire,
            variant: 'secondary',
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
                  label="Partner"
                  sortKey="partnerName"
                  direction={table.getSortDirection('partnerName')}
                  onSort={(k) => table.requestSort(k as keyof Contract)}
                />
                <SortableHeader
                  label="Start Date"
                  sortKey="startDate"
                  direction={table.getSortDirection('startDate')}
                  onSort={(k) => table.requestSort(k as keyof Contract)}
                />
                <SortableHeader
                  label="End Date"
                  sortKey="endDate"
                  direction={table.getSortDirection('endDate')}
                  onSort={(k) => table.requestSort(k as keyof Contract)}
                />
                <SortableHeader
                  label="Implementation Fee"
                  sortKey="implementationFee"
                  direction={table.getSortDirection('implementationFee')}
                  onSort={(k) => table.requestSort(k as keyof Contract)}
                />
                <SortableHeader
                  label="License Fee/Unit"
                  sortKey="licenseFeePerUnit"
                  direction={table.getSortDirection('licenseFeePerUnit')}
                  onSort={(k) => table.requestSort(k as keyof Contract)}
                />
                <SortableHeader
                  label="Commission"
                  sortKey="commissionRate"
                  direction={table.getSortDirection('commissionRate')}
                  onSort={(k) => table.requestSort(k as keyof Contract)}
                />
                <SortableHeader
                  label="Status"
                  sortKey="status"
                  direction={table.getSortDirection('status')}
                  onSort={(k) => table.requestSort(k as keyof Contract)}
                />
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    {table.searchQuery || statusFilter !== 'all'
                      ? 'No contracts match your search criteria.'
                      : 'No contracts yet. Add your first contract to get started.'}
                  </TableCell>
                </TableRow>
              ) : (
                table.paginatedData.map((contract) => (
                  <TableRow
                    key={contract.id}
                    className={`cursor-pointer ${selectedIds.has(contract.id) ? 'bg-brand-primary-light' : ''}`}
                    onClick={() => navigate(`/contracts/${contract.id}`)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(contract.id)}
                        onCheckedChange={() => toggleSelect(contract.id)}
                        aria-label={`Select ${contract.partnerName}`}
                      />
                    </TableCell>
                    <TableCell>{contract.partnerName}</TableCell>
                    <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>R{contract.implementationFee.toLocaleString()}</TableCell>
                    <TableCell>R{contract.licenseFeePerUnit}</TableCell>
                    <TableCell>{contract.commissionRate}%</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(contract)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-brand-error-light h-8 w-8 p-0"
                          onClick={() => setDeleteTarget(contract)}
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

      <ContractDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={editingContract ? handleEditContract : handleAddContract}
        contract={editingContract}
        partners={partners}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteContract}
        title="Delete Contract"
        description={
          deleteTarget
            ? `Are you sure you want to delete the contract for "${deleteTarget.partnerName}"? This will also remove all associated invoices. This action cannot be undone.`
            : ''
        }
        loading={deleting}
      />
    </div>
  );
}