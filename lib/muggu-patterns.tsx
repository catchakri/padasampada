import React from 'react';

// Traditional Sankranti Kite (గాలిపటం)
export function KiteIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Diamond kite body */}
      <polygon points="12,2 21,11 12,20 3,11" fill="currentColor" fillOpacity="0.15" stroke="currentColor" />
      {/* Cross struts */}
      <line x1="12" y1="2" x2="12" y2="20" stroke="currentColor" />
      <path d="M 3,11 Q 12,17 21,11" stroke="currentColor" fill="none" />
      {/* Tail tassels */}
      <polygon points="12,20 10,23 14,23" fill="currentColor" />
    </svg>
  );
}

// Traditional Toranam (తోరణం / Crossed festive garlands)
export function ToranamMotif({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6">
      {/* Top curved garland line */}
      <path d="M 4,8 Q 20,18 36,8" stroke="currentColor" fill="none" strokeLinecap="round" />
      <path d="M 4,14 Q 20,24 36,14" stroke="currentColor" fill="none" strokeLinecap="round" strokeDasharray="1 2" />
      {/* Hanging Mango Leaves & Flowers */}
      <path d="M 10,10 C 9,18 13,22 10,28" stroke="currentColor" strokeLinecap="round" />
      <path d="M 20,13 C 19,23 23,26 20,33" stroke="currentColor" strokeLinecap="round" />
      <path d="M 30,10 C 29,18 33,22 30,28" stroke="currentColor" strokeLinecap="round" />
      {/* Little bell/flower at center */}
      <circle cx="20" cy="34" r="2" fill="currentColor" />
      <circle cx="10" cy="29" r="1.5" fill="currentColor" />
      <circle cx="30" cy="29" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Traditional Chukkala Muggu / Star Mandala (చుక్కల రంగవల్లిక)
export function MugguStar({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
      {/* Central dot */}
      <circle cx="16" cy="16" r="2" fill="currentColor" />
      {/* 8-pointed rice flour loops */}
      <path d="M 16,3 C 18,10 18,10 25,7 C 22,14 22,14 29,16 C 22,18 22,18 25,25 C 18,22 18,22 16,29 C 14,22 14,22 7,25 C 10,18 10,18 3,16 C 10,14 10,14 7,7 C 14,10 14,10 16,3 Z" 
        stroke="currentColor" fill="currentColor" fillOpacity="0.1" strokeLinejoin="round" />
      <circle cx="16" cy="7" r="1" fill="currentColor" />
      <circle cx="25" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="25" r="1" fill="currentColor" />
      <circle cx="7" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

// Traditional Deepam / Lamp (మంగళ ప్రమిద)
export function DeepamIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Base clay diya */}
      <path d="M 3,15 C 3,19 8,21 12,21 C 16,21 21,19 21,15 C 21,14 18,14 12,14 C 6,14 3,14 3,15 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      {/* Flame */}
      <path d="M 12,3 C 10,7 9,9 9,11 C 9,12.7 10.3,14 12,14 C 13.7,14 15,12.7 15,11 C 15,9 14,7 12,3 Z" fill="#F59E0B" stroke="#D97706" />
      <circle cx="12" cy="11" r="1.5" fill="#FEF3C7" />
    </svg>
  );
}

// Sankranti Flourish Header Divider
export function MugguDivider({ className = 'w-full my-6 text-amber-700/40' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700/30 to-amber-700/50" />
      <div className="flex items-center gap-1.5 text-amber-700/70">
        <span className="text-xs">✦</span>
        <MugguStar className="w-4 h-4" />
        <span className="text-xs">✦</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-700/30 to-amber-700/50" />
    </div>
  );
}

// Corner Rangoli Lace Motif for Header & Cards
export function CornerMuggu({ position = 'top-left' }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const rotation = {
    'top-left': '',
    'top-right': 'scale-x-[-1]',
    'bottom-left': 'scale-y-[-1]',
    'bottom-right': 'scale-[-1]'
  }[position];

  return (
    <div className={`absolute pointer-events-none opacity-20 text-amber-600 ${rotation}`}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M 0,0 L 40,0 C 40,22 22,40 0,40 Z" stroke="currentColor" strokeDasharray="2 2" fill="none" />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
        <circle cx="26" cy="8" r="2" fill="currentColor" />
        <circle cx="8" cy="26" r="2" fill="currentColor" />
        <path d="M 0,20 Q 20,20 20,0" stroke="currentColor" />
        <path d="M 6,6 Q 16,16 6,26 Q 16,16 26,6" stroke="currentColor" fill="none" />
      </svg>
    </div>
  );
}
