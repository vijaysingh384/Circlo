import { useNavigate } from 'react-router-dom';
import CreepyButton from '../ui/CreepyButton';

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
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-3 sm:gap-0">
        
        {/* Left */}
        <div className="w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl uppercase font-bold truncate">{eventName}</h1>

          <div className="mt-1 flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
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
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          
          {isHost && (
            <div style={{ 
              '--cb-primary5': '#6366f1', 
              '--cb-primary6': '#4f46e5',
              '--cb-primary3': '#a5b4fc' 
            } as React.CSSProperties}>
              <CreepyButton onClick={onShowQR}>
                Share QR
              </CreepyButton>
            </div>
          )}

          {selectedPhotosCount > 0 && (
            <button
              onClick={onDownloadSelected}
              className={`${buttonClass} bg-indigo-600 hover:bg-indigo-500 text-xs sm:text-sm whitespace-nowrap`}
            >
              <span className="hidden sm:inline">Download Selected ({selectedPhotosCount})</span>
              <span className="sm:hidden">Selected ({selectedPhotosCount})</span>
            </button>
          )}

          {photoCount > 0 && (
            <button
              onClick={onDownloadAll}
              className={`${buttonClass} border border-white/5 bg-zinc-900 hover:bg-zinc-800 text-xs sm:text-sm whitespace-nowrap`}
            >
              <span className="hidden sm:inline">Download All</span>
              <span className="sm:hidden">All</span>
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className={`${buttonClass} border border-white/5 bg-zinc-900 hover:bg-zinc-800 text-xs sm:text-sm whitespace-nowrap`}
          >
            ← Back
          </button>
        </div>
      </div>
    </header>
  );
}