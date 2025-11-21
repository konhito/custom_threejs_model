// Session management utilities for frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.aquamundi.org/api';

/**
 * Get session ID from cookie or localStorage
 */
export function getSessionId() {
  if (typeof window === 'undefined') return null;
  
  // Try to get from cookie (set by backend)
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(c => c.trim().startsWith('session_id='));
  if (sessionCookie) {
    return sessionCookie.split('=')[1];
  }
  
  // Fallback to localStorage
  return localStorage.getItem('nahiara_session_id');
}

/**
 * Store session ID
 */
export function setSessionId(sessionId) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nahiara_session_id', sessionId);
}

/**
 * Generate device fingerprint
 */
export function generateDeviceFingerprint() {
  if (typeof window === 'undefined') return null;

  const components = [
    navigator.userAgent || '',
    navigator.language || '',
    navigator.languages?.join(',') || '',
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.platform || '',
    navigator.hardwareConcurrency || '',
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < components.length; i++) {
    const char = components.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16);
}

/**
 * Initialize session - call this on app load
 */
export async function initializeSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/current`, {
      method: 'GET',
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        const sessionId = data.data.session_id;
        setSessionId(sessionId);
        return data.data;
      }
    }
  } catch (error) {
    console.error('Error initializing session:', error);
  }
  
  return null;
}

/**
 * Track activity
 */
export async function trackActivity(activityType, activityData = {}) {
  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    await fetch(`${API_BASE_URL}/sessions/activities`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activity_type: activityType,
        activity_data: activityData,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : null,
      }),
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
    // Don't throw - activity tracking shouldn't break the app
  }
}

/**
 * Update session preferences
 */
export async function updateSessionPreferences(preferences) {
  const sessionId = getSessionId();
  if (!sessionId) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/sessions/preferences`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error updating preferences:', error);
  }
  
  return null;
}

/**
 * Get session preferences
 */
export async function getSessionPreferences() {
  const sessionId = getSessionId();
  if (!sessionId) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/sessions/preferences`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error getting preferences:', error);
  }
  
  return null;
}

/**
 * Update GDPR consent
 */
export async function updateGDPRConsent(consent, trackingEnabled = true) {
  const sessionId = getSessionId();
  if (!sessionId) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/sessions/current`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gdpr_consent: consent,
        tracking_enabled: trackingEnabled,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error updating GDPR consent:', error);
  }
  
  return null;
}

/**
 * Delete session (GDPR - right to be forgotten)
 */
export async function deleteSession() {
  const sessionId = getSessionId();
  if (!sessionId) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/sessions/current`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      localStorage.removeItem('nahiara_session_id');
      return true;
    }
  } catch (error) {
    console.error('Error deleting session:', error);
  }
  
  return false;
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/current`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (error) {
    console.error('Error getting session:', error);
  }
  
  return null;
}





