"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* ─────────────────────────────────────────────
   Lightbox overlay for a single photo
   ───────────────────────────────────────────── */
function Lightbox({ photo, onClose, onPrev, onNext, current, total }) {
  // close on Escape, navigate with arrows
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* close button */}
      <button
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      {/* prev */}
      <button
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 md:left-6"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous"
      >
        ‹
      </button>

      {/* image */}
      <img
        src={photo.src}
        alt={photo.alt}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* next */}
      <button
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 md:right-6"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next"
      >
        ›
      </button>

      {/* caption & counter */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-5 pt-12 text-center">
        <p className="text-sm text-white/80" style={{ fontFamily: "Manrope, sans-serif" }}>{photo.alt}</p>
        <p className="mt-1 text-xs text-white/50">{current + 1} / {total}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main gallery component (exported)
   ───────────────────────────────────────────── */
export default function EventGallery({ photos, videos }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const galleryRef = useRef(null);

  const openLightbox = useCallback((i) => setActiveIdx(i), []);
  const closeLightbox = useCallback(() => setActiveIdx(null), []);
  const nextPhoto = useCallback(() => setActiveIdx((i) => (i + 1) % photos.length), [photos.length]);
  const prevPhoto = useCallback(() => setActiveIdx((i) => (i - 1 + photos.length) % photos.length), [photos.length]);

  const showMore = () => setVisibleCount((c) => Math.min(c + 12, photos.length));

  const visiblePhotos = photos.slice(0, visibleCount);

  return (
    <>
      {/* ── Photo gallery ── */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-16" ref={galleryRef}>
        <div className="text-center">
          <h2
            className="text-2xl font-bold text-slate-900 sm:text-3xl"
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            📸 Galería de fotos
          </h2>
          <p className="mt-2 text-slate-500" style={{ fontFamily: "Rubik, sans-serif" }}>
            {photos.length} fotografías del evento · Haz clic para ampliar
          </p>
        </div>

        {/* masonry-style grid */}
        <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4">
          {visiblePhotos.map((photo, i) => (
            <button
              key={i}
              className="group relative mb-3 block w-full overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
              onClick={() => openLightbox(i)}
              aria-label={`Abrir foto ${i + 1}: ${photo.alt}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {/* hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 px-3 pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs font-medium text-white drop-shadow-lg line-clamp-2" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {photo.alt}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* show more button */}
        {visibleCount < photos.length && (
          <div className="mt-8 text-center">
            <button
              onClick={showMore}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-6 py-3 text-sm font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-100/40"
              style={{ fontFamily: "Comfortaa, cursive" }}
            >
              Ver más fotos ({photos.length - visibleCount} restantes)
            </button>
          </div>
        )}
      </section>

      {/* ── Video section ── */}
      {videos && videos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 md:px-6 pb-16">
          <div className="text-center">
            <h2
              className="text-2xl font-bold text-slate-900 sm:text-3xl"
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              🎬 Vídeos del evento
            </h2>
            <p className="mt-2 text-slate-500" style={{ fontFamily: "Rubik, sans-serif" }}>
              {videos.length} vídeos capturados durante la jornada
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, i) => (
              <div key={i} className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/40">
                <div className="relative aspect-video w-full bg-slate-100">
                  <video
                    src={video.src}
                    controls
                    preload="metadata"
                    playsInline
                    className="h-full w-full object-cover"
                    poster=""
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800" style={{ fontFamily: "Archivo, sans-serif" }}>
                    {video.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Lightbox ── */}
      {activeIdx !== null && (
        <Lightbox
          photo={photos[activeIdx]}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
          current={activeIdx}
          total={photos.length}
        />
      )}
    </>
  );
}
