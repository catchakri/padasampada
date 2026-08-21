'use client';

import React from 'react';
import { ToranamMotif, MugguStar, KiteIcon } from '@/lib/muggu-patterns';
import { Plus, Download, Database, User, Settings2, ShieldCheck, Award } from 'lucide-react';
import { ContributorProfile, FirebaseConfigState } from '@/types/dictionary';

interface HeaderProps {
  onOpenAddConcept: () => void;
  onOpenExport: () => void;
  onOpenFirebase: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onNavigateToModeration?: () => void;
  userProfile: ContributorProfile;
  firebaseConfig: FirebaseConfigState;
  threshold: number;
  pendingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddConcept,
  onOpenExport,
  onOpenFirebase,
  onOpenProfile,
  onOpenSettings,
  onNavigateToModeration,
  userProfile,
  firebaseConfig,
  threshold,
  pendingCount = 0
}) => {
  return (
    <header className="relative w-full telugu-maroon-gradient text-amber-50 shadow-md border-b-2 border-amber-500/30 overflow-hidden">
      {/* Traditional Toranam Garland across the very top */}
      <div className="w-full flex items-center justify-between px-4 py-1 text-amber-300/40 border-b border-amber-500/10 text-xs select-none">
        <div className="flex items-center gap-2">
          <ToranamMotif className="w-6 h-6 text-amber-400/50" />
          <span className="hidden sm:inline tracking-wider font-telugu text-[11px]">శుభం • సంస్కృతి • భాషా పరిరక్షణ</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-telugu">
          <span className="text-amber-200/70">
            ఐడీ: <strong className="text-amber-300 font-mono text-[10px]">{userProfile.id}</strong>
          </span>
          <span className="text-amber-400/40">|</span>
          <span className="text-amber-200/70">నిఘంటు అవధి: <strong className="text-amber-300">{threshold}</strong> ఓట్లు</span>
          <span className="text-amber-400/40">|</span>
          <span className="flex items-center gap-1 text-amber-200/70">
            <span className={`w-2 h-2 rounded-full ${firebaseConfig.isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            {firebaseConfig.isConfigured ? 'ఫైర్‌బేస్ క్లౌడ్ సింక్' : 'స్థానిక నిల్వ (Local/Ready)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline tracking-wider font-telugu text-[11px]">ఆధునిక తెలుగింపు</span>
          <ToranamMotif className="w-6 h-6 text-amber-400/50 scale-x-[-1]" />
        </div>
      </div>

      {/* Main Ornate Header Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-6">
        <div className="flex flex-col items-center text-center">
          
          {/* Ornate Traditional Logo & Cultural Glyphs */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-2 text-amber-400">
            <KiteIcon className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400/90 animate-bounce" />
            <ToranamMotif className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-telugu-serif tracking-wide text-amber-100 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] px-2">
              పద సంపద
            </h1>

            <ToranamMotif className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 scale-x-[-1]" />
            <MugguStar className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400/90" />
          </div>

          {/* Subtitle / Tagline */}
          <p className="text-amber-200/90 text-xs sm:text-sm font-telugu max-w-2xl font-medium tracking-wide mb-5">
            కొత్త భావనలకు తెలుగు పదాల సృష్టి • Traditional & Modern Telugu Neologisms & Nigantu
          </p>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Primary Add New English Word Button */}
            <button
              id="btn-add-english-concept"
              onClick={onOpenAddConcept}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-900 font-bold px-4 sm:px-5 py-2.5 rounded-full shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all text-xs sm:text-sm font-telugu"
            >
              <Plus className="w-4 h-4 text-stone-900 stroke-[2.5]" />
              <span>+ కొత్త ఆంగ్ల పదం</span>
            </button>

            {/* Contributor Dashboard / Profile Button */}
            <button
              id="btn-user-profile-header"
              onClick={onOpenProfile}
              className="flex items-center gap-2 bg-amber-950/50 hover:bg-amber-900/70 text-amber-200 border border-amber-500/40 px-3.5 sm:px-4 py-2.5 rounded-full shadow transition-all text-xs sm:text-sm font-telugu"
              title="కంట్రిబ్యూటర్ డాష్‌బోర్డ్ & వివరాలు"
            >
              <User className="w-4 h-4 text-amber-300" />
              <span className="max-w-[130px] truncate">{userProfile.name}</span>
              <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded-full text-[10px] font-sans font-bold">
                {userProfile.reputationScore || 10} pts
              </span>
            </button>

            {/* Moderation Desk Quick Button */}
            {onNavigateToModeration && (
              <button
                id="btn-nav-moderation"
                onClick={onNavigateToModeration}
                className="flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 px-3.5 py-2.5 rounded-full transition-all text-xs font-telugu"
                title="పదాల సమీక్ష వేదిక"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>సమీక్ష</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-stone-900 rounded-full text-[10px] font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            {/* Export CSV / JSON Button */}
            <button
              id="btn-export-data"
              onClick={onOpenExport}
              className="flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200/90 border border-amber-500/30 px-3.5 py-2.5 rounded-full shadow transition-all text-xs font-telugu"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>ఎక్స్పోర్ట్</span>
            </button>

            {/* Firebase Database Sync Modal */}
            <button
              id="btn-firebase-sync"
              onClick={onOpenFirebase}
              className="flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 px-3 py-2.5 rounded-full transition-all text-xs font-telugu"
              title="ఫైర్‌బేస్ క్లౌడ్ డేటా"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">క్లౌడ్</span>
            </button>

            {/* Settings Button */}
            <button
              id="btn-settings-toggle"
              onClick={onOpenSettings}
              className="p-2.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 rounded-full transition-all"
              title="సెట్టింగులు & ప్రామాణిక అవధి"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
