import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

export interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

const presets: Array<{ label: string; getValue: () => DateRange }> = [
  {
    label: 'Last 30 Days',
    getValue: () => {
      const to = new Date();
      const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { from, to, label: 'Last 30 Days' };
    },
  },
  {
    label: 'Last 90 Days',
    getValue: () => {
      const to = new Date();
      const from = new Date(to.getTime() - 90 * 24 * 60 * 60 * 1000);
      return { from, to, label: 'Last 90 Days' };
    },
  },
  {
    label: 'Last 6 Months',
    getValue: () => {
      const to = new Date();
      const from = new Date(to);
      from.setMonth(from.getMonth() - 6);
      return { from, to, label: 'Last 6 Months' };
    },
  },
  {
    label: 'Last 12 Months',
    getValue: () => {
      const to = new Date();
      const from = new Date(to);
      from.setFullYear(from.getFullYear() - 1);
      return { from, to, label: 'Last 12 Months' };
    },
  },
  {
    label: 'Year to Date',
    getValue: () => {
      const to = new Date();
      const from = new Date(to.getFullYear(), 0, 1);
      return { from, to, label: 'Year to Date' };
    },
  },
  {
    label: 'This Quarter',
    getValue: () => {
      const now = new Date();
      const q = Math.floor(now.getMonth() / 3);
      const from = new Date(now.getFullYear(), q * 3, 1);
      return { from, to: now, label: 'This Quarter' };
    },
  },
  {
    label: 'Previous Quarter',
    getValue: () => {
      const now = new Date();
      const q = Math.floor(now.getMonth() / 3);
      const from = new Date(now.getFullYear(), (q - 1) * 3, 1);
      const to = new Date(now.getFullYear(), q * 3, 0); // last day of prev quarter
      return { from, to, label: 'Previous Quarter' };
    },
  },
  {
    label: 'Previous Year',
    getValue: () => {
      const yr = new Date().getFullYear() - 1;
      return {
        from: new Date(yr, 0, 1),
        to: new Date(yr, 11, 31),
        label: 'Previous Year',
      };
    },
  },
  {
    label: 'All Time',
    getValue: () => ({
      from: new Date(2023, 0, 1),
      to: new Date(),
      label: 'All Time',
    }),
  },
];

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const [mode, setMode] = useState<'preset' | 'custom'>(
    presets.some(p => p.label === value.label) ? 'preset' : 'custom'
  );

  const handlePresetChange = (label: string) => {
    if (label === 'custom') {
      setMode('custom');
      return;
    }
    setMode('preset');
    const preset = presets.find(p => p.label === label);
    if (preset) onChange(preset.getValue());
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <Select
        value={mode === 'preset' ? value.label : 'custom'}
        onValueChange={handlePresetChange}
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {presets.map((p) => (
            <SelectItem key={p.label} value={p.label}>{p.label}</SelectItem>
          ))}
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      {mode === 'custom' && (
        <>
          <Input
            type="date"
            className="w-[140px]"
            value={value.from.toISOString().split('T')[0]}
            onChange={(e) => {
              const d = new Date(e.target.value + 'T00:00:00');
              if (!isNaN(d.getTime())) onChange({ ...value, from: d, label: 'Custom' });
            }}
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="date"
            className="w-[140px]"
            value={value.to.toISOString().split('T')[0]}
            onChange={(e) => {
              const d = new Date(e.target.value + 'T23:59:59');
              if (!isNaN(d.getTime())) onChange({ ...value, to: d, label: 'Custom' });
            }}
          />
        </>
      )}
      {mode === 'preset' && (
        <span className="text-xs text-muted-foreground hidden md:inline">
          {value.from.toLocaleDateString()} — {value.to.toLocaleDateString()}
        </span>
      )}
    </div>
  );
}