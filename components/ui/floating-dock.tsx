/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

"use client";

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { AnimatedTooltip } from "./animated-tooltip";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  
  // Don't render if className includes 'hidden'
  if (className?.includes('hidden')) {
    return null;
  }
  
  return (
    <div className={cn("relative block lg:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute right-0 bottom-full mb-2 flex flex-col gap-2 max-h-[70vh] overflow-y-auto scrollbar-thin"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10, x: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  x: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  key={item.title}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="h-5 w-5 text-gray-700">{item.icon}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-lg hover:shadow-xl transition-all"
      >
        <IconLayoutNavbarCollapse className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  let mouseY = useMotionValue(Infinity);
  
  return (
    <motion.div
      onMouseMove={(e) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn(
        "hidden lg:flex flex-col items-center gap-2.5 rounded-2xl px-2 py-2.5 border border-gray-200/60 bg-white/90 backdrop-blur-xl shadow-xl transition-all duration-300",
        isCollapsed ? "px-2.5" : "",
        className,
      )}
      style={{ overflow: 'visible' }}
    >
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            key="items"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-2.5"
          >
            {items.map((item) => (
              <IconContainer mouseY={mouseY} key={item.title} {...item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "flex items-center justify-center rounded-full transition-all duration-300 border border-gray-200/40 hover:border-gray-300/50",
          isCollapsed ? "w-10 h-10" : "w-8 h-8 mt-1"
        )}
        aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
      >
        <IconLayoutNavbarCollapse 
          className={cn(
            "text-gray-600 hover:text-gray-700 transition-transform duration-300",
            isCollapsed ? "rotate-180" : ""
          )}
          style={{ width: isCollapsed ? 20 : 16, height: isCollapsed ? 20 : 16 }}
        />
      </button>
    </motion.div>
  );
};

function IconContainer({
  mouseY,
  title,
  icon,
  href,
}: {
  mouseY: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseY, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };

    return val - bounds.y - bounds.height / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 44, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 44, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [16, 18, 16]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [16, 18, 16],
  );

  let width = useSpring(widthTransform, {
    mass: 0.3,
    stiffness: 80,
    damping: 20,
  });
  let height = useSpring(heightTransform, {
    mass: 0.3,
    stiffness: 80,
    damping: 20,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.3,
    stiffness: 80,
    damping: 20,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.3,
    stiffness: 80,
    damping: 20,
  });

  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <a href={href} className="relative" style={{ overflow: 'visible' }}>
      <AnimatedTooltip tooltipContent={title}>
        <motion.div
          ref={ref}
          style={{ width, height, overflow: 'visible' }}
          className={cn(
            "relative flex aspect-square items-center justify-center rounded-full transition-all duration-500 border border-gray-200/40",
            "hover:border-gray-300/50"
          )}
        >
          <motion.div
            style={{ width: widthIcon, height: heightIcon }}
            className={cn(
              "flex items-center justify-center transition-colors duration-500",
              isActive 
                ? "text-blue-600" 
                : "text-gray-600 hover:text-gray-700"
            )}
          >
            {icon}
          </motion.div>
        </motion.div>
      </AnimatedTooltip>
    </a>
  );
}

