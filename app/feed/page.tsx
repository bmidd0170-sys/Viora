import Navigation from '../../components/Navigation';
import FeedGrid from '../../components/FeedGrid';

export const metadata = {
  title: 'Feed | Viora',
  description: 'View all generated images from the community',
};

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Image Feed
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover amazing AI-generated images from the community
            </p>
          </div>

          <FeedGrid />
        </div>
      </main>
    </div>
  );
}
