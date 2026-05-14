import { useNavigate } from 'react-router-dom';

interface EventHeaderProps {
  eventName: string;
  photoCount: number;
  isHost: boolean;
  selectedPhotosCount: number;
  onShowQR: () => void;
  onDownloadAll: () => void;
  onDownloadSelected: () => void;
}

export function EventHeader({
  eventName,
  photoCount,
  isHost,
  selectedPhotosCount,
  onShowQR,
  onDownloadAll,
  onDownloadSelected,
}: EventHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="border-b border-white/5 bg-[#0b1120]/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{eventName}</h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-gray-400">
                {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-zinc-500 font-mono">Live</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isHost && (
              <button
                onClick={onShowQR}
                className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-sm font-medium transition-all text-indigo-300 hover:text-indigo-200"
              >
                Share QR
              </button>
            )}
            
            {photoCount > 0 && (
              <>
                {selectedPhotosCount > 0 && (
                  <button
                    onClick={onDownloadSelected}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20"
                  >
                    Download {selectedPhotosCount} Selected
                  </button>
                )}
                <button
                  onClick={onDownloadAll}
                  className="px-4 py-2 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-xl text-sm font-medium transition-all"
                >
                  Download All
                </button>
              </>
            )}
            
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-xl text-sm font-medium transition-all"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
