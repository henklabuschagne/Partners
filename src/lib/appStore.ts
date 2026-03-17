import type { Partner, Contract, Invoice } from '../types';
import type { ActivityLogEntry, Note } from '../types';
import { mockPartners, mockContracts, mockInvoices } from '../utils/mockData';

// ─── localStorage Persistence ──────────────────────────
const STORAGE_PREFIX = 'partnerPortal_';
const STORAGE_KEYS = {
  partners: `${STORAGE_PREFIX}partners`,
  contracts: `${STORAGE_PREFIX}contracts`,
  invoices: `${STORAGE_PREFIX}invoices`,
  activityLog: `${STORAGE_PREFIX}activityLog`,
  notes: `${STORAGE_PREFIX}notes`,
  nextId: `${STORAGE_PREFIX}nextId`,
} as const;

/** Save a single domain slice to localStorage. */
function persist(slice: Slice) {
  try {
    const data = sliceRef(slice);
    localStorage.setItem(STORAGE_KEYS[slice], JSON.stringify(data));
  } catch {
    // Silently ignore quota errors — app still works in-memory
  }
}

/** Persist the nextId counter. */
function persistNextId() {
  try {
    localStorage.setItem(STORAGE_KEYS.nextId, String(nextId));
  } catch { /* ignore */ }
}

/**
 * Hydrate a slice from localStorage.
 * All date fields in the app are stored as ISO strings (not Date objects),
 * so JSON.parse round-trips them correctly with no special reviver needed.
 */
function hydrateSlice<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      return JSON.parse(raw) as T;
    }
  } catch {
    // Corrupted data — fall back to defaults
  }
  return fallback;
}

