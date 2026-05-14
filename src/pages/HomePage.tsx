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
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1a2e"></stop>
            <stop offset="55%" stopColor="#162a16"></stop>
            <stop offset="100%" stopColor="#0c160c"></stop>
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#g1)"></rect>
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
    ),
  },
  {
    name: 'The Wedding',
    photos: 213,
    people: 34,
    color: 'orange',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c0f06"></stop>
            <stop offset="100%" stopColor="#0e0806"></stop>
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#g2)"></rect>
        <ellipse cx="100" cy="42" rx="65" ry="22" fill="rgba(255,160,50,0.05)"></ellipse>
        <rect x="0" y="110" width="200" height="10" fill="#0a0504"></rect>
        <rect x="84" y="62" width="8" height="48" fill="#0e0808"></rect>
        <circle cx="88" cy="57" r="8" fill="#0e0808"></circle>
        <rect x="100" y="66" width="7" height="44" fill="#0e0808"></rect>
        <circle cx="103" cy="62" r="7" fill="#0e0808"></circle>
        <polygon points="89,78 85,110 93,110 97,78" fill="#0e0808"></polygon>
        <path d="M40,110 L40,40 Q40,8 100,8 Q160,8 160,40 L160,110" fill="none" stroke="rgba(255,180,80,0.1)" strokeWidth="1.5"></path>
        <circle cx="56" cy="24" r="1.5" fill="rgba(255,220,100,0.55)"></circle>
        <circle cx="100" cy="10" r="1.5" fill="rgba(255,220,100,0.6)"></circle>
        <circle cx="144" cy="24" r="1.5" fill="rgba(255,220,100,0.55)"></circle>
      </svg>
    ),
  },
  {
    name: 'Mood Fest',
    photos: 156,
    people: 61,
    color: 'purple',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <rect width="200" height="120" fill="#06040f"></rect>
        <line x1="32" y1="0" x2="62" y2="120" stroke="rgba(168,85,247,0.14)" strokeWidth="28"></line>
        <line x1="100" y1="0" x2="100" y2="120" stroke="rgba(236,72,153,0.1)" strokeWidth="20"></line>
        <line x1="168" y1="0" x2="138" y2="120" stroke="rgba(168,85,247,0.12)" strokeWidth="24"></line>
        <rect x="0" y="94" width="200" height="26" fill="#030208"></rect>
        <circle cx="22" cy="105" r="3" fill="rgba(255,255,255,0.1)"></circle>
        <circle cx="50" cy="109" r="2" fill="rgba(255,255,255,0.07)"></circle>
        <circle cx="80" cy="103" r="3" fill="rgba(255,255,255,0.1)"></circle>
        <circle cx="110" cy="107" r="2" fill="rgba(255,255,255,0.07)"></circle>
        <circle cx="140" cy="104" r="3" fill="rgba(255,255,255,0.1)"></circle>
        <circle cx="170" cy="108" r="2" fill="rgba(255,255,255,0.07)"></circle>
      </svg>
    ),
  },
  {
    name: 'Goa Trip',
    photos: 134,
    people: 12,
    color: 'cyan',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stopColor="#0d1a2e"></stop>
            <stop offset="65%" stopColor="#162a16"></stop>
            <stop offset="60%" stopColor="#0c160c"></stop>
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#g4)"></rect>
        <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255,150,80,0.07)" strokeWidth="0.8"></line>
        <ellipse cx="100" cy="58" rx="42" ry="5" fill="rgba(255,150,50,0.05)"></ellipse>
        <rect x="0" y="60" width="200" height="60" fill="#050d18"></rect>
        <path d="M0,70 Q26,66 52,70 Q78,74 104,70 Q130,66 156,70 Q178,73 200,70" fill="none" stroke="rgba(100,160,220,0.08)" strokeWidth="1"></path>
        <polygon points="78,58 82,50 86,58" fill="rgba(0,0,0,0.5)"></polygon>
        <rect x="81" y="38" width="1.5" height="20" fill="rgba(0,0,0,0.4)"></rect>
        <rect x="0" y="100" width="200" height="20" fill="#0a0c08"></rect>
      </svg>
    ),
  },
  {
    name: 'Birthday Bash',
    photos: 72,
    people: 18,
    color: 'yellow',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <rect width="200" height="120" fill="#080503"></rect>
        <circle cx="28" cy="20" r="16" fill="rgba(255,180,50,0.06)"></circle>
        <circle cx="100" cy="16" r="20" fill="rgba(255,160,40,0.05)"></circle>
        <circle cx="172" cy="20" r="14" fill="rgba(255,180,50,0.06)"></circle>
        <rect x="52" y="82" width="96" height="34" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"></rect>
        <rect x="57" y="70" width="86" height="15" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></rect>
        <rect x="66" y="50" width="5" height="21" fill="rgba(255,255,255,0.1)"></rect>
        <rect x="82" y="46" width="5" height="25" fill="rgba(255,255,255,0.1)"></rect>
        <rect x="98" y="50" width="5" height="21" fill="rgba(255,255,255,0.1)"></rect>
        <rect x="114" y="48" width="5" height="23" fill="rgba(255,255,255,0.1)"></rect>
        <ellipse cx="68" cy="48" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"></ellipse>
        <ellipse cx="68" cy="45" rx="2" ry="4" fill="rgba(255,240,150,0.9)"></ellipse>
        <ellipse cx="84" cy="44" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"></ellipse>
        <ellipse cx="84" cy="41" rx="2" ry="4" fill="rgba(255,240,150,0.9)"></ellipse>
        <ellipse cx="100" cy="48" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"></ellipse>
        <ellipse cx="100" cy="45" rx="2" ry="4" fill="rgba(255,240,150,0.9)"></ellipse>
        <ellipse cx="116" cy="46" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"></ellipse>
        <ellipse cx="116" cy="43" rx="2" ry="4" fill="rgba(255,240,150,0.9)"></ellipse>
        <circle cx="68" cy="48" r="10" fill="rgba(255,180,30,0.07)"></circle>
        <circle cx="84" cy="44" r="10" fill="rgba(255,180,30,0.07)"></circle>
        <circle cx="100" cy="48" r="10" fill="rgba(255,180,30,0.07)"></circle>
        <circle cx="116" cy="46" r="10" fill="rgba(255,180,30,0.07)"></circle>
      </svg>
    ),
  },
  {
    name: 'NYE 2027',
    photos: 89,
    people: 22,
    color: 'pink',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050510"></stop>
            <stop offset="100%" stopColor="#0a0a22"></stop>
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#g6)"></rect>
        <rect x="16" y="50" width="16" height="70" fill="rgba(255,200,50,0.1)"></rect>
        <rect x="44" y="34" width="20" height="86" fill="rgba(255,200,50,0.08)"></rect>
        <rect x="76" y="20" width="26" height="100" fill="rgba(255,200,50,0.07)"></rect>
        <rect x="118" y="38" width="18" height="82" fill="rgba(255,200,50,0.09)"></rect>
        <rect x="150" y="46" width="16" height="74" fill="rgba(255,200,50,0.1)"></rect>
        <rect x="18" y="52" width="3" height="3" fill="rgba(255,220,100,0.5)"></rect>
        <rect x="46" y="36" width="3" height="3" fill="rgba(255,220,100,0.45)"></rect>
        <rect x="78" y="22" width="3.5" height="3.5" fill="rgba(255,220,100,0.4)"></rect>
        <rect x="86" y="34" width="3" height="3" fill="rgba(255,220,100,0.35)"></rect>
        <rect x="120" y="40" width="3" height="3" fill="rgba(255,220,100,0.45)"></rect>
        <rect x="152" y="48" width="3" height="3" fill="rgba(255,220,100,0.4)"></rect>
        <circle cx="38" cy="12" r="1.5" fill="rgba(255,255,255,0.4)"></circle>
        <circle cx="100" cy="8" r="2" fill="rgba(255,255,255,0.5)"></circle>
        <circle cx="160" cy="14" r="1.5" fill="rgba(255,255,255,0.3)"></circle>
        <circle cx="185" cy="8" r="1" fill="rgba(255,255,255,0.4)"></circle>
      </svg>
    ),
  },
];

