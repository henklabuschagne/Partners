import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { Invoice } from '../../types';

// GET /api/invoices
export async function getAll(): Promise<ApiResult<Invoice[]>> {
  return mockApiCall(() => appStore.invoices);
}

// POST /api/invoices
export async function createInvoice(data: Omit<Invoice, 'id'>): Promise<ApiResult<Invoice>> {
  if (!data.invoiceNumber.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Invoice number is required');
  }
  if (!data.contractId) {
    return errorResponse('VALIDATION_ERROR', 'Contract is required');
  }
  if (!data.partnerId) {
    return errorResponse('VALIDATION_ERROR', 'Partner is required');
  }
  return mockApiCall(() => appStore.createInvoice(data));
}

// PUT /api/invoices/:id
export async function updateInvoice(
  id: string,
  data: Partial<Invoice>
): Promise<ApiResult<Invoice>> {
  return mockApiCall(() => {
    const result = appStore.updateInvoice(id, data);
    if (!result) throw new Error(`Invoice ${id} not found`);
    return result;
  });
}

// DELETE /api/invoices/:id
export async function deleteInvoice(id: string): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteInvoice(id);
    if (!result) throw new Error(`Invoice ${id} not found`);
    return result;
  });
}

// GET /api/invoices?partnerId=xxx
export async function getByPartner(partnerId: string): Promise<ApiResult<Invoice[]>> {
  return mockApiCall(() => appStore.getInvoicesByPartner(partnerId));
}

// GET /api/invoices?contractId=xxx
export async function getByContract(contractId: string): Promise<ApiResult<Invoice[]>> {
  return mockApiCall(() => appStore.getInvoicesByContract(contractId));
}

// POST /api/invoices/:id/record-payment
export async function recordPayment(
  invoiceId: string,
  paidDate: string,
  paymentNotes?: string
): Promise<ApiResult<Invoice>> {
  if (!paidDate) {
    return errorResponse('VALIDATION_ERROR', 'Payment date is required');
  }
  return mockApiCall(() => {
    const result = appStore.recordPayment(invoiceId, paidDate, paymentNotes);
    if (!result) throw new Error(`Invoice ${invoiceId} not found`);
    return result;
  });
}

// PUT /api/invoices/bulk-status
export async function bulkUpdateStatus(
  ids: string[],
  status: Invoice['status'],
  paidDate?: string
): Promise<ApiResult<number>> {
  if (ids.length === 0) return errorResponse('VALIDATION_ERROR', 'No invoices selected');
  return mockApiCall(() => appStore.bulkUpdateInvoiceStatus(ids, status, paidDate));
}

// DELETE /api/invoices/bulk
export async function bulkDelete(ids: string[]): Promise<ApiResult<number>> {
  if (ids.length === 0) return errorResponse('VALIDATION_ERROR', 'No invoices selected');
  return mockApiCall(() => appStore.bulkDeleteInvoices(ids));
}