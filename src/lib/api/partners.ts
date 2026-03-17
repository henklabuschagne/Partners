import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { Partner } from '../../types';

// GET /api/partners
export async function getAll(): Promise<ApiResult<Partner[]>> {
  return mockApiCall(() => appStore.partners);
}

// GET /api/partners/:id
export async function getById(id: string): Promise<ApiResult<Partner>> {
  return mockApiCall(() => {
    const partner = appStore.getPartnerById(id);
    if (!partner) throw new Error(`Partner ${id} not found`);
    return partner;
  });
}

// POST /api/partners
export async function createPartner(data: Omit<Partner, 'id'>): Promise<ApiResult<Partner>> {
  if (!data.name.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Partner name is required');
  }
  if (!data.email.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Partner email is required');
  }
  if (!data.company.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Company name is required');
  }
  return mockApiCall(() => appStore.createPartner(data));
}

// PUT /api/partners/:id
export async function updatePartner(
  id: string,
  data: Partial<Partner>
): Promise<ApiResult<Partner>> {
  return mockApiCall(() => {
    const result = appStore.updatePartner(id, data);
    if (!result) throw new Error(`Partner ${id} not found`);
    return result;
  });
}

// DELETE /api/partners/:id
export async function deletePartner(id: string): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deletePartner(id);
    if (!result) throw new Error(`Partner ${id} not found`);
    return result;
  });
}
