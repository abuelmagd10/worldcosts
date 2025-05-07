import { fileStorage } from '../db-storage';
import type { StoredFile } from '../db-storage';
import type { StorageProgress } from '../storage-interface';
import { expect, describe, it, beforeEach, jest } from '@jest/globals';

describe('FileStorage', () => {
  let mockLocalStorage: { [key: string]: string };
  
  beforeEach(() => {
    mockLocalStorage = {};
    global.localStorage = {
      getItem: (key: string) => mockLocalStorage[key] || null,
      setItem: (key: string, value: string) => { mockLocalStorage[key] = value },
      removeItem: (key: string) => { delete mockLocalStorage[key] },
      clear: () => { Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]) },
      length: 0,
      key: (index: number) => Object.keys(mockLocalStorage)[index] || null,
    };
  });

  const createTestFile = (): Omit<StoredFile, 'id'> => ({
    fileName: 'test.txt',
    originalName: 'test.txt',
    fileType: 'text',
    fileSize: 2048,
    mimeType: 'text/plain',
    content: 'a'.repeat(2048),
    uploadDate: new Date().toISOString(),
    metadata: { test: true }
  });

  describe('addFile', () => {
    it('should successfully add a file with progress tracking', async () => {
      const file = createTestFile();
      const progressUpdates: number[] = [];
      
      const result = await fileStorage.addFile(file, {
        onProgress: (progress: StorageProgress) => {
          progressUpdates.push(progress.percent);
        }
      });

      expect(result.id).toBeDefined();
      expect(progressUpdates).toEqual([50, 100]);
    });

    it('should handle retry attempts on failure', async () => {
      const file = createTestFile();
      let attempts = 0;
      
      const mockSetItem = jest.spyOn(localStorage, 'setItem').mockImplementation((key: string, value: string) => {
        attempts++;
        if (attempts <= 2) throw new Error('Storage failed');
        localStorage.setItem(key, value);
      });

      const result = await fileStorage.addFile(file, { retryAttempts: 3 });
      expect(result.id).toBeDefined();
      expect(attempts).toBe(3);

      mockSetItem.mockRestore();
    });
  });

  describe('getFileById', () => {
    it('should retrieve a previously stored file', async () => {
      const file = createTestFile();
      const stored = await fileStorage.addFile(file);
      const retrieved = await fileStorage.getFileById(stored.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.content).toBe(file.content);
    });
  });

  describe('deleteFile', () => {
    it('should delete file and all its chunks', async () => {
      const file = createTestFile();
      const stored = await fileStorage.addFile(file);
      const deleted = await fileStorage.deleteFile(stored.id);

      expect(deleted).toBe(true);
      expect(await fileStorage.getFileById(stored.id)).toBeNull();
    });
  });

  describe('getFileStats', () => {
    it('should return correct file statistics', async () => {
      const file = createTestFile();
      await fileStorage.addFile(file);

      const stats = await fileStorage.getFileStats();
      expect(stats.totalFiles).toBe(1);
      expect(stats.totalSize).toBe(file.fileSize);
      expect(stats.byType.text.count).toBe(1);
      expect(stats.byType.text.size).toBe(file.fileSize);
    });
  });
});