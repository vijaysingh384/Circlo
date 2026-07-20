import { useState } from 'react';
import { useNavigate } from 'react-router';
import { validateEventName } from '../lib/validation';
import { generateCode } from '@/utils/string';
import { setHostToken, generateToken } from '../lib/tokens';
import { api } from '../services/api';
import { delay } from '../utils/delay';

export function useCreateEvent() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState('');
  const navigate = useNavigate();

  function generateJoinCode() {
    return generateCode(6);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

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

      // Small delay so the "Creating..." button state is visible before we jump away.
      await delay(1000);

      navigate(`/event/${response.eventId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      setLoading(false);
    }
  }

  return {
    eventName,
    setEventName,
    error,
    loading,
    handleSubmit,
  };
}

export default useCreateEvent;