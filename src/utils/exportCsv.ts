/**
 * Converts an array of objects to a CSV string and triggers a download.
 */
export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  data: T[],
  columns: Array<{ key: keyof T; label: string }>
): void {
  if (data.length === 0) return;

  const header = columns.map(c => `"${c.label}"`).join(',');
  const rows = data.map(row =>
    columns
      .map(col => {
        const val = row[col.key];
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(',')
  );

  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