/** Compute a safe starting nextId from the max numeric id across all entities. */
function computeNextId(
  p: Partner[],
  c: Contract[],
  inv: Invoice[],
  logs: ActivityLogEntry[],
  n: Note[]
): number {
  const all = [
    ...p.map(x => x.id),
    ...c.map(x => x.id),
    ...inv.map(x => x.id),
    ...logs.map(x => x.id),
    ...n.map(x => x.id),
  ];
  const maxNumeric = all.reduce((max, id) => {
    const num = parseInt(id, 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return maxNumeric;
}

// ─── Subscriber System ─────────────────────────────────
type Slice = 'partners' | 'contracts' | 'invoices' | 'activityLog' | 'notes';
type Listener = () => void;

const subscribers: Record<Slice, Set<Listener>> = {
  partners: new Set(),
  contracts: new Set(),
  invoices: new Set(),
  activityLog: new Set(),
  notes: new Set(),
};

/** Helper: get a reference to the current array for a given slice. */
function sliceRef(slice: Slice): any {
  switch (slice) {
    case 'partners': return partners;
    case 'contracts': return contracts;
    case 'invoices': return invoices;
    case 'activityLog': return activityLogs;
    case 'notes': return notes;
  }
}

/** Notify listeners AND auto-persist to localStorage. */
function notify(...slices: Slice[]) {
  for (const slice of slices) {
    persist(slice);
    subscribers[slice].forEach(fn => fn());
  }
}

function subscribe(slice: Slice, listener: Listener): () => void {
  subscribers[slice].add(listener);
  return () => { subscribers[slice].delete(listener); };
}

// ─── Default Demo Data ─────────────────────────────────

const DEFAULT_PARTNERS: Partner[] = mockPartners;
const DEFAULT_CONTRACTS: Contract[] = mockContracts;
const DEFAULT_INVOICES: Invoice[] = mockInvoices;
const DEFAULT_ACTIVITY_LOGS: ActivityLogEntry[] = [];
const DEFAULT_NOTES: Note[] = [];

// ─── ID Generation ─────────────────────────────────────
let nextId = 200;

// ─── State (hydrated from localStorage or defaults) ────
let partners: Partner[] = hydrateSlice(STORAGE_KEYS.partners, DEFAULT_PARTNERS);
let contracts: Contract[] = hydrateSlice(STORAGE_KEYS.contracts, DEFAULT_CONTRACTS);
let invoices: Invoice[] = hydrateSlice(STORAGE_KEYS.invoices, DEFAULT_INVOICES);
let activityLogs: ActivityLogEntry[] = hydrateSlice(STORAGE_KEYS.activityLog, DEFAULT_ACTIVITY_LOGS);
let notes: Note[] = hydrateSlice(STORAGE_KEYS.notes, DEFAULT_NOTES);

// Compute nextId from persisted data so new IDs never collide
const savedNextId = parseInt(localStorage.getItem(STORAGE_KEYS.nextId) ?? '', 10);
if (!isNaN(savedNextId) && savedNextId > nextId) {
  nextId = savedNextId;
} else {
  nextId = computeNextId(partners, contracts, invoices, activityLogs, notes);
}

function generateId(): string {
  nextId++;
  persistNextId();
  return String(nextId);
}

// ─── CRUD Methods ──────────────────────────────────────

// Partners
function createPartner(data: Omit<Partner, 'id'>): Partner {
  const partner: Partner = { id: generateId(), ...data };
  partners = [...partners, partner];
  notify('partners');
  addActivityLog({ action: 'created', entityType: 'partner', entityId: partner.id, entityName: partner.company });
  return partner;
}

function updatePartner(id: string, updates: Partial<Partner>): Partner | null {
  const index = partners.findIndex(p => p.id === id);
  if (index === -1) return null;
  partners[index] = { ...partners[index], ...updates };
  partners = [...partners];
  notify('partners');
  addActivityLog({ action: 'updated', entityType: 'partner', entityId: id, entityName: partners[index].company });
  return partners[index];
}

function deletePartner(id: string): boolean {
  const partner = partners.find(p => p.id === id);
  const before = partners.length;
  partners = partners.filter(p => p.id !== id);
  if (partners.length < before) {
    contracts = contracts.filter(c => c.partnerId !== id);
    invoices = invoices.filter(i => i.partnerId !== id);
    notify('partners', 'contracts', 'invoices');
    if (partner) addActivityLog({ action: 'deleted', entityType: 'partner', entityId: id, entityName: partner.company });
    return true;
  }
  return false;
}

// Contracts
function createContract(data: Omit<Contract, 'id'>): Contract {
  const contract: Contract = { id: generateId(), ...data };
  contracts = [...contracts, contract];
  notify('contracts');
  addActivityLog({ action: 'created', entityType: 'contract', entityId: contract.id, entityName: `Contract for ${contract.partnerName}` });
  return contract;
}

function updateContract(id: string, updates: Partial<Contract>): Contract | null {
  const index = contracts.findIndex(c => c.id === id);
  if (index === -1) return null;
  contracts[index] = { ...contracts[index], ...updates };
  contracts = [...contracts];
  notify('contracts');
  addActivityLog({ action: 'updated', entityType: 'contract', entityId: id, entityName: `Contract for ${contracts[index].partnerName}` });
  return contracts[index];
}

function deleteContract(id: string): boolean {
  const contract = contracts.find(c => c.id === id);
  const before = contracts.length;
  contracts = contracts.filter(c => c.id !== id);
  if (contracts.length < before) {
    invoices = invoices.filter(i => i.contractId !== id);
    notify('contracts', 'invoices');
    if (contract) addActivityLog({ action: 'deleted', entityType: 'contract', entityId: id, entityName: `Contract for ${contract.partnerName}` });
    return true;
  }
  return false;
}

// Invoices
function createInvoice(data: Omit<Invoice, 'id'>): Invoice {
  const invoice: Invoice = { id: generateId(), ...data };
  invoices = [...invoices, invoice];
  notify('invoices');
  addActivityLog({ action: 'created', entityType: 'invoice', entityId: invoice.id, entityName: `${invoice.invoiceNumber} — ${invoice.partnerName}` });
  return invoice;
}

function updateInvoice(id: string, updates: Partial<Invoice>): Invoice | null {
  const index = invoices.findIndex(i => i.id === id);
  if (index === -1) return null;
  invoices[index] = { ...invoices[index], ...updates };
  invoices = [...invoices];
  notify('invoices');
  addActivityLog({ action: 'updated', entityType: 'invoice', entityId: id, entityName: `${invoices[index].invoiceNumber} — ${invoices[index].partnerName}` });
  return invoices[index];
}

function deleteInvoice(id: string): boolean {
  const invoice = invoices.find(i => i.id === id);
  const before = invoices.length;
  invoices = invoices.filter(i => i.id !== id);
  if (invoices.length < before) {
    notify('invoices');
    if (invoice) addActivityLog({ action: 'deleted', entityType: 'invoice', entityId: id, entityName: `${invoice.invoiceNumber} — ${invoice.partnerName}` });
    return true;
  }
  return false;
}

// Contract Renewal — creates a new contract based on an existing one
function renewContract(
  existingId: string,
  overrides: Partial<Omit<Contract, 'id' | 'renewedFromId'>>
): Contract | null {
  const existing = contracts.find(c => c.id === existingId);
  if (!existing) return null;
  // Mark old contract as expired
  updateContract(existingId, { status: 'expired' });
  const renewed: Contract = {
    ...existing,
    ...overrides,
    id: generateId(),
    renewedFromId: existingId,
    status: overrides.status || 'active',
  };
  contracts = [...contracts, renewed];
  notify('contracts');
  addActivityLog({ action: 'renewed', entityType: 'contract', entityId: renewed.id, entityName: `Contract for ${renewed.partnerName}`, details: `Renewed from contract #${existingId}` });
  return renewed;
}

// Invoice Payment Recording
function recordPayment(
  invoiceId: string,
  paidDate: string,
  paymentNotes?: string
): Invoice | null {
  const index = invoices.findIndex(i => i.id === invoiceId);
  if (index === -1) return null;
  invoices[index] = { ...invoices[index], status: 'paid', paidDate, paymentNotes };
  invoices = [...invoices];
  notify('invoices');
  addActivityLog({ action: 'payment_recorded', entityType: 'invoice', entityId: invoiceId, entityName: `${invoices[index].invoiceNumber} — ${invoices[index].partnerName}`, details: `Paid on ${paidDate}${paymentNotes ? ` — ${paymentNotes}` : ''}` });
  return invoices[index];
}

// Bulk update invoice statuses
function bulkUpdateInvoiceStatus(
  ids: string[],
  status: Invoice['status'],
  paidDate?: string
): number {
  let count = 0;
  invoices = invoices.map(inv => {
    if (ids.includes(inv.id)) {
      count++;
      return { ...inv, status, ...(status === 'paid' && paidDate ? { paidDate } : {}) };
    }
    return inv;
  });
  if (count > 0) {
    notify('invoices');
    addActivityLog({ action: 'bulk_update', entityType: 'invoice', entityId: '', entityName: `${count} invoice(s)`, details: `Status changed to "${status}"` });
  }
  return count;
}

// Bulk delete invoices
function bulkDeleteInvoices(ids: string[]): number {
  const before = invoices.length;
  invoices = invoices.filter(i => !ids.includes(i.id));
  const count = before - invoices.length;
  if (count > 0) {
    notify('invoices');
    addActivityLog({ action: 'bulk_delete', entityType: 'invoice', entityId: '', entityName: `${count} invoice(s)`, details: 'Bulk deleted' });
  }
  return count;
}

// Bulk update contract statuses
function bulkUpdateContractStatus(
  ids: string[],
  status: Contract['status']
): number {
  let count = 0;
  contracts = contracts.map(c => {
    if (ids.includes(c.id)) {
      count++;
      return { ...c, status };
    }
    return c;
  });
  if (count > 0) {
    notify('contracts');
    addActivityLog({ action: 'bulk_update', entityType: 'contract', entityId: '', entityName: `${count} contract(s)`, details: `Status changed to "${status}"` });
  }
  return count;
}

// Bulk delete contracts
function bulkDeleteContracts(ids: string[]): number {
  const before = contracts.length;
  const deletedIds = new Set(ids.filter(id => contracts.some(c => c.id === id)));
  contracts = contracts.filter(c => !deletedIds.has(c.id));
  invoices = invoices.filter(i => !deletedIds.has(i.contractId));
  const count = before - contracts.length;
  if (count > 0) {
    notify('contracts', 'invoices');
    addActivityLog({ action: 'bulk_delete', entityType: 'contract', entityId: '', entityName: `${count} contract(s)`, details: 'Bulk deleted with associated invoices' });
  }
  return count;
}

// ─── Activity Log ──────────────────────────────────────

function addActivityLog(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>): ActivityLogEntry {
  const log: ActivityLogEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  activityLogs = [log, ...activityLogs]; // newest first
  notify('activityLog');
  return log;
}

function getActivityLogs(): ActivityLogEntry[] {
  return activityLogs;
}

function getActivityLogsByEntity(entityType: string, entityId: string): ActivityLogEntry[] {
  return activityLogs.filter(l => l.entityType === entityType && l.entityId === entityId);
}

// ─── Notes ─────────────────────────────────────────────

function addNote(data: Omit<Note, 'id' | 'createdAt'>): Note {
  const note: Note = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  notes = [note, ...notes];
  notify('notes');
  return note;
}

function deleteNote(id: string): boolean {
  const before = notes.length;
  notes = notes.filter(n => n.id !== id);
  if (notes.length < before) {
    notify('notes');
    return true;
  }
  return false;
}

function getNotesByEntity(entityType: string, entityId: string): Note[] {
  return notes.filter(n => n.entityType === entityType && n.entityId === entityId);
}

// ─── Reset to Defaults ────────────────────────────────
function resetToDefaults(): void {
  // Clear all partnerPortal_ keys from localStorage
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  // Hard reload so module re-initializes from defaults
  window.location.reload();
}

// ─── Storage Info (for DevApiPanel) ────────────────────
function getStorageInfo(): { totalBytes: number; slices: Record<string, number> } {
  const sliceInfo: Record<string, number> = {};
  let total = 0;
  for (const [name, key] of Object.entries(STORAGE_KEYS)) {
    const raw = localStorage.getItem(key);
    const bytes = raw ? new Blob([raw]).size : 0;
    sliceInfo[name] = bytes;
    total += bytes;
  }
  return { totalBytes: total, slices: sliceInfo };
}

// ─── Computed Getters ──────────────────────────────────

function getPartnerById(id: string): Partner | undefined {
  return partners.find(p => p.id === id);
}

function getContractsByPartner(partnerId: string): Contract[] {
  return contracts.filter(c => c.partnerId === partnerId);
}

function getInvoicesByPartner(partnerId: string): Invoice[] {
  return invoices.filter(i => i.partnerId === partnerId);
}

function getInvoicesByContract(contractId: string): Invoice[] {
  return invoices.filter(i => i.contractId === contractId);
}

function getActivePartners(): Partner[] {
  return partners.filter(p => p.status === 'active');
}

function getActiveContracts(): Contract[] {
  return contracts.filter(c => c.status === 'active');
}

// ─── Public API ────────────────────────────────────────

export const appStore = {
  // Pub/sub — must be first so hooks can call appStore.subscribe()
  subscribe(slice: Slice, listener: Listener): () => void {
    subscribers[slice].add(listener);
    return () => { subscribers[slice].delete(listener); };
  },

  // Reactive state (read by hooks)
  get partners() { return partners; },
  get contracts() { return contracts; },
  get invoices() { return invoices; },

  // Computed
  get activePartnerCount() { return partners.filter(p => p.status === 'active').length; },
  get activeContractCount() { return contracts.filter(c => c.status === 'active').length; },
  get pendingInvoiceCount() { return invoices.filter(i => i.status === 'pending').length; },
  get overdueInvoiceCount() { return invoices.filter(i => i.status === 'overdue').length; },
  get totalPaidRevenue() {
    return invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
  },

  // Getters
  getPartnerById,
  getContractsByPartner,
  getInvoicesByPartner,
  getInvoicesByContract,
  getActivePartners,
  getActiveContracts,
  getActivityLogs,
  getActivityLogsByEntity,
  getNotesByEntity,

  // Mutations (called by API layer only)
  createPartner,
  updatePartner,
  deletePartner,
  createContract,
  updateContract,
  deleteContract,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  renewContract,
  recordPayment,
  bulkUpdateInvoiceStatus,
  bulkDeleteInvoices,
  bulkUpdateContractStatus,
  bulkDeleteContracts,
  addActivityLog,
  addNote,
  deleteNote,

  // Persistence controls
  resetToDefaults,
  getStorageInfo,
};

export type { Slice };