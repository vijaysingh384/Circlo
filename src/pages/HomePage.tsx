import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { setHostToken, generateToken } from '../lib/tokens';
import { validateEventName } from '../lib/validation';

const sampleEvents = [
  {
    name: 'Manali Trip',
    photos: 47,
    people: 8,
    color: 'emerald',
    gradient: 'from-[#1a2521] to-[#0b1120]',
    icon: (
      <div style={{ overflow: 'hidden' }}>
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1a2e"></stop>
              <stop offset="55%" stopColor="#162a16"></stop>
              <stop offset="100%" stopColor="#0c160c"></stop>
            </linearGradient>
          </defs>
          <rect width="300" height="120" fill="url(#g1)"></rect>
          <circle cx="165" cy="16" r="9" fill="rgba(255,240,200,0.1)"></circle>
          <circle cx="18" cy="10" r="1.5" fill="rgba(255,255,255,0.5)"></circle>
          <circle cx="52" cy="7" r="1" fill="rgba(255,255,255,0.4)"></circle>
          <circle cx="88" cy="14" r="1" fill="rgba(255,255,255,0.3)"></circle>
          <circle cx="125" cy="6" r="1.5" fill="rgba(255,255,255,0.4)"></circle>
          <polygon points="0,120 0,82 22,56 44,72 65,36 90,58 112,44 136,62 158,32 185,50 200,40 200,120" fill="#1c2e1c"></polygon>
          <polygon points="0,120 0,92 16,78 38,90 60,70 85,84 108,68 132,82 155,64 178,76 200,66 200,120" fill="#0f180f"></polygon>
          <polygon points="62,36 66,27 70,36" fill="rgba(255,255,255,0.14)"></polygon>
          <polygon points="155,32 159,23 163,32" fill="rgba(255,255,255,0.1)"></polygon>
        </svg>
      </div>
    ),
  },
  {
    name: 'The Wedding',
    photos: 213,
    people: 34,
    color: 'orange',
    gradient: 'from-[#251d1a] to-[#0b1120]',
    icon: (
      <div className="relative">
        <div className="w-24 h-16 border-2 border-orange-500/20 rounded-full border-b-0"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4">
          <div className="w-1 h-4 bg-orange-500/20 rounded-full"></div>
          <div className="w-1 h-4 bg-orange-500/20 rounded-full"></div>
        </div>
      </div>
    ),
  },
  {
    name: 'Mood Fest',
    photos: 156,
    people: 61,
    color: 'purple',
    gradient: 'from-[#1f1a25] to-[#0b1120]',
    icon: (
      <div className="flex gap-2 rotate-12">
        <div className="w-4 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="w-4 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="w-4 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
      </div>
    ),
  },
  {
    name: 'Goa Trip',
    photos: 134,
    people: 12,
    color: 'cyan',
    gradient: 'from-[#1a1f25] to-[#0b1120]',
    icon: (
      <>
        <div className="w-32 h-1 bg-cyan-500/10 blur-sm absolute bottom-8"></div>
        <div className="w-4 h-8 bg-cyan-500/20 rounded-full blur-md"></div>
      </>
    ),
  },
  {
    name: 'Birthday Bash',
    photos: 72,
    people: 18,
    color: 'yellow',
    gradient: 'from-[#25231a] to-[#0b1120]',
    icon: (
      <div className="flex items-end gap-1.5">
        <div className="w-2 h-10 bg-yellow-500/20 rounded-sm relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-500/40 blur-[2px]"></div>
        </div>
        <div className="w-2 h-14 bg-yellow-500/30 rounded-sm relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-500/60 blur-[2px]"></div>
        </div>
        <div className="w-2 h-8 bg-yellow-500/20 rounded-sm relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-500/40 blur-[2px]"></div>
        </div>
      </div>
    ),
  },
  {
    name: 'NYE 2024',
    photos: 89,
    people: 22,
    color: 'pink',
    gradient: 'from-[#251a1e] to-[#0b1120]',
    icon: (
      <>
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-24 h-24 border border-dashed border-pink-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
        </div>
        <div className="flex gap-1.5 items-end h-16">
          <div className="w-3 h-10 bg-pink-500/20"></div>
          <div className="w-3 h-14 bg-pink-500/30"></div>
          <div className="w-3 h-12 bg-pink-500/20"></div>
          <div className="w-3 h-8 bg-pink-500/10"></div>
        </div>
      </>
    ),
  },
];

export function HomePage() {
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photosSharedToday, setPhotosSharedToday] = useState(7172);
  const navigate = useNavigate();

  // Animated counter
  useEffect(() => {
    const interval = setInterval(() => {
      setPhotosSharedToday((prev) => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate event name
    const validation = validateEventName(eventName);
    if (!validation.valid) {
      setError(validation.error || 'Invalid event name');
      setLoading(false);
      return;
    }

    try {
      const joinCode = generateJoinCode();
      const hostTokenValue = generateToken();
      const response = await api.createEvent(eventName.trim(), joinCode);
      
      setHostToken(response.eventId, hostTokenValue);
      
      // Show loading state for a moment before navigating
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Auto-navigate to the event page
      navigate(`/event/${response.eventId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-6 lg:px-24 py-12">
      {/* Left Content */}
      <div className="flex-1 max-w-xl text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[10px] font-bold tracking-[0.15em] text-blue-400 uppercase">
            Free · No account needed
          </span>
        </div>

        <h2 className="text-5xl lg:text-7xl font-bold font-display tracking-tight leading-[1.1] mb-8">
          The photos you
          <br />
          almost never got.
        </h2>

        <div className="space-y-2 mb-12 text-lg lg:text-xl text-gray-400">
          <p>Create an event. Share the link.</p>
          <p>Everyone uploads. One gallery — yours to keep.</p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="relative group">
            <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3 text-left">
              What are you celebrating?
            </label>
            <div className="flex items-stretch bg-black border border-black rounded-2xl p-1.5 focus-within:border-blue-500/50 transition-colors">
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Manali Trip, Birthday Photos..."
                className="bg-black w-full px-5 outline-none text-white text-sm placeholder:text-gray-600"
              />
              <button
                type="submit"
                disabled={loading || !eventName.trim()}
                className={`px-6 py-3 rounded-xl text-xs font-bold tracking-widest transition-all uppercase whitespace-nowrap flex items-center gap-2 ${
                  loading || !eventName.trim()
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create →'
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </form>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[11px] font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No account</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Share via QR</span>
            </div>
          </div>

          <p className="text-xs text-blue-400/60 font-medium pt-4">
            {photosSharedToday.toLocaleString()} photos shared today
          </p>
        </div>
      </div>

      {/* Right Content - Card Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {sampleEvents.map((event, index) => (
          <div
            key={index}
            className="bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-colors group card-inner-shadow"
          >
            <div className={`h-32 bg-gradient-to-b ${event.gradient} relative overflow-hidden flex items-center justify-center`}>
              {event.icon}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-200">{event.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                  {event.photos} photos · {event.people} people
                </p>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full bg-${event.color}-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]`}></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
