import type { Photo } from '../types';

interface PhotoGalleryProps {
  photos: Photo[];
  selectedPhotos: Set<string>;
  isHost: boolean;
  sessionToken: string | null;
  onToggleSelection: (photoId: string) => void;
  onDelete: (photoId: string) => void;
  onClearSelection: () => void;
}

export function PhotoGallery({
  photos,
  selectedPhotos,
  isHost,
  sessionToken,
  onToggleSelection,
  onDelete,
  onClearSelection,
}: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">No photos yet</h3>
        <p className="text-zinc-500">Be the first to upload and start building your gallery!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Gallery</h2>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">
            {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'} • Updated Live
          </p>
        </div>
        {selectedPhotos.size > 0 && (
          <button
            onClick={onClearSelection}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Clear Selection ({selectedPhotos.size})
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.photoId}
            className={`relative group rounded-xl overflow-hidden bg-zinc-900/50 border-2 transition-all hover:scale-[1.02] ${
              selectedPhotos.has(photo.photoId)
                ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                : 'border-transparent hover:border-zinc-700'
            }`}
          >
            <div className="aspect-square">
              <img
                src={photo.publicUrl}
                alt={photo.fileName}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-xs font-semibold truncate text-white">{photo.uploadedByName}</p>
                <p className="text-xs text-zinc-400">
                  {new Date(photo.uploadedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onToggleSelection(photo.photoId)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all backdrop-blur-sm ${
                  selectedPhotos.has(photo.photoId)
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                    : 'bg-black/50 text-white hover:bg-black/70'
                }`}
              >
                {selectedPhotos.has(photo.photoId) ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                  </svg>
                )}
              </button>
              
              {(isHost || photo.sessionToken === sessionToken) && (
                <button
                  onClick={() => onDelete(photo.photoId)}
                  className="w-8 h-8 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Selection Badge */}
            {selectedPhotos.has(photo.photoId) && (
              <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
