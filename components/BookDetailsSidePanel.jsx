"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useTranslation } from "../lib/useTranslation";

// Animated Title Component with TiltedCard-like hover interaction
const AnimatedTitle = ({ title }) => {
  const ref = useRef(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 100, damping: 30, mass: 2 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 100, damping: 30, mass: 2 });
  const scale = useSpring(1, { stiffness: 100, damping: 30, mass: 2 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    
    const rotationX = (offsetY / (rect.height / 2)) * -8; // Similar to TiltedCard
    const rotationY = (offsetX / (rect.width / 2)) * 8;
    
    rotateX.set(rotationX);
    rotateY.set(rotationY);
  };

  const handleMouseEnter = () => {
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className="mb-6 flex-shrink-0"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 800 }}
    >
      <motion.h2
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight cursor-default"
        style={{
          fontFamily: 'Exo 2, sans-serif',
          letterSpacing: '0.01em',
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        {title}
      </motion.h2>
    </motion.div>
  );
};

export const BookDetailsSidePanel = ({ tomeNumber }) => {
  const { t } = useTranslation();

  if (!tomeNumber || tomeNumber < 1 || tomeNumber > 7) return null;

  return (
    <div className="flex flex-col min-h-0">
      {/* Tome Number */}
      <div className="mb-4 flex-shrink-0">
        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {t('books.tome')} {tomeNumber}
        </span>
      </div>

      {/* Title with Animated Hover Effect */}
      <AnimatedTitle title={t(`books.tomes.${tomeNumber}.title`)} />

      {/* Prologue - Scrollable area */}
      <div className="flex-1 min-h-0 overflow-y-auto" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#10b981 #f0fdf4'
      }}>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {t('books.prologue')}
        </h3>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic pb-4" style={{ fontFamily: 'Crimson Text, serif', lineHeight: '1.8' }}>
          "{t(`books.tomes.${tomeNumber}.prologue`)}"
        </p>
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex-shrink-0">
        <p className="text-sm text-gray-500 text-center" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {t('books.stayTuned')}
        </p>
      </div>
    </div>
  );
};

