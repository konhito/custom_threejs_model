// Sound utility for the card game
// Using free sounds from various sources

class SoundManager {
  constructor() {
    this.sounds = {};
    this.muted = false;
    this.volume = 0.5;
    this.ambientPlaying = false;
  }

  // Initialize sound files using free sounds from CDN
  init() {
    // Free sound URLs from various sources
    // These are royalty-free sounds from Pixabay, Freesound, and other free sources
    const soundPaths = {
      // Card flip - crisp satisfying card flip sound
      flip: "https://cdn.pixabay.com/audio/2022/03/15/audio_a3a196e10e.mp3", // retro click - good card flip
      
      // Petal collected - satisfying collect sound
      petal: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3", // bright collect
      
      // Minion revealed - dramatic negative sound
      minion: "https://cdn.pixabay.com/audio/2022/03/24/audio_2cae50221a.mp3", // dark hit
      
      // Guardian activated - power up sound
      guardian: "https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3", // power up chime
      
      // Guardian protects - shield block sound
      "guardian-protect": "https://cdn.pixabay.com/audio/2022/03/15/audio_bfeb87e995.mp3", // shield block
      
      // Flower complete - victory fanfare
      "flower-complete": "https://cdn.pixabay.com/audio/2022/03/15/audio_cd09024087.mp3", // victory fanfare
      
      // Petals converging - magical sparkle
      "petals-converge": "https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3", // magical chime
      
      // Flower appears - triumphant sound
      "flower-appear": "https://cdn.pixabay.com/audio/2022/03/15/audio_cd09024087.mp3", // triumph
      
      // Victory celebration - big win sound
      "victory": "https://cdn.pixabay.com/audio/2022/03/15/audio_cd09024087.mp3", // celebration
      
      // Button click - UI sound
      "button-click": "https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3", // UI click
      
      // Loading screen - unique startup sound
      "loading": "https://cdn.pixabay.com/audio/2022/03/15/audio_a5c77c6ff3.mp3", // startup chime
      
      // Ambient background - retro chiptune loop
      ambient: "https://cdn.pixabay.com/audio/2022/10/25/audio_3da91c5c54.mp3", // retro chiptune
    };

    // Preload sounds with better caching
    Object.entries(soundPaths).forEach(([key, path]) => {
      try {
        const audio = new Audio();
        audio.src = path;
        audio.volume = this.volume;
        audio.preload = "auto";
        audio.crossOrigin = "anonymous"; // Enable CORS
        
        // Force load immediately
        audio.load();
        
        // Create multiple cached instances for instant playback
        this.sounds[key] = [];
        for (let i = 0; i < 3; i++) {
          const cachedAudio = new Audio();
          cachedAudio.src = path;
          cachedAudio.volume = this.volume;
          cachedAudio.preload = "auto";
          cachedAudio.crossOrigin = "anonymous";
          cachedAudio.load();
          this.sounds[key].push(cachedAudio);
        }
        
        // Handle loading errors gracefully
        audio.addEventListener('error', (e) => {
          console.log(`Could not load sound: ${key}`);
        });
      } catch (error) {
        console.log(`Error initializing sound: ${key}`, error);
      }
    });
  }

  // Play a sound (optimized for instant playback)
  play(type) {
    if (this.muted) return;

    const soundArray = this.sounds[type];
    if (soundArray && Array.isArray(soundArray)) {
      try {
        // Find an available audio instance (not currently playing)
        let audioToPlay = soundArray.find(a => a.paused || a.ended || a.currentTime === 0);
        
        // If all are playing, use the first one and reset it
        if (!audioToPlay) {
          audioToPlay = soundArray[0];
          audioToPlay.currentTime = 0;
        }
        
        // Reset and play immediately
        audioToPlay.currentTime = 0;
        audioToPlay.volume = this.volume;
        
        const playPromise = audioToPlay.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Silently fail if audio can't play
            console.log(`Could not play sound: ${type}`, error.name);
          });
        }
      } catch (error) {
        console.log(`Error playing sound: ${type}`);
      }
    }
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((soundArray) => {
      if (Array.isArray(soundArray)) {
        soundArray.forEach((sound) => {
          if (sound) sound.volume = this.volume;
        });
      }
    });
  }

  // Toggle mute
  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Play ambient loop
  playAmbient() {
    if (this.muted || this.ambientPlaying) return;
    
    const ambientArray = this.sounds.ambient;
    if (ambientArray && Array.isArray(ambientArray) && ambientArray.length > 0) {
      try {
        const ambient = ambientArray[0];
        ambient.loop = true;
        ambient.volume = this.volume * 0.2; // Lower volume for ambient
        ambient.crossOrigin = "anonymous";
        
        const playPromise = ambient.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.ambientPlaying = true;
            })
            .catch((error) => {
              console.log("Could not play ambient sound", error.name);
            });
        }
      } catch (error) {
        console.log("Error playing ambient");
      }
    }
  }

  // Stop ambient loop
  stopAmbient() {
    const ambientArray = this.sounds.ambient;
    if (ambientArray && Array.isArray(ambientArray) && ambientArray.length > 0) {
      try {
        const ambient = ambientArray[0];
        ambient.pause();
        ambient.currentTime = 0;
        this.ambientPlaying = false;
      } catch (error) {
        console.log("Error stopping ambient");
      }
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


