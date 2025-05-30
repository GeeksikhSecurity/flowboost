import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function useEngagementTracking() {
  const sessionRef = useRef<string | null>(null);

  const trackEvent = useCallback(async (eventType: string, eventData = {}) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // If we don't have a session ID yet, create one
      if (!sessionRef.current) {
        const { data: sessionData } = await supabase
          .from('user_sessions')
          .insert({
            user_id: session.user.id,
          })
          .select()
          .single();

        if (sessionData) {
          sessionRef.current = sessionData.id;
        }
      }

      // Log the event
      if (sessionRef.current) {
        await supabase.from('user_events').insert({
          user_id: session.user.id,
          session_id: sessionRef.current,
          event_type: eventType,
          event_data: eventData,
        });
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const initSession = async () => {
      try {
        await trackEvent('session_start');
      } catch (error) {
        console.error('Error starting session:', error);
      }
    };

    const cleanup = async () => {
      if (!isActive) return;
      isActive = false;

      try {
        if (sessionRef.current) {
          await trackEvent('session_end');
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase
              .from('user_sessions')
              .update({ ended_at: new Date().toISOString() })
              .eq('id', sessionRef.current);
          }
        }
      } catch (error) {
        console.error('Error ending session:', error);
      }
    };

    initSession();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('session_pause');
      } else {
        trackEvent('session_resume');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', cleanup);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [trackEvent]);

  return { trackEvent };
}