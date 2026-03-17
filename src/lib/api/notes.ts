import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { Note } from '../../types';

export async function getByEntity(entityType: string, entityId: string): Promise<ApiResult<Note[]>> {
  return mockApiCall(() => appStore.getNotesByEntity(entityType, entityId));
}

export async function addNote(data: Omit<Note, 'id' | 'createdAt'>): Promise<ApiResult<Note>> {
  if (!data.content.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Note content is required');
  }
  return mockApiCall(() => appStore.addNote(data));
}

export async function deleteNote(id: string): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteNote(id);
    if (!result) throw new Error(`Note ${id} not found`);
    return result;
  });
}
