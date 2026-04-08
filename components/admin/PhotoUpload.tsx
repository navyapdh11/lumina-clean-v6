'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadProgress {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  photoId?: string;
}

interface PhotoUploadProps {
  onUploadComplete?: (photoIds: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export function PhotoUpload({ onUploadComplete, maxFiles = 10, maxSizeMB = 10, acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] }: PhotoUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const filesArray = Array.from(files);
    const validFiles = filesArray.filter(file => {
      if (!acceptedTypes.includes(file.type)) {
        console.warn(`Invalid file type: ${file.type}`);
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        console.warn(`File too large: ${file.name}`);
        return false;
      }
      return true;
    }).slice(0, maxFiles - uploads.length);

    const newUploads: UploadProgress[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading',
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Upload files sequentially
    for (const upload of newUploads) {
      try {
        const formData = new FormData();
        formData.append('file', upload.file);
        formData.append('title', upload.file.name);

        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            setUploads(prev =>
              prev.map(u => u.id === upload.id ? { ...u, progress } : u)
            );
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setUploads(prev =>
              prev.map(u => u.id === upload.id ? {
                ...u,
                progress: 100,
                status: 'success' as const,
                photoId: response.photo?.id,
              } : u)
            );
          } else {
            setUploads(prev =>
              prev.map(u => u.id === upload.id ? {
                ...u,
                status: 'error' as const,
                error: 'Upload failed',
              } : u)
            );
          }
        });

        xhr.addEventListener('error', () => {
          setUploads(prev =>
            prev.map(u => u.id === upload.id ? {
              ...u,
              status: 'error' as const,
              error: 'Network error',
            } : u)
          );
        });

        xhr.open('POST', '/api/photos');
        xhr.send(formData);

      } catch (error) {
        setUploads(prev =>
          prev.map(u => u.id === upload.id ? {
            ...u,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Unknown error',
          } : u)
        );
      }
    }
  }, [maxFiles, maxSizeMB, acceptedTypes, uploads.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    const completed = uploads.filter(u => u.status === 'success' || u.status === 'error');
    setUploads(prev => prev.filter(u => u.status === 'uploading'));
    
    const photoIds = completed
      .filter(u => u.status === 'success' && u.photoId)
      .map(u => u.photoId!);
    
    if (photoIds.length > 0 && onUploadComplete) {
      onUploadComplete(photoIds);
    }
  }, [uploads, onUploadComplete]);

  const successCount = uploads.filter(u => u.status === 'success').length;
  const errorCount = uploads.filter(u => u.status === 'error').length;
  const uploadingCount = uploads.filter(u => u.status === 'uploading').length;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
          ${isDragging
            ? 'border-cyan-500 bg-cyan-500/10'
            : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-cyan-400' : 'text-gray-500'}`} />
        <p className="text-lg font-medium text-white mb-2">
          {isDragging ? 'Drop photos here' : 'Drag & drop photos here'}
        </p>
        <p className="text-sm text-gray-400">
          or click to browse • Max {maxFiles} files • Up to {maxSizeMB}MB each
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Accepted: {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}
        </p>
      </div>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Upload Progress
            </h3>
            <div className="flex items-center gap-4 text-sm">
              {uploadingCount > 0 && (
                <span className="text-blue-400">{uploadingCount} uploading...</span>
              )}
              {successCount > 0 && (
                <span className="text-green-400">{successCount} completed</span>
              )}
              {errorCount > 0 && (
                <span className="text-red-400">{errorCount} failed</span>
              )}
            </div>
          </div>

          <AnimatePresence>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uploads.map(upload => (
                <motion.div
                  key={upload.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-3 bg-black/30 rounded-xl"
                >
                  {/* Status icon */}
                  {upload.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
                  )}
                  {upload.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {upload.file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(upload.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  {/* Progress bar */}
                  {upload.status === 'uploading' && (
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Error message */}
                  {upload.status === 'error' && upload.error && (
                    <p className="text-xs text-red-400">{upload.error}</p>
                  )}

                  {/* Remove button */}
                  {(upload.status === 'success' || upload.status === 'error') && (
                    <button
                      onClick={() => removeUpload(upload.id)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {/* Clear button */}
          {(successCount > 0 || errorCount > 0) && uploadingCount === 0 && (
            <button
              onClick={clearCompleted}
              className="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
            >
              Clear Completed
            </button>
          )}
        </div>
      )}
    </div>
  );
}
