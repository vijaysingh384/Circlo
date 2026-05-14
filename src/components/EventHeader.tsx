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

const buttonClass =
  'px-4 py-2 rounded-xl text-sm font-medium transition-all';

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
    <header className="sticky top-0 z-10 py-0 border-b border-white/5 bg-[#0b1120]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Left */}
        <div>
          <h1 className="text-2xl uppercase font-bold">{eventName}</h1>

          <div className="mt-1 flex items-center gap-4 text-sm text-gray-400">
            <p>
              {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
            </p>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-zinc-500">Live</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          
          {isHost && (
            <button
              onClick={onShowQR}
              className={`${buttonClass} border border-indigo-500/30 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30`}
            >
              Share QR
            </button>
          )}

          {selectedPhotosCount > 0 && (
            <button
              onClick={onDownloadSelected}
              className={`${buttonClass} bg-indigo-600 hover:bg-indigo-500`}
            >
              Download Selected ({selectedPhotosCount})
            </button>
          )}

          {photoCount > 0 && (
            <button
              onClick={onDownloadAll}
              className={`${buttonClass} border border-white/5 bg-zinc-900 hover:bg-zinc-800`}
            >
              Download All
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className={`${buttonClass} border border-white/5 bg-zinc-900 hover:bg-zinc-800`}
          >
            ← Back
          </button>
        </div>
      </div>
    </header>
  );
}