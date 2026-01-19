"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect } from "react";
import React from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, margin: "-100px" });
  
  // Calculate total characters to ensure animation completes
  const totalChars = wordsArray.reduce((acc, word) => acc + word.text.length + 1, 0);
  
  useEffect(() => {
    if (isInView && scope.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        animate("span", {
          display: "inline-block",
          opacity: 1,
        }, {
          duration: 0.1,
          delay: stagger(0.02), // Slightly slower for longer texts
          ease: [0.25, 0.1, 0.25, 1],
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, animate, totalChars]);

  const renderWords = () => {
    return (
      <motion.div 
        ref={scope} 
        className="inline" 
        style={{ 
          willChange: 'contents',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {wordsArray.map((word, idx) => {
          return (
            <React.Fragment key={`word-${idx}`}>
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${idx}-${index}`}
                  className={cn(`opacity-0 hidden`, word.className)}
                  style={{ 
                    willChange: 'opacity, display',
                    transform: 'translateZ(0)',
                  }}>
                  {char}
                </motion.span>
              ))}
              {/* Add space after each word except the last */}
              {idx < wordsArray.length - 1 && (
                <motion.span
                  initial={{}}
                  key={`space-${idx}`}
                  className={cn(`opacity-0 hidden`, word.className)}
                  style={{ 
                    willChange: 'opacity, display',
                    transform: 'translateZ(0)',
                    width: '0.3em',
                  }}>
                  &nbsp;
                </motion.span>
              )}
            </React.Fragment>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div
      className={cn(
        "text-center",
        className
      )}>
      <div>
        {renderWords()}
        <motion.span
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{ willChange: 'opacity' }}
          className={cn(
            "inline-block rounded-sm w-[4px] h-4 md:h-5 lg:h-6 ml-1",
            cursorClassName || "bg-gray-700"
          )}></motion.span>
      </div>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });
  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black `, word.className)}>
                  {char}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}>
        <div
          className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
          style={{
            whiteSpace: "nowrap",
          }}>
          {renderWords()}{" "}
        </div>{" "}
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,

          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "block rounded-sm w-[4px]  h-4 sm:h-6 xl:h-12 bg-blue-500",
          cursorClassName
        )}></motion.span>
    </div>
  );
};
