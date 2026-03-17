import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  CreditCard,
  Layers,
  Users,
  FileText,
  Receipt,
  Filter,
} from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { Link } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const actionIcons: Record<string, React.ReactNode> = {
  created: <Plus className="w-4 h-4 text-brand-success" />,
  updated: <Edit className="w-4 h-4 text-brand-primary" />,
  deleted: <Trash2 className="w-4 h-4 text-brand-error" />,
  renewed: <RefreshCw className="w-4 h-4 text-brand-secondary" />,
  payment_recorded: <CreditCard className="w-4 h-4 text-emerald-600" />,
  bulk_update: <Layers className="w-4 h-4 text-brand-warning" />,
  bulk_delete: <Trash2 className="w-4 h-4 text-brand-error" />,
};

const entityIcons: Record<string, React.ReactNode> = {
  partner: <Users className="w-4 h-4 text-muted-foreground" />,
  contract: <FileText className="w-4 h-4 text-muted-foreground" />,
  invoice: <Receipt className="w-4 h-4 text-muted-foreground" />,
};

const actionLabels: Record<string, string> = {
  created: 'Created',
  updated: 'Updated',
  deleted: 'Deleted',
  renewed: 'Renewed',
  payment_recorded: 'Payment Recorded',
  bulk_update: 'Bulk Updated',
  bulk_delete: 'Bulk Deleted',
};

function getEntityLink(entityType: string, entityId: string): string | null {
  if (entityType === 'partner') return `/partners/${entityId}`;
  if (entityType === 'contract') return `/contracts/${entityId}`;
  return null;
}

export function ActivityLog() {
  const { reads } = useAppStore('activityLog');
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const logs = useMemo(() => {
    let filtered = reads.getActivityLogs();
    if (entityFilter !== 'all') {
      filtered = filtered.filter(l => l.entityType === entityFilter);
    }
    if (actionFilter !== 'all') {
      filtered = filtered.filter(l => l.action === actionFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.entityName.toLowerCase().includes(q) ||
        l.details?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [reads, searchQuery, entityFilter, actionFilter]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Activity Log</h1>
        <p className="text-muted-foreground">Track all changes made across partners, contracts, and invoices</p>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="partner">Partners</SelectItem>
              <SelectItem value="contract">Contracts</SelectItem>
              <SelectItem value="invoice">Invoices</SelectItem>
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
              <SelectItem value="renewed">Renewed</SelectItem>
              <SelectItem value="payment_recorded">Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground ml-auto">
          {logs.length} entr{logs.length !== 1 ? 'ies' : 'y'}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p>No activity logged yet.</p>
              <p className="text-sm mt-1">Actions you perform will appear here as an audit trail.</p>
            </div>
          ) : (
            <div className="divide-y">
              {logs.map((log) => {
                const link = getEntityLink(log.entityType, log.entityId);
                return (
                  <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-muted/50">
                    <div className="mt-0.5">{actionIcons[log.action]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {entityIcons[log.entityType]}
                          <span className="ml-1 capitalize">{log.entityType}</span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {actionLabels[log.action] || log.action}
                        </Badge>
                      </div>
                      <p className="text-sm">
                        {link && log.action !== 'deleted' ? (
                          <Link to={link} className="text-brand-primary hover:underline">
                            {log.entityName}
                          </Link>
                        ) : (
                          <span>{log.entityName}</span>
                        )}
                      </p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}