import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { ActivityLogEntry } from '../../types';

export async function getAll(): Promise<ApiResult<ActivityLogEntry[]>> {
  return mockApiCall(() => appStore.getActivityLogs());
}

export async function getByEntity(entityType: string, entityId: string): Promise<ApiResult<ActivityLogEntry[]>> {
  return mockApiCall(() => appStore.getActivityLogsByEntity(entityType, entityId));
}

export async function addLog(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>): Promise<ApiResult<ActivityLogEntry>> {
  return mockApiCall(() => appStore.addActivityLog(entry));
}
