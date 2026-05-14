import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Event, UseEventReturn } from '../types';

export function useEvent(eventId: string | undefined): UseEventReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await api.getEvent(eventId);
        
        if (!cancelled) {
          setEvent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load event');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return { event, loading, error };
}
