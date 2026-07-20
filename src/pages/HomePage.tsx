import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sampleEvents from '@/components/data/sampleEvents';
import { useCreateEvent } from '@/hooks/UseCreateEvent';

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 13 13" className="sm:w-[13px] sm:h-[13px]">
      <circle cx="6.5" cy="6.5" r="5.5" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="1" />
      <path d="M4,6.5 L5.5,8 L9,5" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 44 44" className="sm:w-8 sm:h-8">
      <rect x="2" y="2" width="40" height="40" rx="10" fill="#3b82f6" />
      <path
        d="M29,15 Q24,11 18,13 Q12,15 11,22 Q12,29 18,31 Q24,33 29,29"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

sampleEvents

interface EventCardProps {
  name: string;
  icon: React.ReactNode;
  photos: number;
  people: number;
  color: string;
}

function EventCard({ name, photos, people, color, icon }: EventCardProps ){
  return (
    <div className="rounded-lg sm:rounded-xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.6)] sm:shadow-[0_16px_40px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer">
      <div className="overflow-hidden">{icon}</div>
      <div className="bg-[#0d1421] border-t border-blue-500/8 px-2 sm:px-3 py-2 sm:py-2.5 flex items-center justify-between">
        <div>
          <div className="text-[9px] sm:text-[10px] font-bold text-white/88">{name}</div>
          <div className="text-[7px] sm:text-[8px] text-white/25 mt-0.5">
            {photos} photos · {people} people
          </div>
        </div>
        <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 shadow-[0_0_5px_currentColor] flex-shrink-0`} />
      </div>
    </div>
  );
}

export function HomePage() {
  const { eventName, setEventName, error, loading, handleSubmit } = useCreateEvent();
  const [photosSharedToday, setPhotosSharedToday] = useState(2924);
  const navigate = useNavigate();

  // Fake "live" counter — ticks up by a small random amount every 3 seconds,
  // just to make the page feel alive.
  useEffect(() => {
    const interval = setInterval(() => {
      setPhotosSharedToday((prev) => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Random 6-character code guests will type in to join the event, e.g. "K3F9QZ".
  // Now using utility function from utils/string.ts


useCreateEvent

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      {/* ---------------- Navbar ---------------- */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 lg:px-12 h-14 sm:h-16 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Logo />
          <div>
            <div
              className="text-xs sm:text-sm font-extrabold tracking-[-0.04em] text-white leading-none cursor-pointer"
              onClick={() => navigate('/')}
            >
              CIRCLO
            </div>
            <div className="text-[7px] sm:text-[8px] tracking-[0.15em] text-white/30 uppercase mt-0.5">
              Collect every moment
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-7">
          <button
            onClick={() => navigate('/join')}
            className="text-[10px] sm:text-[11px] text-white/30 tracking-[0.1em] uppercase cursor-pointer hover:text-white/50 transition-colors"
          >
            Join
          </button>
          <div className="w-px h-3 sm:h-4 bg-white/8"></div>
          <button
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (input) input.focus();
            }}
            className="relative overflow-hidden bg-blue-500 border-none text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-md text-[10px] sm:text-[11px] font-bold tracking-[0.08em] uppercase cursor-pointer hover:bg-blue-600 transition-colors"
          >
            Create
          </button>
        </div>
      </nav>

      {/* ---------------- Main content ---------------- */}
      <main className="relative z-10 flex-1 grid animate-fadeUp lg:grid-cols-[460px_1fr] items-center px-4 sm:px-6 lg:px-12 gap-8 lg:gap-0 max-w-[1200px] mx-auto w-full py-8 lg:py-0">
        {/* Left side: headline + create-event form */}
        <div className="pr-0 lg:pr-12 py-4 sm:py-8 lg:py-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/8 border border-blue-500/16 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-5 sm:mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_5px_rgba(59,130,246,1)]"></div>
            <span className="text-[9px] sm:text-[10px] text-blue-400/90 tracking-[0.1em] uppercase font-semibold whitespace-nowrap">
              Free · No account needed
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.05em] text-white leading-[1.02] mb-4 sm:mb-5">
            The photos you<br />almost never got.
          </h1>

          <p className="text-sm sm:text-[15px] text-white/38 leading-[1.85] mb-6 sm:mb-9 max-w-[360px]">
            Create an event. Share the link.<br />
            Everyone uploads. One gallery — yours to keep.
          </p>

          <div className="text-[9px] sm:text-[10px] text-white/22 tracking-[0.1em] uppercase mb-2">
            What are you celebrating?
          </div>

          <form onSubmit={handleSubmit} className="max-w-[400px]">
            <div className="flex rounded-lg overflow-hidden border border-white/8 transition-colors focus-within:border-white/20">
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Manali Trip, Birthday..."
                className="flex-1 px-3 sm:px-5 py-2.5 sm:py-3.5 bg-white/[0.03] border-none text-white text-xs sm:text-[13px] outline-none min-w-0"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !eventName.trim()}
                className="bg-white/5 border-l border-white/8 text-white/25 px-3 sm:px-5 py-2.5 sm:py-3.5 text-[9px] sm:text-[10px] font-extrabold tracking-[0.1em] uppercase cursor-pointer disabled:cursor-not-allowed whitespace-nowrap transition-all hover:bg-white/10 hover:text-white/50 disabled:hover:bg-white/5 disabled:hover:text-white/25"
              >
                {loading ? 'Creating...' : 'Create →'}
              </button>
            </div>

            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </form>

          <div className="flex items-center gap-3 sm:gap-5 mt-4 sm:mt-5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <CheckIcon />
              <span className="text-[10px] sm:text-[11px] text-white/28">No account</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckIcon />
              <span className="text-[10px] sm:text-[11px] text-white/28">Free forever</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckIcon />
              <span className="text-[10px] sm:text-[11px] text-white/28">Share via QR</span>
            </div>
            <div className="w-px h-3 bg-white/8 hidden sm:block"></div>
            <span className="text-[10px] sm:text-[11px] text-blue-500/60">
              {photosSharedToday.toLocaleString()} photos shared today
            </span>
          </div>
        </div>

        {/* Right side: sample event card grid */}
        <div className="py-4 sm:py-8 lg:py-12">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-[420px] mx-auto">
            {sampleEvents.map((event) => (
              <EventCard key={event.name} {...event} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}