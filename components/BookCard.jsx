"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ShoppingCart, Download, Star, Sparkles, BookOpen, Heart, Eye } from "lucide-react";

export default function BookCard({ 
  product, 
  price, 
  digitalPrice, 
  hasDigital, 
  currency,
  formatCurrency,
  onAddToCart 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow effect */}
      <div 
        className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1), transparent 70%)',
        }}
      />

      {/* Main Card */}
      <motion.div
        className="relative bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-xl"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered 
            ? `perspective(1000px) rotateY(${mousePosition.x * 8}deg) rotateX(${-mousePosition.y * 8}deg)`
            : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
          transition: 'transform 0.1s ease-out',
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1) inset'
            : '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Shine effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
          style={{
            background: `linear-gradient(${105 + mousePosition.x * 30}deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)`,
          }}
        />

        {/* Top Actions */}
        <div className="absolute top-3 right-3 z-30 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : 'bg-white/70 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Badge */}
        {product.stock_quantity > 50 && (
          <div className="absolute top-3 left-3 z-30">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5"
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Bestseller</span>
            </motion.div>
          </div>
        )}

        {/* Book Cover Section */}
        <div className="relative h-72 bg-gradient-to-br from-slate-100 via-emerald-50 to-cyan-50 overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="bookPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="currentColor" className="text-emerald-300" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bookPattern)" />
            </svg>
          </div>

          {/* Book Image with 3D effect */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              className="relative w-40 h-56"
              animate={{
                rotateY: isHovered ? -15 : 0,
                x: isHovered ? -10 : 0,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Book spine shadow */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/30 to-transparent rounded-l-sm"
                style={{ transform: 'translateZ(-2px)' }}
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
                  <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/80" />
                  </div>
                )}
                
                {/* Book spine effect */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 via-black/10 to-transparent" />
                
                {/* Book page edges */}
                <div 
                  className="absolute right-0 top-2 bottom-2 w-1 bg-gradient-to-l from-gray-100 to-gray-200"
                  style={{ boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.1)' }}
                />
              </div>

              {/* Floating sparkles on hover */}
              {isHovered && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="absolute -bottom-1 -left-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>

          {/* Quick View overlay */}
          <motion.div 
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-900 font-medium text-sm flex items-center gap-2 shadow-lg"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </motion.button>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md uppercase tracking-wide">
              {product.type === 'book' ? 'Novel' : 'Card Game'}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">(4.8)</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(price, currency)}
                </p>
              </div>
              {hasDigital && !product.is_digital && (
                <div className="text-right">
                  <p className="text-xs text-emerald-600 mb-0.5">Digital</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {formatCurrency(digitalPrice, currency)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stock indicator */}
          {!product.is_digital && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className={`text-xs font-medium ${product.stock_quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {product.stock_quantity > 50 
                  ? 'In Stock' 
                  : product.stock_quantity > 0 
                  ? `Only ${product.stock_quantity} left`
                  : 'Out of Stock'
                }
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {!product.is_digital && product.stock_quantity > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAddToCart(product, false)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </motion.button>
            )}
            {hasDigital && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAddToCart(product, true)}
                className={`${!product.is_digital && product.stock_quantity > 0 ? 'w-12' : 'flex-1'} px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2`}
              >
                <Download className="w-4 h-4" />
                {(product.is_digital || product.stock_quantity === 0) && <span>Get Digital</span>}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
