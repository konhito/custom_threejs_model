"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import { ShoppingCart, BookOpen, Heart, Eye } from "lucide-react";

export default function BookCard({
  product,
  price,
  currency,
  formatCurrency,
  onAddToCart
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const isBook = product.type === "book";

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Card */}
      <div
        className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500"
      >
        {/* Top Actions */}
        <div className="absolute top-3 right-3 z-30 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${isLiked
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white/80 text-gray-400 hover:bg-white hover:text-rose-500'
              }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Book Cover Section */}
        <div className="relative h-80 bg-gradient-to-b from-stone-100 to-stone-50 overflow-hidden flex items-center justify-center p-8">
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Book Image with 3D effect */}
          <motion.div
            className="relative w-44 h-60"
            animate={{
              rotateY: isHovered ? -8 : 0,
              y: isHovered ? -4 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Book shadow on surface */}
            <div
              className="absolute -bottom-3 left-2 right-2 h-6 rounded-full bg-black/10 blur-lg transition-all duration-300"
              style={{
                transform: isHovered ? 'scaleX(1.1) translateY(4px)' : 'scaleX(1)',
              }}
            />

            {/* Book cover */}
            <div className="relative w-full h-full rounded-r-md overflow-hidden shadow-2xl">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <BookOpen className="w-14 h-14 text-white/60" />
                </div>
              )}

              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />

              {/* Book page edges */}
              <div
                className="absolute right-0 top-2 bottom-2 w-1 bg-gradient-to-l from-stone-200 to-stone-100"
                style={{ boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.06)' }}
              />
            </div>
          </motion.div>

          {/* Quick View overlay */}
          <motion.div
            className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          >
            <Link
              href="/library"
              className="px-4 py-2 bg-white rounded-full text-gray-900 font-medium text-sm flex items-center gap-2 shadow-lg"
            >
              <Eye className="w-4 h-4" />
              Preview free chapters
            </Link>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          {/* Category tag */}
          <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-600 text-[11px] font-semibold rounded uppercase tracking-wider">
            {product.type === 'book' ? 'Novel' : 'Card Game'}
          </span>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {/* Physical Book Button */}
            {!product.is_digital && (product.stock_quantity > 0 || isBook) && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onAddToCart(product, false)}
                className="w-full px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm">Buy Printed Book</span>
                </div>
                <span className="text-sm font-bold">{formatCurrency(price, currency)}</span>
              </motion.button>
            )}

            {isBook && <Link href="/library" className="flex w-full items-center justify-between rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"><span className="flex items-center gap-2"><BookOpen className="w-4 h-4"/>Read digitally</span><span className="text-right text-xs leading-4">First 3 chapters free<br/>Unlock one chapter at a time →</span></Link>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
