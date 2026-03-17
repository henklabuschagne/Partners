import { Button } from './ui/button';
import { X, Trash2, CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    loading?: boolean;
  }>;
}

export function BulkActionBar({ selectedCount, onClear, actions }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-brand-primary-light border border-brand-secondary rounded-lg mb-4">
      <span className="text-sm text-brand-primary">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2 ml-auto">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={action.onClick}
            disabled={action.loading}
          >
            {action.loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : action.icon}
            {action.label}
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>
    </div>
  );
}