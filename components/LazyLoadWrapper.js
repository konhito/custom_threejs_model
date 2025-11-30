/**
 * Lazy Load Wrapper
 * 
 * Optimized component for lazy loading heavy content with Intersection Observer
 */

'use client';

import { useEffect, useRef, useState } from 'react';

export default function LazyLoadWrapper({
  children,
  fallback = null,
  rootMargin = '100px',
  threshold = 0.01,
  minHeight = '100px',
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            // Disconnect after first load
            if (containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasLoaded, rootMargin, threshold]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: isVisible ? 'auto' : minHeight }}
    >
      {isVisible ? children : fallback}
    </div>
  );
}

/**
 * Lazy load component with dynamic import
 */
export function LazyComponent({ component, fallback, ...props }) {
  const [Component, setComponent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && !Component) {
      component().then((mod) => {
        setComponent(() => mod.default || mod);
      });
    }
  }, [isVisible, component, Component]);

  return (
    <div ref={containerRef}>
      {Component ? <Component {...props} /> : fallback}
    </div>
  );
}