export function HomePage() {
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photosSharedToday, setPhotosSharedToday] = useState(2924);
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
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 lg:px-12 h-14 sm:h-16 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5" >
          
          <svg width="28" height="28" viewBox="0 0 44 44" className="sm:w-8 sm:h-8">
  <rect x="2" y="2" width="40" height="40" rx="10" fill="#3b82f6"/>
  

  <path
    d="M29,15 
       Q24,11 18,13 
       Q12,15 11,22 
       Q12,29 18,31 
       Q24,33 29,29"
    fill="none"
    stroke="white"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
          <div>
            <div className="text-xs sm:text-sm font-extrabold tracking-[-0.04em] text-white leading-none cursor-pointer" onClick={() => navigate('/')}>CIRCLO</div>
            <div className="text-[7px] sm:text-[8px] tracking-[0.15em] text-white/30 uppercase mt-0.5">Collect every moment</div>
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


      {/* Main Content */}
      <main className="relative z-10 flex-1 grid lg:grid-cols-[460px_1fr] items-center px-4 sm:px-6 lg:px-12 gap-8 lg:gap-0 max-w-[1200px] mx-auto w-full py-8 lg:py-0">
        {/* Left Content */}
        <div className="pr-0 lg:pr-12 py-4 sm:py-8 lg:py-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/8 border border-blue-500/16 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-5 sm:mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_5px_rgba(59,130,246,1)]"></div>
            <span className="text-[9px] sm:text-[10px] text-blue-400/90 tracking-[0.1em] uppercase font-semibold whitespace-nowrap">
              Free · No account needed
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.05em] text-white leading-[1.02] mb-4 sm:mb-5">
            The photos you<br />almost never got.
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-[15px] text-white/38 leading-[1.85] mb-6 sm:mb-9 max-w-[360px]">
            Create an event. Share the link.<br />
            Everyone uploads. One gallery — yours to keep.
          </p>

          {/* Form Label */}
          <div className="text-[9px] sm:text-[10px] text-white/22 tracking-[0.1em] uppercase mb-2">
            What are you celebrating?
          </div>

          {/* Input Form */}
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
            
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </form>

          {/* Features */}
          <div className="flex items-center gap-3 sm:gap-5 mt-4 sm:mt-5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 13 13" className="sm:w-[13px] sm:h-[13px]">
                <circle cx="6.5" cy="6.5" r="5.5" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="1"></circle>
                <path d="M4,6.5 L5.5,8 L9,5" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="text-[10px] sm:text-[11px] text-white/28">No account</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 13 13" className="sm:w-[13px] sm:h-[13px]">
                <circle cx="6.5" cy="6.5" r="5.5" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="1"></circle>
                <path d="M4,6.5 L5.5,8 L9,5" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="text-[10px] sm:text-[11px] text-white/28">Free forever</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 13 13" className="sm:w-[13px] sm:h-[13px]">
                <circle cx="6.5" cy="6.5" r="5.5" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="1"></circle>
                <path d="M4,6.5 L5.5,8 L9,5" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="text-[10px] sm:text-[11px] text-white/28">Share via QR</span>
            </div>
            <div className="w-px h-3 bg-white/8 hidden sm:block"></div>
            <span className="text-[10px] sm:text-[11px] text-blue-500/60">
              {photosSharedToday.toLocaleString()} photos shared today
            </span>
          </div>
        </div>

        {/* Right Content - Card Grid */}
        <div className="py-4 sm:py-8 lg:py-12">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-[420px] mx-auto">
            {sampleEvents.map((event, index) => (
              <div
                key={index}
                className="rounded-lg sm:rounded-xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.6)] sm:shadow-[0_16px_40px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer"
              >
                <div className="overflow-hidden">
                  {event.icon}
                </div>
                <div className="bg-[#0d1421] border-t border-blue-500/8 px-2 sm:px-3 py-2 sm:py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-white/88">{event.name}</div>
                    <div className="text-[7px] sm:text-[8px] text-white/25 mt-0.5">
                      {event.photos} photos · {event.people} people
                    </div>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full bg-${event.color}-500 shadow-[0_0_5px_currentColor] flex-shrink-0`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
