"use client";
import { useState, useEffect } from 'react';
import {
  initializeSession,
  getCurrentSession,
  trackActivity as trackActivityUtil,
  updateSessionPreferences,
  getSessionPreferences,
  updateGDPRConsent,
  getSessionId,
} from '../lib/session';

/**
 * Hook for session management
 */
export function useSession() {
  const [session, setSession] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        // Get session ID (only in browser)
        setSessionId(getSessionId());
        
        const sessionData = await initializeSession();
        if (sessionData) {
          setSession(sessionData);
          
          // Load preferences
          try {
            const prefs = await getSessionPreferences();
            if (prefs) {
              setPreferences(prefs);
            }
          } catch (prefsError) {
            // Silently ignore preferences error
            console.warn('Could not load preferences:', prefsError.message);
          }
        }
      } catch (error) {
        // Silently handle network errors - app should still work without session
        console.warn('Session initialization skipped:', error.message);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    init();
  }, []);

  // Track page view on route change
  useEffect(() => {
    if (initialized && session?.tracking_enabled && typeof window !== 'undefined') {
      trackActivityUtil('page_view', {
        path: window.location.pathname,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  const updatePreferences = async (newPreferences) => {
    const updated = await updateSessionPreferences(newPreferences);
    if (updated) {
      setPreferences(updated);
    }
    return updated;
  };

  const updateConsent = async (consent, trackingEnabled = true) => {
    const updated = await updateGDPRConsent(consent, trackingEnabled);
    if (updated) {
      setSession(updated);
    }
    return updated;
  };

  const refreshSession = async () => {
    const sessionData = await getCurrentSession();
    if (sessionData) {
      setSession(sessionData);
    }
    return sessionData;
  };

  const track = async (activityType, activityData = {}) => {
    if (session?.tracking_enabled) {
      await trackActivityUtil(activityType, activityData);
    }
  };

  return {
    session,
    preferences,
    loading,
    initialized,
    updatePreferences,
    updateConsent,
    refreshSession,
    track,
    sessionId,
  };
}

