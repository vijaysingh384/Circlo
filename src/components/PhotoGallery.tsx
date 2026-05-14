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
  if (!photos.length) {
    return (
      <div className="py-24 text-center">
        <h3 className="mb-2 text-xl font-bold">No photos yet</h3>
        <p className="text-zinc-500">
          Upload photos to start the gallery
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Gallery</h2>

          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">
            {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
          </p>
        </div>

        {selectedPhotos.size > 0 && (
          <button
            onClick={onClearSelection}
            className="text-sm text-zinc-400 hover:text-white"
          >
            Clear ({selectedPhotos.size})
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => {
          const isSelected = selectedPhotos.has(photo.photoId);

          return (
            <div
              key={photo.photoId}
              className={`group relative overflow-hidden rounded-xl border bg-zinc-900/50 transition hover:scale-[1.02] ${
                isSelected
                  ? 'border-indigo-500'
                  : 'border-transparent hover:border-zinc-700'
              }`}
            >
              {/* Image - Use thumbnail for gallery, full image on click */}
              <img
                src={photo.thumbnailUrl || photo.publicUrl}
                alt={photo.fileName}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 w-full p-3 text-white">
                  <p className="truncate text-xs font-semibold">
                    {photo.uploadedByName}
                  </p>

                  <p className="text-xs text-zinc-300">
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                
                <button
                  onClick={() => onToggleSelection(photo.photoId)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-black/60 text-white'
                  }`}
                >
                  {isSelected ? '✓' : '+'}
                </button>

                {(isHost || photo.sessionToken === sessionToken) && (
                  <button
                    onClick={() => onDelete(photo.photoId)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/80 text-white hover:bg-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute left-2 top-2 rounded bg-indigo-600 px-2 py-1 text-xs font-bold text-white">
                  Selected
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}