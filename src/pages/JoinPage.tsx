import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { setSessionToken, generateToken } from '../lib/tokens';

export function JoinPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [joinCode, setJoinCode] = useState(searchParams.get('code') || '');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setJoinCode(code.toUpperCase());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const codeToUse = joinCode.trim().toUpperCase();
    const nameToUse = userName.trim();
    
    if (!nameToUse) {
      setError('Please enter your name');
      return;
    }

    if (!codeToUse) {
      setError('Please enter a join code');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.joinEvent(codeToUse);
      
      // Generate and store session token
      const sessionToken = generateToken();
      setSessionToken(response.eventId, sessionToken);
      
      // Navigate to event page
      navigate(`/event/${response.eventId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#030712] text-white selection:bg-blue-500/30">
      {/* Decorative Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-5 md:px-12 md:py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <svg
  className="w-6 h-6 text-white"
  viewBox="0 0 24 24"
  fill="none"
>
  <path
    d="M16 7
       Q13 4 9.5 5.5
       Q6 7 6 12
       Q6 17 9.5 18.5
       Q13 20 16 17"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
</svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-widest uppercase cursor-pointer " onClick={() => navigate('/')}>Circlo</span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-wider">COLLECT EVERY MOMENT</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 text-xs font-semibold hover:bg-white/5 transition-colors tracking-wide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          CREATE EVENT
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[480px]">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-[11px] font-semibold text-blue-400 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Join an event
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              You're invited.
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Enter your name and the event code<br className="hidden md:block" /> to join the shared gallery.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase px-1">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder=""
                className="w-full h-14 px-5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-zinc-600 outline-none focus:border-white/20 focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 transition-all"
                disabled={loading}
              />
            </div>

            {/* Event Code Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase px-1">
                Event Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="E.G. W27YXY"
                maxLength={6}
                className="w-full h-14 px-5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-zinc-600 outline-none focus:border-white/20 focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-lg tracking-widest uppercase"
                disabled={loading}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 px-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-[1.15em] h-[1.15em] rounded border border-white/20 bg-transparent cursor-pointer accent-blue-500"
                disabled={loading}
              />
              <label htmlFor="terms" className="text-[11px] md:text-xs text-zinc-500 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-blue-500/80 hover:text-blue-400 underline underline-offset-2">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-500/80 hover:text-blue-400 underline underline-offset-2">
                  Privacy Policy
                </a>
                . I confirm I own or have permission to share any photos I upload.
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !userName.trim() || !joinCode.trim() || !agreedToTerms}
              className="w-full h-14 bg-zinc-900 border border-white/5 text-zinc-500 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  JOINING...
                </>
              ) : (
                <>
                  JOIN EVENT
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-zinc-600 font-medium">
              No account needed • Your photos stay yours
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 tracking-widest uppercase transition-colors">
            No Install
          </a>
          <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 tracking-widest uppercase transition-colors">
            Instant Gallery
          </a>
          <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 tracking-widest uppercase transition-colors">
            Share Via QR
          </a>
          <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 tracking-widest uppercase transition-colors">
            Terms
          </a>
          <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 tracking-widest uppercase transition-colors">
            Privacy
          </a>
        </nav>
        <div className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
          © 2025 Circlo
        </div>
      </footer>
    </div>
  );
}
