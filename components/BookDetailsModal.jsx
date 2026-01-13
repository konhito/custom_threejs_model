"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useTranslation } from "../lib/useTranslation";

export const BookDetailsModal = ({ isOpen, onClose, tomeNumber, coverSrc, altText }) => {
  const { t, locale } = useTranslation();

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!tomeNumber || tomeNumber < 1 || tomeNumber > 7) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[13000] bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.22, 0.61, 0.36, 1],
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="fixed inset-0 z-[13001] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            onClick={onClose}
          >
            <motion.div
              className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#10b981 #f0fdf4'
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Coming Soon Banner */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-2 px-4 text-center rounded-t-2xl sm:rounded-t-3xl">
                <span className="text-sm sm:text-base font-bold tracking-wider" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.1em' }}>
                  {t('books.comingSoon')}
                </span>
              </div>

              <div className="pt-12 sm:pt-14">
                {/* Content Container */}
                <div className="flex flex-col lg:flex-row">
                  {/* Book Cover - Left Side */}
                  <div className="w-full lg:w-2/5 p-6 sm:p-8 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="relative w-full max-w-xs aspect-[2/3]">
                      <Image
                        src={coverSrc}
                        alt={altText}
                        fill
                        className="object-contain rounded-lg shadow-xl"
                        sizes="(max-width: 768px) 100vw, 40vw"
                        priority
                      />
                    </div>
                  </div>

                  {/* Book Info - Right Side */}
                  <div className="w-full lg:w-3/5 p-6 sm:p-8 flex flex-col">
                    {/* Tome Number */}
                    <div className="mb-4">
                      <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        {t('books.tome')} {tomeNumber}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Exo 2, sans-serif', letterSpacing: '0.01em' }}>
                      {t(`books.tomes.${tomeNumber}.title`)}
                    </h2>

                    {/* Prologue */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {t('books.prologue')}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic" style={{ fontFamily: 'Crimson Text, serif', lineHeight: '1.8' }}>
                        "{t(`books.tomes.${tomeNumber}.prologue`)}"
                      </p>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-500 text-center" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {t('books.stayTuned')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


