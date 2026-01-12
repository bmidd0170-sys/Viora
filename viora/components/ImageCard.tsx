'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageCardProps {
  id: string;
  imageUrl: string;
  prompt: string;
  hearts: number;
  createdAt: string;
  onLike: (id: string) => Promise<void>;
}

export default function ImageCard({
  id,
  imageUrl,
  prompt,
  hearts,
  createdAt,
  onLike,
}: ImageCardProps) {
  const [liked, setLiked] = useState(false);
  const [heartCount, setHeartCount] = useState(hearts);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liked || liking) return;

    setLiking(true);
    try {
      await onLike(id);
      setLiked(true);
      setHeartCount((prev) => prev + 1);
    } finally {
      setLiking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-lg/20 transition-shadow">
      <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800">
        <Image
          src={imageUrl}
          alt={prompt}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
          {prompt}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(createdAt)}
          </span>

          <button
            onClick={handleLike}
            disabled={liked || liking}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <span className={liked ? 'text-red-500' : ''}>♥</span>
            {heartCount}
          </button>
        </div>
      </div>
    </div>
  );
}
