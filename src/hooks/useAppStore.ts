import { useState, useEffect, useMemo } from 'react';
import { appStore, type Slice } from '../lib/appStore';
import { api } from '../lib/api';
import type { Partner, Contract, Invoice, ActivityLogEntry, Note } from '../types';

export function useAppStore(...subscribeTo: Slice[]) {
  // Force re-render when subscribed slices change
  const [, bump] = useState(0);

  useEffect(() => {
    if (typeof appStore.subscribe !== 'function') {
      console.error('appStore.subscribe is not a function', appStore);
      return;
    }
    const unsubscribes = subscribeTo.map(slice =>
      appStore.subscribe(slice, () => bump(v => v + 1))
    );
    return () => unsubscribes.forEach(unsub => unsub());
    // subscribeTo is static per component usage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Reactive State (re-renders on change) ───────────
  const partners = appStore.partners;
  const contracts = appStore.contracts;
  const invoices = appStore.invoices;

  // Computed
  const activePartnerCount = appStore.activePartnerCount;
  const activeContractCount = appStore.activeContractCount;
  const pendingInvoiceCount = appStore.pendingInvoiceCount;
  const overdueInvoiceCount = appStore.overdueInvoiceCount;
  const totalPaidRevenue = appStore.totalPaidRevenue;

  // ─── Sync Read Helpers ───────────────────────────────
  const reads = useMemo(() => ({
    getPartnerById: (id: string) => appStore.getPartnerById(id),
    getContractsByPartner: (partnerId: string) => appStore.getContractsByPartner(partnerId),
    getInvoicesByPartner: (partnerId: string) => appStore.getInvoicesByPartner(partnerId),
    getInvoicesByContract: (contractId: string) => appStore.getInvoicesByContract(contractId),
    getActivePartners: () => appStore.getActivePartners(),
    getActiveContracts: () => appStore.getActiveContracts(),
    getActivityLogs: () => appStore.getActivityLogs(),
    getActivityLogsByEntity: (entityType: string, entityId: string) => appStore.getActivityLogsByEntity(entityType, entityId),
    getNotesByEntity: (entityType: string, entityId: string) => appStore.getNotesByEntity(entityType, entityId),
  }), []);

  // ─── Async Actions (routed through API layer) ───────
  const actions = useMemo(() => ({
    // Partners
    createPartner: (data: Omit<Partner, 'id'>) =>
      api.partners.createPartner(data),
    updatePartner: (id: string, data: Partial<Partner>) =>
      api.partners.updatePartner(id, data),
    deletePartner: (id: string) =>
      api.partners.deletePartner(id),

    // Contracts
    createContract: (data: Omit<Contract, 'id'>) =>
      api.contracts.createContract(data),
    updateContract: (id: string, data: Partial<Contract>) =>
      api.contracts.updateContract(id, data),
    deleteContract: (id: string) =>
      api.contracts.deleteContract(id),
    renewContract: (existingId: string, overrides: Partial<Omit<Contract, 'id' | 'renewedFromId'>>) =>
      api.contracts.renewContract(existingId, overrides),
    bulkUpdateContractStatus: (ids: string[], status: Contract['status']) =>
      api.contracts.bulkUpdateStatus(ids, status),
    bulkDeleteContracts: (ids: string[]) =>
      api.contracts.bulkDelete(ids),

    // Invoices
    createInvoice: (data: Omit<Invoice, 'id'>) =>
      api.invoices.createInvoice(data),
    updateInvoice: (id: string, data: Partial<Invoice>) =>
      api.invoices.updateInvoice(id, data),
    deleteInvoice: (id: string) =>
      api.invoices.deleteInvoice(id),
    recordPayment: (invoiceId: string, paidDate: string, paymentNotes?: string) =>
      api.invoices.recordPayment(invoiceId, paidDate, paymentNotes),
    bulkUpdateInvoiceStatus: (ids: string[], status: Invoice['status'], paidDate?: string) =>
      api.invoices.bulkUpdateStatus(ids, status, paidDate),
    bulkDeleteInvoices: (ids: string[]) =>
      api.invoices.bulkDelete(ids),

    // Activity Log
    addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) =>
      api.activityLog.addLog(entry),

    // Notes
    addNote: (data: Omit<Note, 'id' | 'createdAt'>) =>
      api.notes.addNote(data),
    deleteNote: (id: string) =>
      api.notes.deleteNote(id),
  }), []);

  return {
    // Reactive state
    partners,
    contracts,
    invoices,

    // Computed
    activePartnerCount,
    activeContractCount,
    pendingInvoiceCount,
    overdueInvoiceCount,
    totalPaidRevenue,

    // Sync reads
    reads,

    // Async writes
    actions,
  };
}