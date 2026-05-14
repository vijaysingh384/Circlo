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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-[#1c1c21] to-[#111114] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Share Event</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-2xl mb-6 flex justify-center shadow-lg">
          <QRCodeSVG value={joinLink} size={200} />
        </div>
        
        <div className="space-y-4">
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
            <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-widest font-semibold">
              Join Code
            </label>
            <p className="text-3xl font-mono font-bold text-indigo-400">{joinCode}</p>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
            <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-widest font-semibold">
              Share Link
            </label>
            <p className="text-sm text-zinc-400 break-all font-mono">{joinLink}</p>
          </div>
          
          <button
            onClick={onCopyLink}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Share Link
          </button>
        </div>
      </div>
    </div>
  );
}
