'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
  subtextClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({
  className = '',
  showText = true,
  textClassName = '',
  subtextClassName = '',
  size = 'md'
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-16',
    md: 'h-10 w-24',
    lg: 'h-16 w-36',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Bullet Train SVG Logo */}
      <div className="relative group shrink-0">
        {/* Glow effect on hover */}
        <div className="absolute -inset-1 rounded-lg bg-primary/20 blur opacity-0 group-hover:opacity-100 transition duration-500" />
        <svg
          className={`relative text-primary transition-transform duration-300 group-hover:scale-105 ${sizeClasses[size]}`}
          viewBox="0 0 100 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Motion trails */}
          <line x1="5" y1="13" x2="22" y2="13" strokeWidth="2" strokeDasharray="1 2" className="opacity-70 animate-pulse" />
          <line x1="2" y1="19" x2="18" y2="19" strokeWidth="2" />
          <line x1="8" y1="25" x2="20" y2="25" strokeWidth="2" strokeDasharray="2 1" />
          <line x1="4" y1="31" x2="16" y2="31" strokeWidth="2" className="opacity-70" />
          
          {/* Main Shinkansen Body */}
          <path 
            d="M 24 13 L 70 13 C 76 13 82 15 86 19 L 94 24 C 97 26 97 28 93 28 L 88 28 L 24 28 Z" 
            fill="currentColor" 
            fillOpacity="0.08" 
          />
          
          {/* Nose curve detail */}
          <path d="M 75 19 L 85 19 C 88 19 91 21 92 23" strokeWidth="1.8" />
          
          {/* Cab windows */}
          <rect x="29" y="16" width="6" height="4" rx="1.2" fill="currentColor" fillOpacity="0.1" strokeWidth="1.5" />
          <rect x="39" y="16" width="6" height="4" rx="1.2" fill="currentColor" fillOpacity="0.1" strokeWidth="1.5" />
          <rect x="49" y="16" width="6" height="4" rx="1.2" fill="currentColor" fillOpacity="0.1" strokeWidth="1.5" />
          <rect x="59" y="16" width="6" height="4" rx="1.2" fill="currentColor" fillOpacity="0.1" strokeWidth="1.5" />
          
          {/* Driver front cockpit windshield */}
          <path d="M 76 16 L 80 16 C 81.5 16 82.5 17 82.5 18 L 81.5 20 Z" fill="currentColor" strokeWidth="1.5" />

          {/* Under carriage/wheels */}
          <circle cx="36" cy="30" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="46" cy="30" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="66" cy="30" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="76" cy="30" r="2.2" fill="currentColor" stroke="none" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-sans text-base font-black italic tracking-widest text-text-primary uppercase ${textClassName}`}>
            RailSaarthi
          </span>
          <span className={`text-[9px] text-text-secondary tracking-widest font-mono uppercase mt-0.5 ${subtextClassName}`}>
            Operations Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
