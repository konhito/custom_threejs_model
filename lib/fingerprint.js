/**
 * Advanced Device Fingerprinting for Session Tracking
 * Generates a unique fingerprint based on browser/device characteristics
 * WITHOUT login requirements
 */

/**
 * Get canvas fingerprint
 * Canvas rendering is slightly different on each device/browser
 */
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    // Draw text with specific font
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Nahiara 🌸', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Nahiara 🌸', 4, 17);
    
    // Get canvas data
    return canvas.toDataURL();
  } catch (e) {
    return '';
  }
}

/**
 * Get WebGL fingerprint
 * GPU and graphics driver information
 */
function getWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return '';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return '';
    
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    
    return `${vendor}~${renderer}`;
  } catch (e) {
    return '';
  }
}

/**
 * Get available fonts
 */
function getFonts() {
  try {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testFonts = [
      'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
      'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS',
      'Impact', 'Lucida Console'
    ];
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    const baseSizes = {};
    baseFonts.forEach(font => {
      ctx.font = `72px ${font}`;
      const metrics = ctx.measureText('mmmmmmmmmmlli');
      baseSizes[font] = metrics.width;
    });
    
    const availableFonts = [];
    testFonts.forEach(font => {
      let detected = false;
      baseFonts.forEach(baseFont => {
        ctx.font = `72px ${font}, ${baseFont}`;
        const metrics = ctx.measureText('mmmmmmmmmmlli');
        if (metrics.width !== baseSizes[baseFont]) {
          detected = true;
        }
      });
      if (detected) availableFonts.push(font);
    });
    
    return availableFonts.join(',');
  } catch (e) {
    return '';
  }
}

/**
 * Get audio fingerprint
 */
function getAudioFingerprint() {
  try {
    if (!window.AudioContext && !window.webkitAudioContext) return '';
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    const gainNode = context.createGain();
    const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
    
    gainNode.gain.value = 0; // Mute
    oscillator.type = 'triangle';
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start(0);
    
    return context.sampleRate.toString();
  } catch (e) {
    return '';
  }
}

/**
 * Get screen information
 */
function getScreenInfo() {
  return {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    devicePixelRatio: window.devicePixelRatio || 1,
  };
}

/**
 * Get timezone
 */
function getTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    return new Date().getTimezoneOffset().toString();
  }
}

/**
 * Get browser plugins
 */
function getPlugins() {
  try {
    if (!navigator.plugins) return '';
    
    const plugins = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
      plugins.push(navigator.plugins[i].name);
    }
    return plugins.join(',');
  } catch (e) {
    return '';
  }
}

/**
 * Get platform and hardware info
 */
function getPlatformInfo() {
  return {
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: navigator.deviceMemory || 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
  };
}

/**
 * Simple hash function
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate comprehensive device fingerprint
 * @returns {Promise<string>} Unique device fingerprint hash
 */
export async function generateDeviceFingerprint() {
  try {
    const components = {
      // Canvas fingerprint (most unique)
      canvas: simpleHash(getCanvasFingerprint()),
      
      // WebGL fingerprint
      webgl: getWebGLFingerprint(),
      
      // Screen info
      screen: JSON.stringify(getScreenInfo()),
      
      // Timezone
      timezone: getTimezone(),
      
      // Language
      language: navigator.language || navigator.userLanguage,
      languages: (navigator.languages || []).join(','),
      
      // Platform
      platform: JSON.stringify(getPlatformInfo()),
      
      // User agent
      userAgent: navigator.userAgent,
      
      // Available fonts
      fonts: getFonts(),
      
      // Plugins
      plugins: getPlugins(),
      
      // Audio context
      audio: getAudioFingerprint(),
      
      // Do Not Track
      doNotTrack: navigator.doNotTrack || '',
      
      // Cookie enabled
      cookieEnabled: navigator.cookieEnabled,
      
      // Storage
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
    };
    
    // Combine all components
    const fingerprintString = Object.values(components).join('|');
    
    // Use crypto.subtle if available for better hashing
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(fingerprintString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback to simple hash
    return simpleHash(fingerprintString);
  } catch (error) {
    console.error('Error generating fingerprint:', error);
    // Fallback fingerprint
    return simpleHash(navigator.userAgent + Date.now().toString());
  }
}

/**
 * Get or create device fingerprint
 * Caches in localStorage for consistency
 */
export async function getDeviceFingerprint() {
  try {
    // Try to get existing fingerprint from storage
    const stored = localStorage.getItem('device_fingerprint');
    const storedTime = localStorage.getItem('device_fingerprint_time');
    
    // If fingerprint exists and is less than 30 days old, use it
    if (stored && storedTime) {
      const age = Date.now() - parseInt(storedTime);
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      
      if (age < thirtyDays) {
        return stored;
      }
    }
    
    // Generate new fingerprint
    const fingerprint = await generateDeviceFingerprint();
    
    // Store it
    localStorage.setItem('device_fingerprint', fingerprint);
    localStorage.setItem('device_fingerprint_time', Date.now().toString());
    
    return fingerprint;
  } catch (error) {
    console.error('Error getting device fingerprint:', error);
    // Return a session-based fallback
    if (!sessionStorage.getItem('temp_fingerprint')) {
      sessionStorage.setItem('temp_fingerprint', simpleHash(Date.now().toString() + Math.random().toString()));
    }
    return sessionStorage.getItem('temp_fingerprint');
  }
}

/**
 * Get comprehensive device info for analytics
 */
export function getDeviceInfo() {
  return {
    screen: getScreenInfo(),
    platform: getPlatformInfo(),
    timezone: getTimezone(),
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
  };
}

