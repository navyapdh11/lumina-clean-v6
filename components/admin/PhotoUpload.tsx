'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, Loader2, FileImage, ImageIcon } from 'lucide-react';

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
      if (!acceptedTypes.includes(file.type)) return false;
      if (file.size > maxSizeMB * 1024 * 1024) return false;
      return true;
    }).slice(0, maxFiles - uploads.length);

    const newUploads: UploadProgress[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading',
    }));

    setUploads(prev => [...prev, ...newUploads]);

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
    <div className="space-y-6">
      {/* Drop zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300
          ${isDragging
            ? 'border-cyan-500 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 scale-105'
            : 'border-white/20 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/5 hover:to-white/10'
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

        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl mb-6">
            <Upload className={`w-12 h-12 ${isDragging ? 'text-cyan-400' : 'text-gray-400'}`} />
          </div>
          <p className="text-2xl font-bold text-white mb-3">
            {isDragging ? 'Drop your photos here!' : 'Drag & drop photos'}
          </p>
          <p className="text-gray-400 mb-4">
            or click to browse files
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="px-3 py-1 bg-white/5 rounded-full">Max {maxFiles} files</span>
            <span className="px-3 py-1 bg-white/5 rounded-full">Up to {maxSizeMB}MB each</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
            <ImageIcon className="w-4 h-4" />
            <span>{acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Upload progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileImage className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Upload Progress</h3>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {uploadingCount > 0 && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {uploadingCount} uploading
                  </span>
                )}
                {successCount > 0 && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    {successCount} done
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    {errorCount} failed
                  </span>
                )}
              </div>
            </div>

            {/* Progress list */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
                {uploads.map(upload => (
                  <motion.div
                    key={upload.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 p-4 bg-black/30 rounded-2xl border border-white/5"
                  >
                    {/* Status icon */}
                    <div className={`p-2 rounded-xl ${
                      upload.status === 'uploading' ? 'bg-blue-500/20' :
                      upload.status === 'success' ? 'bg-green-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {upload.status === 'uploading' && (
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                      )}
                      {upload.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      {upload.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>

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
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${upload.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}

                    {/* Error */}
                    {upload.status === 'error' && upload.error && (
                      <p className="text-xs text-red-400">{upload.error}</p>
                    )}

                    {/* Remove button */}
                    {(upload.status === 'success' || upload.status === 'error') && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeUpload(upload.id)}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Clear button */}
            {(successCount > 0 || errorCount > 0) && uploadingCount === 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearCompleted}
                className="mt-6 w-full py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-white/10 rounded-2xl text-white font-medium transition-all"
              >
                Clear Completed ({successCount + errorCount})
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
