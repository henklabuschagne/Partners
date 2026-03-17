import { useTableControls } from '../hooks/useTableControls';
import { toast } from 'sonner@2.0.3';
import { exportToCsv } from '../utils/exportCsv';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Plus, Mail, Phone, Building, Search, Trash2, Edit, LayoutGrid, List } from 'lucide-react';
import { Partner } from '../types';
import { PartnerDialog } from './PartnerDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { SortableHeader } from './SortableHeader';
import { TablePagination } from './TablePagination';
import { useAppStore } from '../hooks/useAppStore';
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

type ViewMode = 'grid' | 'list';

const VIEW_MODE_KEY = 'partnerPortal_partnersViewMode';

function getStoredViewMode(): ViewMode {
  try {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    if (stored === 'grid' || stored === 'list') return stored;
  } catch {}
  return 'grid';
}

export function Partners() {
  const navigate = useNavigate();
  const { partners, actions } = useAppStore('partners');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | undefined>();
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(getStoredViewMode());

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Status filter
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const table = useTableControls<Partner>({
    data: partners,
    searchFields: ['name', 'company', 'email', 'region'],
    defaultSort: { key: 'name', direction: 'asc' },
    defaultPageSize: viewMode === 'grid' ? 9 : 50,
    filterFn: statusFilter === 'all' ? undefined : (p) => p.status === statusFilter,
  });

  const handleAddPartner = async (partner: Omit<Partner, 'id'>) => {
    setSaving(true);
    const result = await actions.createPartner(partner);
    setSaving(false);
    if (result.success) {
      toast.success('Partner added successfully');
      setIsDialogOpen(false);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleEditPartner = async (partner: Partner) => {
    setSaving(true);
    const result = await actions.updatePartner(partner.id, partner);
    setSaving(false);
    if (result.success) {
      toast.success('Partner updated successfully');
      setIsDialogOpen(false);
      setEditingPartner(undefined);
    } else {
      toast.error(result.error.message);
    }
  };

  const handleDeletePartner = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await actions.deletePartner(deleteTarget.id);
    setDeleting(false);
    if (result.success) {
      toast.success(`${deleteTarget.company} has been deleted`);
      setDeleteTarget(null);
    } else {
      toast.error(result.error.message);
    }
  };

  const openEditDialog = (partner: Partner, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPartner(partner);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPartner(undefined);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">Partners</h1>
          <p className="text-muted-foreground">Manage your partner relationships</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => exportToCsv('partners', partners, [
              { key: 'name', label: 'Name' },
              { key: 'company', label: 'Company' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'region', label: 'Region' },
              { key: 'status', label: 'Status' },
              { key: 'joinedDate', label: 'Joined Date' },
            ])}
          >
            Export CSV
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, email, or region..."
            value={table.searchQuery}
            onChange={(e) => table.setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); table.setCurrentPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden ml-auto">
          <button
            onClick={() => { setViewMode('grid'); localStorage.setItem(VIEW_MODE_KEY, 'grid'); table.setPageSize(9); }}
            className={`flex items-center justify-center w-9 h-9 transition-colors ${
              viewMode === 'grid'
                ? 'bg-brand-primary text-white'
                : 'bg-white text-muted-foreground hover:bg-muted'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setViewMode('list'); localStorage.setItem(VIEW_MODE_KEY, 'list'); table.setPageSize(50); }}
            className={`flex items-center justify-center w-9 h-9 transition-colors ${
              viewMode === 'list'
                ? 'bg-brand-primary text-white'
                : 'bg-white text-muted-foreground hover:bg-muted'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          {table.totalItems} partner{table.totalItems !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Empty state */}
      {table.paginatedData.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {table.searchQuery || statusFilter !== 'all'
                ? 'No partners match your search criteria.'
                : 'No partners yet. Add your first partner to get started.'}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        /* ─── Grid View ───────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {table.paginatedData.map((partner) => (
            <Card
              key={partner.id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/partners/${partner.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle>{partner.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{partner.company}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge
                      variant="outline"
                      className={partner.status === 'active'
                        ? 'bg-brand-success-light text-brand-success border-brand-success-mid'
                        : 'bg-muted text-muted-foreground'
                      }
                    >
                      {partner.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      onClick={(e) => openEditDialog(partner, e)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-brand-error-light"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(partner);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{partner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{partner.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="w-4 h-4 shrink-0" />
                  <span>{partner.region}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(partner.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* ─── List / Table View ───────────────────────── */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader
                    label="Name"
                    sortKey="name"
                    direction={table.getSortDirection('name')}
                    onSort={(k) => table.requestSort(k as keyof Partner)}
                  />
                  <SortableHeader
                    label="Company"
                    sortKey="company"
                    direction={table.getSortDirection('company')}
                    onSort={(k) => table.requestSort(k as keyof Partner)}
                  />
                  <SortableHeader
                    label="Email"
                    sortKey="email"
                    direction={table.getSortDirection('email')}
                    onSort={(k) => table.requestSort(k as keyof Partner)}
                  />
                  <TableHead>Phone</TableHead>
                  <SortableHeader
                    label="Region"
                    sortKey="region"
                    direction={table.getSortDirection('region')}
                    onSort={(k) => table.requestSort(k as keyof Partner)}
                  />
                  <SortableHeader
                    label="Status"
                    sortKey="status"
                    direction={table.getSortDirection('status')}
                    onSort={(k) => table.requestSort(k as keyof Partner)}
                  />
                  <SortableHeader
                    label="Joined"
                    sortKey="joinedDate"
                    direction={table.getSortDirection('joinedDate')}
                    onSort={(k) => table.requestSort(k as keyof Partner)}
                  />
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.paginatedData.map((partner) => (
                  <TableRow
                    key={partner.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/partners/${partner.id}`)}
                  >
                    <TableCell>{partner.name}</TableCell>
                    <TableCell>{partner.company}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{partner.email}</TableCell>
                    <TableCell>{partner.phone}</TableCell>
                    <TableCell>{partner.region}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={partner.status === 'active'
                          ? 'bg-brand-success-light text-brand-success border-brand-success-mid'
                          : 'bg-muted text-muted-foreground'
                        }
                      >
                        {partner.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(partner.joinedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(partner)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-brand-error-light h-8 w-8 p-0"
                          onClick={() => setDeleteTarget(partner)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {table.totalItems > 0 && (
        <Card className="mt-6">
          <TablePagination
            currentPage={table.currentPage}
            totalPages={table.totalPages}
            totalItems={table.totalItems}
            pageSize={table.pageSize}
            onPageChange={table.setCurrentPage}
            onPageSizeChange={table.setPageSize}
          />
        </Card>
      )}

      <PartnerDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={editingPartner ? handleEditPartner : handleAddPartner}
        partner={editingPartner}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeletePartner}
        title="Delete Partner"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.company}"? This will also remove all associated contracts and invoices. This action cannot be undone.`
            : ''
        }
        loading={deleting}
      />
    </div>
  );
}