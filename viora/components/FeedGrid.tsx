'use client';

import { useEffect, useState, useCallback } from 'react';
import ImageCard from './ImageCard';

interface Image {
  id: string;
  imageUrl: string;
  prompt: string;
  hearts: number;
  createdAt: string;
}

export default function FeedGrid() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const fetchImages = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/feed?page=${pageNum}&limit=20`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch images');
      }

      const data = await response.json();
      const imageList = data.data?.images || data.images || [];
      const pages = data.data?.pagination?.totalPages || data.totalPages || 0;
      setImages((prev) => (pageNum === 1 ? imageList : [...prev, ...imageList]));
      setTotalPages(pages);
      setHasMore(pageNum < pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(1);
  }, [fetchImages]);

  const handleLike = async (id: string) => {
    try {
      const response = await fetch(`/api/like/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to like image');
      }

      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, hearts: img.hearts + 1 } : img
        )
      );
    } catch (err) {
      console.error('Error liking image:', err);
      throw err;
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage);
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (loading && (!images || images.length === 0)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading images...</p>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No images yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            {...image}
            onLike={handleLike}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {!hasMore && images && images.length > 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No more images to load
        </div>
      )}
    </div>
  );
}
