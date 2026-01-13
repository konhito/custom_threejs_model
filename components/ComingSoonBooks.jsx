"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useTranslation } from "../lib/useTranslation";

const ComingSoonBooks = () => {
  const { t } = useTranslation();

  const tomes = [1, 2, 3, 4, 5, 6, 7];

  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.02em' }}
          >
            {t('books.comingSoonSection.title')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 mx-auto mb-6"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            style={{ fontFamily: 'Exo 2, sans-serif' }}
          >
            {t('books.comingSoonSection.subtitle')}
          </motion.p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {tomes.map((tomeId, index) => {
            const coverPaths = {
              1: "/books/1.png",
              2: "/books/2.png",
              3: "/books/3.png",
              4: "/books/4.png",
              5: "/books/5.png",
              6: "/books/6.png",
              7: "/books/7.png"
            };
            
            return (
              <motion.div
                key={tomeId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                  {/* Coming Soon Banner */}
                  <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-2 px-4 text-center">
                    <span className="text-sm md:text-base font-bold tracking-wider" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.1em' }}>
                      {t('books.comingSoon')}
                    </span>
                  </div>

                  {/* Book Cover */}
                  <div className="relative h-80 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden mt-10">
                    <Image
                      src={coverPaths[tomeId]}
                      alt={t(`books.tomes.${tomeId}.title`)}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Tome Number */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        {t('books.tome')} {tomeId}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight" style={{ fontFamily: 'Exo 2, sans-serif', letterSpacing: '0.01em' }}>
                      {t(`books.tomes.${tomeId}.title`)}
                    </h3>

                    {/* Prologue */}
                    <div className="flex-1">
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed italic" style={{ fontFamily: 'Crimson Text, serif', lineHeight: '1.7' }}>
                        "{t(`books.tomes.${tomeId}.prologue`)}"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-gray-500 text-sm md:text-base" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {t('books.stayTuned')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoonBooks;

