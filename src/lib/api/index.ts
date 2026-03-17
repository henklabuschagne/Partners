import * as partners from './partners';
import * as contracts from './contracts';
import * as invoices from './invoices';
import * as activityLog from './activityLog';
import * as notesApi from './notes';

export const api = {
  partners,
  contracts,
  invoices,
  activityLog,
  notes: notesApi,
};

export type { ApiResult, ApiError, PaginatedResult } from './types';