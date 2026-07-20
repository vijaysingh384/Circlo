import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  joinCode: string;
  joinLink: string;
  onCopyLink: () => void;
}

export function QRCodeModal({
  isOpen,
  onClose,
  joinCode,
  joinLink,
  onCopyLink,
}: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6">
      
      <div className="w-full max-w-md rounded-xl sm:rounded-2xl border border-white/10 bg-[#111114] p-5 sm:p-6">
        
        {/* Header */}
        <div className="mb-5 sm:mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold">Share Event</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* QR */}
        <div className="mb-5 sm:mb-6 flex justify-center rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5">
          <QRCodeSVG value={joinLink} size={window.innerWidth < 640 ? 160 : 200} />
        </div>

        {/* Join Code */}
        <div className="mb-4 rounded-lg sm:rounded-xl bg-zinc-900 p-3 sm:p-4">
          <p className="mb-2 text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500">
            Join Code
          </p>

          <p className="font-mono text-2xl sm:text-3xl font-bold text-indigo-400">
            {joinCode}
          </p>
        </div>

        {/* Share Link */}
        <div className="mb-5 sm:mb-6 rounded-lg sm:rounded-xl bg-zinc-900 p-3 sm:p-4">
          <p className="mb-2 text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500">
            Share Link
          </p>

          <p className="break-all text-xs sm:text-sm text-zinc-400">
            {joinLink}
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onCopyLink}
          className="w-full rounded-lg sm:rounded-xl bg-indigo-600 py-2.5 sm:py-3 text-sm sm:text-base font-semibold hover:bg-indigo-500"
        >
          Copy Share Link
        </button>
      </div>
    </div>
  );
}