/**
 * Loading Screen - Shows while images preload
 * PowerPoint-style: Don't show UI until everything is ready
 */

interface LoadingScreenProps {
  progress: number;
  loadedImages: number;
  totalImages: number;
}

export function LoadingScreen({ progress, loadedImages, totalImages }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">The Path</h1>
          <p className="text-gray-400">Church Presentation Software</p>
        </div>
        
        <div className="w-80 bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-400">
          Loading images... {loadedImages}/{totalImages}
        </p>
      </div>
    </div>
  );
}
