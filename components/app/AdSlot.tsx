'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  id: string;
  width: number;
  height: number;
  className?: string;
}

export function AdSlot({ id, width, height, className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '100px' }
      );

      observer.observe(adRef.current);

      return () => {
        if (adRef.current) {
          observer.unobserve(adRef.current);
        }
      };
    }
  }, []);

  return (
    <div
      ref={adRef}
      id={id}
      className={`mx-auto bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center ${className}`}
      style={{ width: `${width}px`, height: `${height}px`, minHeight: `${height}px` }}
    >
      <span className="text-slate-500 text-sm">Ad Space {width}×{height}</span>
    </div>
  );
}
