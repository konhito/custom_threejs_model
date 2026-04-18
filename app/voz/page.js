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

export default function VozPage() {
  return (
    // <div className="voz-container">
    //   <style dangerouslySetInnerHTML={{ __html: `
    //     /* Hide the Sant Jordi banner specifically for this page */
    //     #sant-jordi-banner {
    //       display: none !important;
    //     }

    //     /* Force dark background for the entire page */
    //     html.light, body {
    //       background-color: #050505 !important;
    //       color: #f5f5f5 !important;
    //       color-scheme: dark !important;
    //     }

    //     .voz-container {
    //       min-height: 100vh;
    //       width: 100%;
    //       display: flex;
    //       flex-direction: column;
    //       align-items: center;
    //       justify-content: center;
    //       background-color: #050505;
    //       font-family: var(--font-geist-sans), system-ui, sans-serif;
    //       padding: 2rem;
    //     }

    //     .audio-card {
    //       background: #111;
    //       border: 1px solid #333;
    //       border-radius: 16px;
    //       padding: 2.5rem;
    //       width: 100%;
    //       max-width: 480px;
    //       box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    //       text-align: center;
    //     }

    //     .vox-title {
    //       font-size: 1.25rem;
    //       font-weight: 300;
    //       letter-spacing: 0.1em;
    //       margin-bottom: 2rem;
    //       color: #ededed;
    //       text-transform: uppercase;
    //     }

    //     .audio-player-wrapper {
    //       width: 100%;
    //       margin-top: 1rem;
    //     }

    //     /* Customizing the default audio player a bit */
    //     audio {
    //       width: 100%;
    //       filter: invert(90%) hue-rotate(180deg);
    //       border-radius: 8px;
    //       outline: none;
    //     }

    //     .description {
    //       margin-top: 2rem;
    //       font-size: 0.85rem;
    //       color: #666;
    //       font-weight: 300;
    //       line-height: 1.5;
    //     }
    //   `}} />

    //   <div className="audio-card" style={{ maxWidth: '680px', padding: '3rem 2rem' }}>
    //     <h1 className="vox-title">Las Rosas de San Pedro</h1>

    //     <KaraokePlayer 
    //       audioSrc="/Matias%20-%20Cuento%20(Master%20Final).mp3" 
    //       vttSrc="/Matias-Cuento-es.vtt" 
    //     />

    //     <div className="text-center text-sm text-gray-600 mt-16 pt-8 pb-4">
    //       <p>
    //         Este mensaje se autodestruirá en 5, 4, 3, 2... Mentira. Las cosas bonitas son infinitas.
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div className="bg-gray-900 text-white flex items-center justify-center min-h-screen">
      <div className="text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-300 mb-8">
          We're working hard to launch something amazing. Stay tuned!
        </p>





        <div className="text-sm text-gray-500">

        </div>
      </div>
    </div >
  );
}
