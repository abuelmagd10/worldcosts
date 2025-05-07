export interface StorageProgress {
  bytesTransferred: number;
  totalBytes: number;
  percent: number;
}

export interface StoredFile {
  id: string;
  fileName: string;
  originalName?: string;
  fileType: string;
  fileSize: number;
  mimeType?: string;
  content: string;
  uploadDate: string;
  metadata?: Record<string, any>;
}

export interface StorageOptions {
  onProgress?: (progress: StorageProgress) => void;
  retryAttempts?: number;
  chunkSize?: number;
}

export interface IFileStorage {
  addFile(
    file: Omit<StoredFile, "id">,
    options?: StorageOptions
  ): Promise<StoredFile>;
  
  getFileById(id: string): Promise<StoredFile | null>;
  
  getAllFiles(): Promise<StoredFile[]>;
  
  deleteFile(id: string): Promise<boolean>;
  
  getFileStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byType: Record<string, { count: number; size: number }>;
  }>;
}