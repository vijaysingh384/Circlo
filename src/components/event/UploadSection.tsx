import type { RefObject } from 'react';
import { CloudUploadIcon } from '@/components/ui/CloudUploadIcon';
import checkimage from '@/assets/checklist.png';
import folderGif from '@/assets/image.gif';

interface UploadSectionProps {
  userName: string;
  onUserNameChange: (name: string) => void;
  uploading: boolean;
  uploadProgress: number;
  photoCount: number;
  eventJoinCode: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadSection({
  userName,
  onUserNameChange,
  uploading,
  uploadProgress,
  photoCount,
  eventJoinCode,
  fileInputRef,
  onFileSelect,
}: UploadSectionProps) {
  return (
    <div className="relative z-10 flex-1 grid lg:grid-cols-2 items-start px-4 sm:px-6 lg:px-12 gap-6 lg:gap-8 max-w-[1200px] mx-auto w-full mb-8">
      {/* Left: Instructions & Info */}
      <div className="space-y-4 sm:space-y-6">
        {/* Requirements Card */}
        <div className="bg-gradient-to-br from-[#1c1c21]/40 to-[#111114]/40 backdrop-blur-xl border border-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Requirements
          </h3>
          <ul className="space-y-3 sm:space-y-4">
            <li className="flex gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex items-center justify-center shrink-0">
                <img src={checkimage} alt="check" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs sm:text-sm text-zinc-300">Enter your name before uploading photos</span>
            </li>
            <li className="flex gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex items-center justify-center shrink-0">
                <img src={checkimage} alt="check" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs sm:text-sm text-zinc-300">Supported formats: JPG, PNG, GIF, WebP</span>
            </li>
            <li className="flex gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex items-center justify-center shrink-0">
                <img src={checkimage} alt="check" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs sm:text-sm text-zinc-300">Maximum file size: 5MB per photo</span>
            </li>
            <li className="flex gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex items-center justify-center shrink-0">
                <img src={checkimage} alt="check" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs sm:text-sm text-zinc-300">Upload multiple photos at once</span>
            </li>
          </ul>
        </div>

        {/* Event Info Card */}
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-indigo-900/10 border border-indigo-500/10">
          <h4 className="text-xs sm:text-sm font-semibold text-indigo-300 mb-2">Event Details</h4>
          <p className="text-[10px] sm:text-xs text-zinc-400 mb-3">Share this event with friends to collect all your memories in one place.</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Total Photos:</span>
              <span className="text-white font-semibold">{photoCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Join Code:</span>
              <span className="text-indigo-400 font-mono font-bold">{eventJoinCode}</span>
            </div>
          </div>
        </div>

        {/* Your Name Input */}
        <div className="bg-gradient-to-br from-[#1c1c21]/40 to-[#111114]/40 backdrop-blur-xl border border-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
          <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2 sm:mb-3">Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => onUserNameChange(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder:text-zinc-600"
          />
          <p className="text-[10px] sm:text-xs text-zinc-500 mt-2">This will be shown with your uploaded photos</p>
        </div>
      </div>

      {/* Right: Upload Area */}
      <div className="space-y-4 sm:space-y-6">
        {/* Dropzone */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFileSelect}
            disabled={uploading || !userName.trim()}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            id="file-upload"
          />
          <div
            className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-all relative overflow-hidden group ${
              uploading || !userName.trim()
                ? 'border-zinc-700 bg-zinc-900/20 cursor-not-allowed'
                : 'border-zinc-700 hover:border-indigo-500 cursor-pointer hover:bg-zinc-900/50'
            }`}
            style={{
              backgroundImage: uploading || !userName.trim() 
                ? "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%234B5563' stroke-width='2' stroke-dasharray='8%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")"
                : "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%234B5563' stroke-width='2' stroke-dasharray='8%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")"
            }}
          >
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            {uploading ? (
              <div className="relative z-10 w-full max-w-md">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-900 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <CloudUploadIcon 
                    size={window.innerWidth < 640 ? 24 : 32}
                    color="#6366f1"
                    isAnimated={true}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Uploading... {uploadProgress}%</h3>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-[10px] sm:text-xs text-zinc-500">Please wait while we upload your photos</p>
              </div>
            ) : (
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-900 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <CloudUploadIcon 
                    size={window.innerWidth < 640 ? 24 : 32}
                    color="#6366f1"
                    isAnimated={true}
                  />
                </div>
                <h3 className="text-base sm:text-xl font-bold mb-2">
                  {userName.trim() ? (
                    <>
                      <span className="hidden sm:inline">Drag & drop or <span className="text-indigo-400">browse files</span></span>
                      <span className="sm:hidden">Tap to <span className="text-indigo-400">upload photos</span></span>
                    </>
                  ) : (
                    'Enter your name first'
                  )}
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm max-w-xs mx-auto px-4">
                  {userName.trim() 
                    ? 'Support JPG, PNG, GIF or WebP formats. Maximum file size is 5MB per file.'
                    : 'Please enter your name in the panel above before uploading photos'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Stats */}
        {!uploading && photoCount > 0 && (
          <div className="bg-gradient-to-br from-[#1c1c21]/40 to-[#111114]/40 backdrop-blur-xl border border-white/5 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <img src={folderGif} alt="success" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Gallery Updated</p>
                  <p className="text-xs text-zinc-500">{photoCount} photos in this event</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-zinc-500 font-mono">Live</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
