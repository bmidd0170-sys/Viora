interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function PromptInput({
  prompt,
  onPromptChange,
  onSubmit,
  isLoading,
}: PromptInputProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-900 dark:text-white"
        >
          Describe your image
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="A serene landscape with mountains and a lake at sunset..."
          disabled={isLoading}
          maxLength={1000}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none h-32"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Be descriptive for better results</span>
          <span>{prompt.length}/1000</span>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>
    </form>
  );
}
