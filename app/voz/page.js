import React from 'react';
import KaraokePlayer from '@/components/KaraokePlayer';

export const metadata = {
  title: 'Voz - AquaMundi',
  description: 'Contenido exclusivo.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function VozPage() {
  return (
    <div className="voz-container min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide the Sant Jordi banner specifically for this page */
        #sant-jordi-banner {
          display: none !important;
        }

        .voz-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: var(--font-geist-sans), system-ui, sans-serif;
          padding: 2rem;
        }

        .audio-card {
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
          backdrop-filter: blur(10px);
          text-align: center;
        }

        .vox-title {
          font-size: 1.25rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 2rem;
          color: #0f172a;
          text-transform: uppercase;
        }

        .audio-player-wrapper {
          width: 100%;
          margin-top: 1rem;
        }

        /* Customizing the default audio player a bit */
        audio {
          width: 100%;
          border-radius: 8px;
          outline: none;
        }

        .description {
          margin-top: 2rem;
          font-size: 0.85rem;
          color: #475569;
          font-weight: 300;
          line-height: 1.5;
        }
      `}} />

      {/* Aurora-inspired decorative background like other themed pages */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(147, 197, 253, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(196, 181, 253, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(249, 168, 212, 0.25) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(167, 243, 208, 0.22) 0%, transparent 50%)
            `,
          }}
        />

        <div className="absolute top-20 -right-20 w-80 h-80 rounded-full blur-3xl bg-gradient-to-br from-purple-400/20 via-violet-300/15 to-transparent" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full blur-3xl bg-gradient-to-br from-blue-400/20 via-cyan-300/15 to-transparent" />
        <div className="absolute bottom-24 right-12 w-64 h-64 rounded-full blur-3xl bg-gradient-to-br from-pink-400/20 via-rose-300/15 to-transparent" />
        <div className="absolute bottom-32 left-1/4 w-72 h-72 rounded-full blur-3xl bg-gradient-to-br from-emerald-400/18 via-teal-300/12 to-transparent" />
      </div>

      <div className="audio-card" style={{ maxWidth: '680px', padding: '3rem 2rem' }}>
        <h1 className="vox-title">Las Rosas de San Pedro</h1>

        <KaraokePlayer 
          audioSrc="/Matias%20-%20Cuento%20(Master%20Final).mp3" 
          vttSrc="/Matias-Cuento-es.vtt" 
        />

        <div className="text-center text-sm text-gray-600 mt-16 pt-8 pb-4">
          <p>
            Este mensaje se autodestruirá en 5, 4, 3, 2... Mentira. Las cosas bonitas son infinitas.
          </p>
        </div>
      </div>
    </div>
  );
}
