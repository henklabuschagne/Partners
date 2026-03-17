import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface TableControls<T> {
  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Sort
  sortConfig: SortConfig<T> | null;
  requestSort: (key: keyof T) => void;
  getSortDirection: (key: keyof T) => SortDirection | null;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  totalItems: number;

  // Processed data (searched + sorted + paginated)
  paginatedData: T[];
  filteredData: T[];
}

interface UseTableControlsOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  defaultSort?: SortConfig<T>;
  defaultPageSize?: number;
  filterFn?: (item: T) => boolean;
}

export function useTableControls<T extends Record<string, any>>({
  data,
  searchFields,
  defaultSort,
  defaultPageSize = 10,
  filterFn,
}: UseTableControlsOptions<T>): TableControls<T> {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(defaultSort ?? null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // 1. Apply external filter (e.g. status filter)
  const externallyFiltered = useMemo(() => {
    if (!filterFn) return data;
    return data.filter(filterFn);
  }, [data, filterFn]);

  // 2. Search
  const searched = useMemo(() => {
    if (!searchQuery.trim()) return externallyFiltered;
    const q = searchQuery.toLowerCase();
    return externallyFiltered.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(q);
      })
    );
  }, [externallyFiltered, searchQuery, searchFields]);

  // 3. Sort
  const sorted = useMemo(() => {
    if (!sortConfig) return searched;
    const { key, direction } = sortConfig;
    return [...searched].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison: number;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }, [searched, sortConfig]);

  // 4. Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage, pageSize]);

  // Reset to page 1 when search/filter changes
  const setSearchQueryAndReset = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const setPageSizeAndReset = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const requestSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortDirection = (key: keyof T): SortDirection | null => {
    if (sortConfig?.key === key) return sortConfig.direction;
    return null;
  };

  return {
    searchQuery,
    setSearchQuery: setSearchQueryAndReset,
    sortConfig,
    requestSort,
    getSortDirection,
    currentPage: safePage,
    setCurrentPage,
    pageSize,
    setPageSize: setPageSizeAndReset,
    totalPages,
    totalItems: sorted.length,
    paginatedData,
    filteredData: sorted,
  };
}
