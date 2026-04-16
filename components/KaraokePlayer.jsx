"use client";
import React, { useEffect, useRef, useState } from 'react';

// Simple standalone VTT parser
function parseVTT(vttString) {
  const lines = vttString.split('\n');
  const cues = [];
  let currentCue = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('WEBVTT') || line.startsWith('NOTE')) continue;

    if (line.includes('-->')) {
      const parts = line.split('-->');
      const start = parseTime(parts[0].trim());
      const end = parseTime(parts[1].trim());
      currentCue = { start, end, text: '' };
      cues.push(currentCue);
    } else if (currentCue) {
      if (line.match(/^cue-\d+$/)) continue; // ignore cue ids
      currentCue.text += (currentCue.text ? ' ' : '') + line;
    }
  }
  return cues;
}

function parseTime(timeStr) {
  const parts = timeStr.split(':');
  let seconds = 0;
  if (parts.length === 3) {
    seconds += parseFloat(parts[0]) * 3600;
    seconds += parseFloat(parts[1]) * 60;
    seconds += parseFloat(parts[2]);
  } else if (parts.length === 2) {
    seconds += parseFloat(parts[0]) * 60;
    seconds += parseFloat(parts[1]);
  }
  return seconds;
}

export default function KaraokePlayer({ audioSrc, vttSrc }) {
  const audioRef = useRef(null);
  const scrollRef = useRef(null);
  const [cues, setCues] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch(vttSrc)
      .then((res) => res.text())
      .then((text) => setCues(parseVTT(text)))
      .catch((err) => console.error("Error loading VTT:", err));
  }, [vttSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, []);

  // Find active cue index for auto-scrolling
  const activeIndex = cues.findIndex(cue => currentTime >= cue.start && currentTime <= cue.end);

  useEffect(() => {
    if (activeIndex >= 0 && scrollRef.current) {
      const activeEl = scrollRef.current.querySelector(`[data-index="${activeIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="audio-player-wrapper mb-8 w-full">
        <audio ref={audioRef} controls controlsList="nodownload" className="w-full" crossOrigin="anonymous">
          <source src={audioSrc} type="audio/mpeg" />
          <track label="Español" kind="subtitles" srcLang="es" src={vttSrc} default />
          Tu navegador no soporta el audio.
        </audio>
      </div>

      <div 
        ref={scrollRef}
        className="transcript space-y-3 mt-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar text-center"
        style={{ fontSize: '1.25rem', lineHeight: '1.6', fontWeight: '300' }}
      >
        {cues.length === 0 && <p className="text-gray-500 animate-pulse">Cargando transcripción...</p>}
        {cues.map((cue, index) => {
          const isActive = currentTime >= cue.start && currentTime <= cue.end;
          const isPast = currentTime > cue.end;

          return (
            <div
              key={index}
              data-index={index}
              className={`transition-all duration-300 ease-in-out cursor-pointer hover:opacity-100 ${
                isActive 
                  ? 'text-white opacity-100 font-normal drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' 
                  : isPast 
                    ? 'text-gray-400 opacity-60' 
                    : 'text-gray-600 opacity-40'
              }`}
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = cue.start;
                  audioRef.current.play();
                }
              }}
            >
              {cue.text}
            </div>
          );
        })}
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
