"use client";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";

export const AnimatedTooltip = ({
  children,
  tooltipContent,
  className,
}: {
  children: React.ReactNode;
  tooltipContent: string;
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-5, 5]),
    springConfig
  );
  
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-10, 10]),
    springConfig
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div
      className={cn("relative group", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow: 'visible' }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: 0 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{ opacity: 0, y: 10, x: 0 }}
            style={{
              translateX: translateX,
              rotate: rotate,
            }}
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2 flex text-xs flex-col items-center justify-center rounded-lg bg-black/95 backdrop-blur-sm z-[10000] shadow-xl px-3 py-2 pointer-events-none whitespace-nowrap"
          >
            <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
            <div className="absolute left-10 z-30 w-[40%] -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
            <div className="font-medium text-white relative z-30 text-xs whitespace-nowrap">
              {tooltipContent}
            </div>
            <div className="absolute right-0 top-1/2 translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 border-r border-b border-black/90 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

