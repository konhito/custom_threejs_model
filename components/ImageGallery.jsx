"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Shuffle from "./Shuffle";
import TiltedCard from "./TiltedCard";
import { BookDetailsSidePanel } from "./BookDetailsSidePanel";

const mysterySpine = "/books/Book-Cover---Vol7-Spanish-spine.png";

const mysteryCover = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='1400' viewBox='0 0 900 1400'><defs><radialGradient id='glow' cx='50%25' cy='45%25' r='60%25'><stop stop-color='%23fbbf24' stop-opacity='0.9' offset='0%25'/><stop stop-color='%23b45309' stop-opacity='0.15' offset='65%25'/><stop stop-color='%230f172a' stop-opacity='0.85' offset='100%25'/></radialGradient><linearGradient id='bg' x1='0' x2='0' y1='0' y2='1'><stop stop-color='%230b1224' offset='0%25'/><stop stop-color='%231b2a4a' offset='50%25'/><stop stop-color='%230b1224' offset='100%25'/></linearGradient></defs><rect width='900' height='1400' fill='url(%23bg)'/><circle cx='450' cy='630' r='520' fill='url(%23glow)'/><text x='450' y='720' text-anchor='middle' font-family='Cormorant, serif' font-size='420' fill='%23fef08a' font-weight='700'>?</text><text x='450' y='980' text-anchor='middle' font-family='Cormorant, serif' font-size='64' fill='%23f8fafc' opacity='0.8'>Mystery Volume</text></svg>`;

const ImageGallery = () => {
  const images = [
    {
      spineSrc: "/books/Book-Cover---Vol1-Spanish-Spine.png",
      coverSrc: "/books/1.png",
      alt: "Nahiara y los Guardianes de las Flores - Tomo I",
      code: "Tomo I",
      tomeNumber: 1,
      isComingSoon: false,
    },
    {
      spineSrc: "/books/Book-Cover---Vol2-Spine.png",
      coverSrc: "/books/2.png",
      alt: "Nahiara y los Guardianes de las Flores - Tomo II",
      code: "Tomo II",
      tomeNumber: 2,
      isComingSoon: true,
    },
    {
      spineSrc: "/books/Book-Cover---Vol3-spine.png",
      coverSrc: "/books/3.png",
      alt: "Nahiara y los Guardianes de las Flores - Tomo III",
      code: "Tomo III",
      tomeNumber: 3,
      isComingSoon: true,
    },
    {
      spineSrc: "/books/Book-Cover---Vol4-Spine.png",
      coverSrc: "/books/4.png",
      alt: "Nahiara y los Guardianes de las Flores - Tomo IV",
      code: "Tomo IV",
      tomeNumber: 4,
      isComingSoon: true,
    },
    {
      spineSrc: "/books/Book-Cover---Vol5-Spine.png",
      coverSrc: "/books/5.png",
      alt: "Nahiara y los Guardianes de las Flores - Tomo V",
      code: "Tomo V",
      tomeNumber: 5,
      isComingSoon: true,
    },
    {
      spineSrc: "/books/Book-Cover---Vol6-Spine.png",
      coverSrc: "/books/6.png",
      alt: "Nahiara y los Guardianes de las Flores - Tomo VI",
      code: "Tomo VI",
      tomeNumber: 6,
      isComingSoon: true,
    },
    {
      spineSrc: "/books/Book-Cover---Vol7-Spanish-spine.png",
      coverSrc: "/books/7.png",
      alt: "Nahiara y los Guardianes de las Flores - Tomo VII",
      code: "Tomo VII",
      tomeNumber: 7,
      isComingSoon: true,
    },
    {
      spineSrc: mysterySpine,
      coverSrc: mysteryCover,
      alt: "Mystery Volume",
      code: "¿?",
      tomeNumber: null,
      isComingSoon: false,
    },
  ];
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Close modal on Escape for both desktop and mobile keyboards
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex]);

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (selectedIndex !== null && isCoarsePointer) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [selectedIndex, isCoarsePointer]);

  return (
    <>
      <div className="flex flex-col h-full w-full items-center justify-center overflow-hidden bg-white py-8 sm:py-12 md:py-16">
        {/* Books Title with Shuffle effect */}
        <Shuffle
          text="Books"
          tag="h2"
          shuffleDirection="right"
          duration={1}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover={true}
          respectReducedMotion={true}
          loop={true}
          loopDelay={0}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-12 text-center notranslate px-4"
          translate="no"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        />
        <HoverExpand_001
          className=""
          images={images}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          isCoarsePointer={isCoarsePointer}
        />
      </div>

      {/* Modal for All Books */}
      <AnimatePresence>
        {selectedIndex !== null && images[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-2 sm:px-4"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
              className={`relative w-full ${
                images[selectedIndex]?.tomeNumber 
                  ? "max-w-6xl" 
                  : "max-w-3xl"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Books with Tome Number: TiltedCard + Side Panel */}
              {images[selectedIndex]?.tomeNumber ? (
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[85vh] relative">
                  {/* Close Button - Inside modal, top right */}
                  <motion.button
                    onClick={() => setSelectedIndex(null)}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 transition-all touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center group"
                    aria-label="Close modal"
                    whileHover={{ 
                      rotate: 90,
                      scale: 1.1 
                    }}
                    whileTap={{ 
                      rotate: 90,
                      scale: 0.95 
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 17
                    }}
                  >
                    <motion.svg 
                      className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </motion.svg>
                  </motion.button>
                  
                  {/* TiltedCard on Left */}
                  <div 
                    className="w-full lg:w-2/5 p-6 sm:p-8 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 flex-shrink-0 relative overflow-hidden"
                  >
                    {/* Tiled text pattern background */}
                    <div 
                      className="absolute inset-0 opacity-[0.03] pointer-events-none select-none"
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        color: 'rgba(16, 185, 129, 0.4)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, 60px)',
                        gridTemplateRows: 'repeat(auto-fill, 60px)',
                        gap: '0',
                        padding: '20px',
                        lineHeight: '60px',
                        textAlign: 'center',
                      }}
                    >
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div key={i} style={{ 
                          transform: `rotate(${Math.random() * 360}deg)`,
                          opacity: Math.random() * 0.5 + 0.2,
                        }}>
                          {['COMING SOON', 'PRÓXIMAMENTE', 'SOON', '2025'][i % 4]}
                        </div>
                      ))}
                    </div>
                    
                    {/* COMING SOON Badge Above TiltedCard - Small Button Style */}
                    {images[selectedIndex]?.isComingSoon && (
                      <div className="mb-3 flex items-center justify-center relative z-10">
                        <span className="text-xs sm:text-sm font-bold tracking-wider px-3 py-1 rounded-full border-2 border-emerald-600 text-emerald-600 bg-transparent" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.1em' }}>
                          COMING SOON
                        </span>
                      </div>
                    )}
                    
                    <div className="w-full h-full flex items-center justify-center relative z-10" style={{ pointerEvents: 'auto' }}>
                      <TiltedCard
                        imageSrc={images[selectedIndex].coverSrc}
                        altText={images[selectedIndex].alt}
                        captionText={images[selectedIndex].code}
                        containerHeight={isCoarsePointer ? "18rem" : "22rem"}
                        containerWidth="100%"
                        imageHeight={isCoarsePointer ? "18rem" : "22rem"}
                        imageWidth={isCoarsePointer ? "12rem" : "14rem"}
                        rotateAmplitude={12}
                        scaleOnHover={1.12}
                        showMobileWarning={false}
                        showTooltip={!isCoarsePointer}
                        disableTilt={isCoarsePointer}
                        displayOverlayContent={false}
                      />
                    </div>
                  </div>
                  
                  {/* Book Details Panel on Right - Scrollable */}
                  <div className="w-full lg:w-3/5 p-6 sm:p-8 overflow-y-auto flex-shrink" style={{
                    maxHeight: '85vh',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#10b981 #f0fdf4'
                  }}>
                    <BookDetailsSidePanel
                      tomeNumber={images[selectedIndex].tomeNumber}
                      coverSrc={images[selectedIndex].coverSrc}
                      altText={images[selectedIndex].alt}
                    />
                  </div>
                </div>
              ) : (
                /* Regular Books: Just TiltedCard */
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 relative">
                  {/* Close Button - Inside modal, top right */}
                  <motion.button
                    onClick={() => setSelectedIndex(null)}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 transition-all touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center group"
                    aria-label="Close modal"
                    whileHover={{ 
                      rotate: 90,
                      scale: 1.1 
                    }}
                    whileTap={{ 
                      rotate: 90,
                      scale: 0.95 
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 17
                    }}
                  >
                    <motion.svg 
                      className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </motion.svg>
                  </motion.button>
                  
                  <div style={{ pointerEvents: 'auto' }}>
                    <TiltedCard
                      imageSrc={images[selectedIndex].coverSrc}
                      altText={images[selectedIndex].alt}
                      captionText={images[selectedIndex].code}
                      containerHeight={isCoarsePointer ? "18rem" : "22rem"}
                      containerWidth="100%"
                      imageHeight={isCoarsePointer ? "18rem" : "22rem"}
                      imageWidth={isCoarsePointer ? "12rem" : "14rem"}
                      rotateAmplitude={12}
                      scaleOnHover={1.12}
                      showMobileWarning={false}
                      showTooltip={!isCoarsePointer}
                      disableTilt={isCoarsePointer}
                      displayOverlayContent={false}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;

const HoverExpand_001 = ({
  images,
  className,
  selectedIndex,
  setSelectedIndex,
  isCoarsePointer,
}) => {
  const [activeImage, setActiveImage] = useState(-1);
  // Fixed dimensions for perfect alignment
  const collapsedWidth = isCoarsePointer ? "4rem" : "5.5rem";
  const collapsedHeight = isCoarsePointer ? "14rem" : "19rem";
  const expandedWidth = isCoarsePointer ? "13rem" : "15rem";
  const expandedHeight = isCoarsePointer ? "19rem" : "22rem";
  const containerMinHeight = expandedHeight;
  const redBarHeight = "2.5rem"; // Fixed height for red bottom bar

  // Add style to hide scrollbar on mobile
  useEffect(() => {
    if (isCoarsePointer && typeof document !== "undefined") {
      const style = document.createElement("style");
      style.textContent = `
        .mobile-gallery-scroll::-webkit-scrollbar {
          display: none;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isCoarsePointer]);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-6xl px-2 sm:px-4 md:px-5", className)}
    >
      <div className="w-full">
        <div
          className={cn(
            "flex w-full items-end border border-amber-200/60 rounded-2xl",
            isCoarsePointer
              ? "justify-start gap-2 sm:gap-2.5 px-3 sm:px-4 py-4 sm:py-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory mobile-gallery-scroll"
              : "justify-center gap-3.5 px-6 py-8"
          )}
          style={{
            minHeight: containerMinHeight,
            ...(isCoarsePointer ? { 
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingBottom: "1rem",
            } : {}),
          }}
          onScroll={(e) => {
            // Prevent vertical scroll on mobile when scrolling horizontally
            if (isCoarsePointer && e.currentTarget) {
              e.currentTarget.scrollTop = 0;
            }
          }}
        >
          {images.map((image, index) => {
            const targetWidth =
              activeImage === index ? expandedWidth : collapsedWidth;
            const targetHeight =
              activeImage === index ? expandedHeight : collapsedHeight;
            const spineView = activeImage !== index;
            const isLastBook = index === images.length - 1;
            
            // Calculate movement offsets when expanded
            // Move up slightly to accommodate height increase (since aligned to bottom)
            const translateY = activeImage === index 
              ? (isCoarsePointer ? "-0.5rem" : "-0.75rem") 
              : "0rem";
            // Slight horizontal adjustment for visual balance
            const translateX = activeImage === index 
              ? (isCoarsePointer ? "0.25rem" : "0.5rem") 
              : "0rem";

            return (
              <motion.div
                key={index}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-amber-200/70 shadow-sm flex-shrink-0 touch-manipulation",
                  isCoarsePointer ? "cursor-default" : "cursor-pointer",
                  isCoarsePointer && "snap-center"
                )}
                style={{ 
                  backgroundColor: "rgb(47, 73, 47)",
                  width: targetWidth,
                  height: targetHeight,
                  minWidth: isCoarsePointer ? collapsedWidth : undefined,
                  minHeight: isCoarsePointer ? collapsedHeight : undefined,
                }}
                initial={{ 
                  width: collapsedWidth, 
                  height: collapsedHeight,
                  translateX: "0rem",
                  translateY: "0rem",
                }}
                animate={{
                  width: targetWidth,
                  height: targetHeight,
                  translateX: translateX,
                  translateY: translateY,
                }}
                transition={{ 
                  duration: isCoarsePointer ? 0.3 : 0.36, 
                  ease: [0.22, 0.61, 0.36, 1] 
                }}
                onClick={() => {
                  if (isCoarsePointer) {
                    // On mobile, clicking always opens the modal
                    setSelectedIndex(index);
                  } else {
                    setActiveImage(index);
                    setSelectedIndex(index);
                  }
                }}
                onHoverStart={() => {
                  if (isCoarsePointer) return;
                  setActiveImage(index);
                }}
                onHoverEnd={() => {
                  if (isCoarsePointer) return;
                  setActiveImage(-1);
                }}
                onTouchStart={(e) => {
                  // Prevent scrolling when touching a book on mobile
                  if (isCoarsePointer) {
                    e.stopPropagation();
                  }
                }}
              >
                {/* Glow effect on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeImage === index ? 1 : 0 }}
                  transition={{ duration: 0.36, ease: [0.22, 0.61, 0.36, 1] }}
                  className="pointer-events-none absolute -inset-2 rounded-3xl"
                  style={{
                    boxShadow:
                      activeImage === index
                        ? "0 0 25px rgba(252, 211, 77, 0.45), 0 0 45px rgba(245, 158, 11, 0.35)"
                        : "none",
                  }}
                />
                
                {/* Overlay gradient on hover */}
                <AnimatePresence>
                  {activeImage === index && !isLastBook && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/30 to-transparent z-10 rounded-2xl"
                    />
                  )}
                </AnimatePresence>
                
                {/* Code label on hover */}
                <AnimatePresence>
                  {activeImage === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
                      className="absolute flex h-full w-full flex-col items-end justify-end p-4 z-20 pointer-events-none"
                    >
                      <p className="text-left text-xs text-white/50">
                        {image.code}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                
                {/* Red bottom bar - fixed position and height */}
                <div
                  className="absolute inset-x-0 bottom-0 z-0"
                  style={{ 
                    backgroundColor: "rgb(47, 73, 47)",
                    height: redBarHeight,
                  }}
                />
                
                {/* Last book: Green background with red "?" in middle when collapsed */}
                {isLastBook && spineView && (
                  <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center">
                    <span 
                      className="font-bold select-none"
                      style={{
                        fontSize: isCoarsePointer ? "2.5rem" : "3.5rem",
                        fontFamily: "serif",
                        lineHeight: 1,
                        color: "rgb(139, 51, 34)",
                      }}
                    >
                      ?
                    </span>
                  </div>
                )}
                
                {/* Spine/Cover Image - hide for last book when collapsed */}
                {(!isLastBook || !spineView) && (
                  <div className="relative w-full h-full z-10 rounded-2xl overflow-hidden">
                    <Image
                      src={activeImage === index ? image.coverSrc : image.spineSrc}
                      width={400}
                      height={400}
                      className={cn(
                        "absolute inset-0 w-full h-full transition-all duration-200 bg-transparent",
                        spineView ? "object-contain" : "object-contain"
                      )}
                      style={{
                        objectPosition: "center",
                      }}
                      alt={image.alt}
                      priority={index < 3}
                      loading={index < 3 ? "eager" : "lazy"}
                      sizes={isCoarsePointer ? "(max-width: 640px) 4rem, 5.5rem" : "(max-width: 768px) 5.5rem, 5.5rem"}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

