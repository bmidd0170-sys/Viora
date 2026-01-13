import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="sticky top-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black/80 backdrop-blur-md z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            ✨ Viora
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              Generate
            </Link>
            <Link
              href="/feed"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              Feed
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
