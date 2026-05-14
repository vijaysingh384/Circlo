import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../lib/api';
import { setHostToken, generateToken } from '../lib/tokens';

const sampleEvents = [
  {
    name: 'Manali Trip',
    photos: 47,
    people: 8,
    color: 'emerald',
    gradient: 'from-[#1a2521] to-[#0b1120]',
    icon: (
      <div className="absolute bottom-0 inset-x-0 h-16 flex items-end justify-center">
        <div className="w-full h-full opacity-20 flex gap-0 px-2">
          <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[40px] border-b-emerald-500"></div>
          <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[60px] border-b-emerald-600 -ml-8"></div>
          <div className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[50px] border-b-emerald-400 -ml-6"></div>
        </div>
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
  const [error, setError] = useState('');
  const [createdEvent, setCreatedEvent] = useState<{
    eventId: string;
    joinCode: string;
    name: string;
  } | null>(null);
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

    if (!eventName.trim()) {
      setError('Event name is required');
      return;
    }

    try {
      const joinCode = generateJoinCode();
      const hostTokenValue = generateToken();
      const response = await api.createEvent(eventName.trim(), joinCode);
      
      setHostToken(response.eventId, hostTokenValue);
      setCreatedEvent(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    }
  };

  const copyLink = () => {
    if (createdEvent) {
      const link = `${window.location.origin}/join?code=${createdEvent.joinCode}`;
      navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    }
  };

  const openEvent = () => {
    if (createdEvent) {
      navigate(`/event/${createdEvent.eventId}`);
    }
  };

  if (createdEvent) {
    const joinLink = `${window.location.origin}/join?code=${createdEvent.joinCode}`;

    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-8 shadow-2xl card-inner-shadow">
          <h2 className="text-3xl font-display font-bold text-center mb-8">
            Event Ready! 🎉
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl mb-4">
                <QRCodeSVG value={joinLink} size={200} />
              </div>
              <p className="text-sm text-gray-400 text-center">
                Scan to join
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">
                  Event Name
                </label>
                <p className="text-xl font-semibold text-gray-200">{createdEvent.name}</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">
                  Join Code
                </label>
                <p className="text-3xl font-mono font-bold text-blue-500">
                  {createdEvent.joinCode}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={copyLink}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-xs tracking-widest uppercase"
                >
                  Copy Share Link
                </button>
                <button
                  onClick={openEvent}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all border border-white/20 active:scale-95 text-xs tracking-widest uppercase"
                >
                  Open My Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-xs font-bold tracking-widest transition-all uppercase whitespace-nowrap active:scale-95"
                
              >
                Create →
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
