'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ImageDisplay from '@/components/ImageDisplay';
import PromptInput from '@/components/PromptInput';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [usedPrompt, setUsedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [published, setPublished] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setImageUrl(null);
    setPublished(false);

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate image');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      setUsedPrompt(prompt);
      setPublished(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setError('');

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: usedPrompt,
          imageUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to publish image');
      }

      setPublished(true);
      // Reset form after successful publish
      setTimeout(() => {
        setPrompt('');
        setImageUrl(null);
        setUsedPrompt('');
        setPublished(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish image');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Generate Images
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Describe your image and let AI create it for you
            </p>
          </div>

          <PromptInput
            prompt={prompt}
            onPromptChange={setPrompt}
            onSubmit={handleGenerate}
            isLoading={loading}
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-400">Generating your image...</p>
              </div>
            </div>
          )}

          {imageUrl && (
            <ImageDisplay
              imageUrl={imageUrl}
              prompt={usedPrompt}
              onPublish={handlePublish}
              isPublished={published}
            />
          )}
        </div>
      </main>
    </div>
  );
}
