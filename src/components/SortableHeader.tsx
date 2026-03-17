import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TableHead } from './ui/table';
import type { SortDirection } from '../hooks/useTableControls';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  direction: SortDirection | null;
  onSort: (key: string) => void;
  className?: string;
}

export function SortableHeader({ label, sortKey, direction, onSort, className }: SortableHeaderProps) {
  return (
    <TableHead
      className={`cursor-pointer select-none hover:bg-muted/50 transition-colors ${className || ''}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {direction === null && <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />}
        {direction === 'asc' && <ArrowUp className="w-3.5 h-3.5 text-brand-primary" />}
        {direction === 'desc' && <ArrowDown className="w-3.5 h-3.5 text-brand-primary" />}
      </div>
    </TableHead>
  );
}