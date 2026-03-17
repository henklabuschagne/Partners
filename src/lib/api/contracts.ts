import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { Contract } from '../../types';

// GET /api/contracts
export async function getAll(): Promise<ApiResult<Contract[]>> {
  return mockApiCall(() => appStore.contracts);
}

// POST /api/contracts
export async function createContract(data: Omit<Contract, 'id'>): Promise<ApiResult<Contract>> {
  if (!data.partnerId) {
    return errorResponse('VALIDATION_ERROR', 'Partner is required');
  }
  if (!data.startDate || !data.endDate) {
    return errorResponse('VALIDATION_ERROR', 'Start and end dates are required');
  }
  return mockApiCall(() => appStore.createContract(data));
}

// PUT /api/contracts/:id
export async function updateContract(
  id: string,
  data: Partial<Contract>
): Promise<ApiResult<Contract>> {
  return mockApiCall(() => {
    const result = appStore.updateContract(id, data);
    if (!result) throw new Error(`Contract ${id} not found`);
    return result;
  });
}

// DELETE /api/contracts/:id
export async function deleteContract(id: string): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteContract(id);
    if (!result) throw new Error(`Contract ${id} not found`);
    return result;
  });
}

// GET /api/contracts?partnerId=xxx
export async function getByPartner(partnerId: string): Promise<ApiResult<Contract[]>> {
  return mockApiCall(() => appStore.getContractsByPartner(partnerId));
}

// POST /api/contracts/:id/renew
export async function renewContract(
  existingId: string,
  overrides: Partial<Omit<Contract, 'id' | 'renewedFromId'>>
): Promise<ApiResult<Contract>> {
  if (!overrides.startDate || !overrides.endDate) {
    return errorResponse('VALIDATION_ERROR', 'Start and end dates are required for renewal');
  }
  return mockApiCall(() => {
    const result = appStore.renewContract(existingId, overrides);
    if (!result) throw new Error(`Contract ${existingId} not found`);
    return result;
  });
}

// PUT /api/contracts/bulk-status
export async function bulkUpdateStatus(
  ids: string[],
  status: Contract['status']
): Promise<ApiResult<number>> {
  if (ids.length === 0) return errorResponse('VALIDATION_ERROR', 'No contracts selected');
  return mockApiCall(() => appStore.bulkUpdateContractStatus(ids, status));
}

// DELETE /api/contracts/bulk
export async function bulkDelete(ids: string[]): Promise<ApiResult<number>> {
  if (ids.length === 0) return errorResponse('VALIDATION_ERROR', 'No contracts selected');
  return mockApiCall(() => appStore.bulkDeleteContracts(ids));
}