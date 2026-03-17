import { useState } from 'react';
import { appStore } from '../lib/appStore';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  ChevronDown,
  ChevronUp,
  Database,
  Trash2,
  HardDrive,
} from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function DevApiPanel() {
  const [expanded, setExpanded] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const info = expanded ? appStore.getStorageInfo() : null;

  const sliceLabels: Record<string, string> = {
    partners: 'Partners',
    contracts: 'Contracts',
    invoices: 'Invoices',
    activityLog: 'Activity Log',
    notes: 'Notes',
    nextId: 'ID Counter',
  };

  return (
    <div className="px-4 pb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
      >
        <Database className="w-3.5 h-3.5" />
        <span>Dev Tools</span>
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 ml-auto" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 ml-auto" />
        )}
      </button>

      {expanded && (
        <Card className="mt-2 border-dashed border-border bg-muted/50">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="flex items-center gap-2 text-xs">
              <HardDrive className="w-3.5 h-3.5" />
              Data Persistence
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {/* Storage breakdown */}
            {info && (
              <div className="space-y-1.5">
                {Object.entries(info.slices).map(([key, bytes]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{sliceLabels[key] || key}</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {formatBytes(bytes)}
                    </Badge>
                  </div>
                ))}
                <div className="flex items-center justify-between text-xs pt-1.5 border-t">
                  <span className="font-medium">Total</span>
                  <Badge className="text-[10px] px-1.5 py-0">
                    {formatBytes(info.totalBytes)}
                  </Badge>
                </div>
              </div>
            )}

            {/* Status indicator */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-success inline-block" />
              Auto-saving to localStorage
            </div>

            {/* Reset button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-8 text-destructive border-brand-error-mid hover:bg-brand-error-light hover:text-destructive"
              onClick={() => setConfirmReset(true)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Reset All Data to Defaults
            </Button>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Reset All Data?"
        description="This will clear all localStorage data and reload the app with the original demo dataset. All your changes — partners, contracts, invoices, activity logs, and notes — will be permanently lost."
        confirmLabel="Reset Everything"
        destructive
        onConfirm={() => {
          appStore.resetToDefaults();
        }}
        onClose={() => setConfirmReset(false)}
      />
    </div>
  );
}