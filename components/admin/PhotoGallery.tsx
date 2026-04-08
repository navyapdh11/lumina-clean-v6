'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Loader2, ImageOff, ZoomIn, AlertCircle, X, Calendar, FileImage } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  altText?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  status: string;
  createdAt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  onDelete: (photoId: string) => Promise<void>;
  loading?: boolean;
  emptyMessage?: string;
}

function LazyImage({ src, alt, thumbnailUrl, className, onClick }: {
  src: string;
  alt: string;
  thumbnailUrl?: string;
  className?: string;
  onClick?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className} onClick={onClick}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-900/20 to-orange-900/20 text-gray-400">
          <ImageOff className="w-12 h-12 mb-2" />
          <span className="text-xs">Failed to load</span>
        </div>
      )}

      {isInView && !hasError && (
        <img
          src={thumbnailUrl || src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}

export function PhotoGallery({ photos, onDelete, loading = false, emptyMessage = 'No photos yet' }: PhotoGalleryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (photoId: string) => {
    setDeletingId(photoId);
    try {
      await onDelete(photoId);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="aspect-square bg-gradient-to-br from-white/5 to-white/10 rounded-2xl animate-pulse" 
          />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10"
      >
        <ImageOff className="w-20 h-20 text-gray-600 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-white mb-2">No Photos Yet</h3>
        <p className="text-gray-400 text-lg mb-6">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <LazyImage
                src={photo.url}
                thumbnailUrl={photo.thumbnailUrl}
                alt={photo.altText || photo.title}
                className="absolute inset-0"
                onClick={() => setSelectedPhoto(photo)}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="p-3 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded-xl transition-colors"
                  title="View full size"
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirmDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  className="p-3 bg-red-500/20 backdrop-blur-xl hover:bg-red-500/40 rounded-xl transition-colors disabled:opacity-50"
                  title="Delete photo"
                >
                  {deletingId === photo.id ? (
                    <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5 text-red-400" />
                  )}
                </motion.button>
              </div>

              {/* Photo info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                {photo.size && (
                  <p className="text-gray-400 text-xs">{formatSize(photo.size)}</p>
                )}
              </div>

              {/* Status badge */}
              {photo.status === 'processing' && (
                <div className="absolute top-2 right-2 px-3 py-1.5 bg-blue-500/80 backdrop-blur-xl rounded-lg text-xs text-white font-medium">
                  Processing
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/20 rounded-2xl">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Delete Photo?</h3>
                  <p className="text-gray-400 text-sm">This action cannot be undone</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={deletingId === confirmDelete}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                >
                  {deletingId === confirmDelete ? 'Deleting...' : 'Delete Photo'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl max-h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.altText || selectedPhoto.title}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
              />

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 rounded-b-2xl">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedPhoto.title}</h3>
                <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                  {selectedPhoto.altText && (
                    <p className="flex items-center gap-2">
                      <FileImage className="w-4 h-4 text-cyan-400" />
                      {selectedPhoto.altText}
                    </p>
                  )}
                  {selectedPhoto.size && (
                    <p>{formatSize(selectedPhoto.size)}</p>
                  )}
                  {selectedPhoto.width && selectedPhoto.height && (
                    <p>{selectedPhoto.width} × {selectedPhoto.height}px</p>
                  )}
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    {formatDate(selectedPhoto.createdAt)}
                  </p>
                </div>
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white transition-all"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
