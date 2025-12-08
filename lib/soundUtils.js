// Sound utility for the card game
// Using Web Audio API to generate sounds programmatically

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.muted = false;
    this.volume = 0.3;
    this.ambientPlaying = false;
    this.ambientOscillator = null;
    this.ambientOscillators = [];
    this.ambientGain = null;
    this.ambientTimeouts = [];
  }

  // Initialize Audio Context
  init() {
    if (typeof window === 'undefined') return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  }

  // Helper to create and play a tone
  playTone(frequency, duration, type = 'sine', volumeMultiplier = 1) {
    if (!this.audioContext || this.muted) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(this.volume * volumeMultiplier, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.log('Error playing tone');
    }
  }

  // Play multiple tones as a chord
  playChord(frequencies, duration, type = 'sine', volumeMultiplier = 1) {
    frequencies.forEach(freq => {
      this.playTone(freq, duration, type, volumeMultiplier / frequencies.length);
    });
  }

  // Play a sequence of notes
  playSequence(notes, noteType = 'sine') {
    if (!this.audioContext || this.muted) return;

    let time = this.audioContext.currentTime;
    notes.forEach(({ frequency, duration, delay = 0 }) => {
      setTimeout(() => {
        this.playTone(frequency, duration, noteType);
      }, delay);
    });
  }

  // Play a sound by type
  play(type) {
    if (this.muted || !this.audioContext) return;

    switch (type) {
      case 'flip':
        // Quick flip sound
        this.playTone(400, 0.1, 'square', 0.3);
        setTimeout(() => this.playTone(500, 0.05, 'square', 0.2), 50);
        break;

      case 'petal':
        // Beautiful flower petal sound - ascending chime
        this.playSequence([
          { frequency: 523.25, duration: 0.15, delay: 0 },    // C5
          { frequency: 659.25, duration: 0.15, delay: 80 },   // E5
          { frequency: 783.99, duration: 0.2, delay: 160 },   // G5
        ], 'sine');
        break;

      case 'minion':
        // Ominous low sound
        this.playTone(100, 0.3, 'sawtooth', 0.5);
        setTimeout(() => this.playTone(80, 0.2, 'sawtooth', 0.4), 100);
        break;

      case 'guardian':
        // Heroic ascending sound
        this.playSequence([
          { frequency: 392, duration: 0.15, delay: 0 },      // G4
          { frequency: 523.25, duration: 0.15, delay: 100 }, // C5
          { frequency: 659.25, duration: 0.2, delay: 200 },  // E5
          { frequency: 783.99, duration: 0.3, delay: 300 },  // G5
        ], 'triangle');
        break;

      case 'guardian-protect':
        // Shield/protection sound
        this.playChord([400, 500, 600], 0.3, 'sine', 0.6);
        setTimeout(() => this.playChord([450, 550, 650], 0.2, 'sine', 0.4), 150);
        break;

      case 'flower-complete':
        // Major chord celebration
        this.playChord([523.25, 659.25, 783.99], 0.5, 'sine', 0.8); // C-E-G chord
        setTimeout(() => {
          this.playChord([587.33, 739.99, 880], 0.6, 'sine', 0.7); // D-F#-A chord
        }, 300);
        break;

      case 'petals-converge':
        // Magical converging sound - descending
        this.playSequence([
          { frequency: 1046.50, duration: 0.1, delay: 0 },   // C6
          { frequency: 987.77, duration: 0.1, delay: 50 },   // B5
          { frequency: 880, duration: 0.1, delay: 100 },     // A5
          { frequency: 783.99, duration: 0.1, delay: 150 },  // G5
          { frequency: 659.25, duration: 0.2, delay: 200 },  // E5
        ], 'sine');
        break;

      case 'flower-appear':
        // Sparkly magical appearance
        this.playChord([1046.50, 1318.51, 1567.98], 0.4, 'sine', 0.6); // C6-E6-G6
        break;

      case 'victory':
        // Epic victory fanfare
        this.playSequence([
          { frequency: 523.25, duration: 0.2, delay: 0 },    // C5
          { frequency: 659.25, duration: 0.2, delay: 150 },  // E5
          { frequency: 783.99, duration: 0.2, delay: 300 },  // G5
          { frequency: 1046.50, duration: 0.5, delay: 450 }, // C6
        ], 'triangle');
        // Add chord at the end
        setTimeout(() => {
          this.playChord([523.25, 659.25, 783.99, 1046.50], 0.8, 'sine', 0.8);
        }, 600);
        break;

      case 'button-click':
        // Simple click
        this.playTone(800, 0.05, 'sine', 0.4);
        setTimeout(() => this.playTone(1000, 0.05, 'sine', 0.3), 30);
        break;

      case 'loading':
        // Ascending loading sound
        this.playSequence([
          { frequency: 440, duration: 0.1, delay: 0 },
          { frequency: 554.37, duration: 0.1, delay: 100 },
          { frequency: 659.25, duration: 0.15, delay: 200 },
        ], 'sine');
        break;

      default:
        // Generic beep
        this.playTone(440, 0.1, 'sine', 0.3);
        break;
    }
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.ambientGain) {
      this.ambientGain.gain.value = this.volume * 0.1;
    }
  }

  // Toggle mute
  toggleMute() {
    this.muted = !this.muted;
    
    if (this.muted && this.ambientPlaying) {
      this.stopAmbient();
    }
    
    return this.muted;
  }

  // Play ambient loop - fun game background music
  playAmbient() {
    if (this.muted || this.ambientPlaying || !this.audioContext) return;

    try {
      // Create a fun, playful melody pattern instead of static tones
      this.ambientGain = this.audioContext.createGain();
      this.ambientGain.gain.value = this.volume * 0.15;
      this.ambientGain.connect(this.audioContext.destination);

      // Store oscillators for cleanup
      this.ambientOscillators = [];
      
      // Fun melody pattern - a gentle, repeating arpeggio
      // C major scale: C, D, E, F, G, A, B, C
      const melody = [
        261.63, // C4
        293.66, // D4
        329.63, // E4
        349.23, // F4
        392.00, // G4
        440.00, // A4
        493.88, // B4
        523.25, // C5
      ];
      
      // Play a gentle, repeating pattern
      const playMelodyLoop = () => {
        if (!this.ambientPlaying || this.muted) return;
        
        // Play each note in sequence with slight overlap
        melody.forEach((freq, index) => {
          const timeoutId = setTimeout(() => {
            if (!this.ambientPlaying || this.muted) return;
            
            // Create oscillator for this note
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'triangle'; // Softer than square, more playful than sine
            osc.frequency.value = freq;
            
            // Envelope: quick attack, gentle decay
            const now = this.audioContext.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(this.volume * 0.12, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            
            osc.connect(gain);
            gain.connect(this.ambientGain);
            
            osc.start(now);
            osc.stop(now + 0.4);
            
            this.ambientOscillators.push({ osc, gain });
          }, index * 200); // 200ms between notes
          
          this.ambientTimeouts.push(timeoutId);
        });
        
        // Loop the melody every 2.5 seconds
        const loopTimeout = setTimeout(() => {
          if (this.ambientPlaying && !this.muted) {
            playMelodyLoop();
          }
        }, 2500);
        
        this.ambientTimeouts.push(loopTimeout);
      };
      
      // Start the melody loop
      playMelodyLoop();
      
      // Also add a gentle bass line for depth
      const bassOsc = this.audioContext.createOscillator();
      const bassGain = this.audioContext.createGain();
      
      bassOsc.type = 'sine';
      bassOsc.frequency.value = 130.81; // C3 (one octave lower)
      
      // Gentle pulsing bass
      const bassPattern = () => {
        if (!this.ambientPlaying || this.muted) return;
        
        const now = this.audioContext.currentTime;
        bassGain.gain.setValueAtTime(this.volume * 0.03, now);
        bassGain.gain.exponentialRampToValueAtTime(this.volume * 0.06, now + 0.8);
        bassGain.gain.exponentialRampToValueAtTime(this.volume * 0.03, now + 1.6);
        
        const bassTimeout = setTimeout(() => {
          if (this.ambientPlaying && !this.muted) {
            bassPattern();
          }
        }, 1600);
        
        this.ambientTimeouts.push(bassTimeout);
      };
      
      bassGain.gain.value = this.volume * 0.03;
      bassOsc.connect(bassGain);
      bassGain.connect(this.ambientGain);
      bassOsc.start();
      
      // Store bass oscillator for cleanup
      this.ambientOscillators.push({ osc: bassOsc, gain: bassGain });
      
      // Start bass pattern
      bassPattern();
      
      this.ambientPlaying = true;
      } catch (error) {
      console.log("Could not play ambient sound");
    }
  }

  // Stop ambient loop
  stopAmbient() {
    try {
      this.ambientPlaying = false;
      
      // Clear all timeouts
      if (this.ambientTimeouts && Array.isArray(this.ambientTimeouts)) {
        this.ambientTimeouts.forEach(timeoutId => {
          clearTimeout(timeoutId);
        });
        this.ambientTimeouts = [];
      }
      
      // Stop all oscillators
      if (this.ambientOscillators && Array.isArray(this.ambientOscillators)) {
        this.ambientOscillators.forEach(({ osc, gain }) => {
          try {
            if (osc && osc.stop) {
              osc.stop();
            }
            if (gain) {
              gain.disconnect();
            }
          } catch (e) {
            // Ignore errors when stopping
          }
        });
        this.ambientOscillators = [];
      }
      
      // Clean up old single oscillator if it exists
      if (this.ambientOscillator) {
        try {
          this.ambientOscillator.stop();
        } catch (e) {
          // Ignore
        }
        this.ambientOscillator = null;
      }
      
      this.ambientGain = null;
    } catch (error) {
      console.log("Error stopping ambient");
    }
  }
}

// Create singleton instance
const soundManager = new SoundManager();

// Initialize on first import (only in browser)
if (typeof window !== "undefined") {
  soundManager.init();
}

export default soundManager;


