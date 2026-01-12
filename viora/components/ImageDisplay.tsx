'use client';

import Image from 'next/image';

interface ImageDisplayProps {
  imageUrl: string;
  prompt: string;
  onPublish: () => void;
  isPublished: boolean;
}

export default function ImageDisplay({
  imageUrl,
  prompt,
  onPublish,
  isPublished,
}: ImageDisplayProps) {
  return (
    <div className="space-y-6 border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/50">
      <div>
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Generated Image
        </h2>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={imageUrl}
            alt={prompt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Prompt Used
        </h3>
        <p className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded p-3 text-sm leading-relaxed">
          {prompt}
        </p>
      </div>

      {!isPublished ? (
        <button
          onClick={onPublish}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
        >
          Publish to Feed
        </button>
      ) : (
        <div className="w-full py-3 px-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-center font-medium">
          ✓ Published! Creating new one...
        </div>
      )}
    </div>
  );
}
