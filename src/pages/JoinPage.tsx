import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { setSessionToken, generateToken } from '../lib/tokens';

export function JoinPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState(searchParams.get('code') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setJoinCode(code.toUpperCase());
      // Auto-join if code is in URL
      handleJoin(code);
    }
  }, [searchParams]);

  const handleJoin = async (code?: string) => {
    const codeToUse = (code || joinCode).trim().toUpperCase();
    
    if (!codeToUse) {
      setError('Please enter a join code');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleJoin();
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Join Event</h1>
          <p className="text-gray-400">Enter the join code to access the event</p>
        </div>

        <div className="bg-[#0b1120] border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Join Code</label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl font-mono font-bold tracking-wider outline-none focus:border-blue-500 transition-colors uppercase"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !joinCode.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all"
            >
              {loading ? 'Joining...' : 'Join Event'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
