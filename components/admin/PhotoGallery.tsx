'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Loader2, ImageOff, ZoomIn, AlertCircle } from 'lucide-react';

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

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={imgRef} className={className} onClick={onClick}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/40 text-gray-400">
          <ImageOff className="w-12 h-12 mb-2" />
          <span className="text-xs">Failed to load</span>
        </div>
      )}

      {isInView && !hasError && (
        <img
          src={thumbnailUrl || src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
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

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
        <ImageOff className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all"
            >
              <LazyImage
                src={photo.url}
                thumbnailUrl={photo.thumbnailUrl}
                alt={photo.altText || photo.title}
                className="absolute inset-0"
                onClick={() => setSelectedPhoto(photo)}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setSelectedPhoto(photo)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="View full size"
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={() => setConfirmDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete photo"
                >
                  {deletingId === photo.id ? (
                    <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5 text-red-400" />
                  )}
                </button>
              </div>

              {/* Status badge */}
              {photo.status === 'processing' && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500/80 rounded-lg text-xs text-white">
                  Processing...
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-white">Delete Photo?</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this photo? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
              >
                {deletingId === confirmDelete ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lightbox modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.altText || selectedPhoto.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <p className="text-white font-medium">{selectedPhoto.title}</p>
              {selectedPhoto.altText && (
                <p className="text-gray-400 text-sm mt-1">{selectedPhoto.altText}</p>
              )}
              {selectedPhoto.size && (
                <p className="text-gray-500 text-xs mt-1">{formatSize(selectedPhoto.size)}</p>
              )}
            </div>

            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
