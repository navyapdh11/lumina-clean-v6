'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { PhotoGallery } from '@/components/admin/PhotoGallery';
import { PhotoUpload } from '@/components/admin/PhotoUpload';
import { Camera, Upload, Trash2 } from 'lucide-react';

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

export default function PhotoGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      if (data.photos) {
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleDelete = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos?id=${photoId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete photo');
    }
  };

  const handleUploadComplete = useCallback((photoIds: string[]) => {
    console.log('Upload complete:', photoIds);
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-20 pt-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2">
              Photo Gallery
            </h1>
            <p className="text-gray-400">
              Manage and organize your photo collection
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              {photos.length} photo{photos.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'gallery'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Camera className="w-5 h-5" />
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Upload className="w-5 h-5" />
            Upload
          </button>
        </div>

        {/* Content */}
        {activeTab === 'gallery' ? (
          <PhotoGallery
            photos={photos}
            onDelete={handleDelete}
            loading={loading}
            emptyMessage="No photos in your gallery yet. Upload some to get started!"
          />
        ) : (
          <PhotoUpload onUploadComplete={handleUploadComplete} />
        )}
      </div>
    </motion.div>
  );
}
