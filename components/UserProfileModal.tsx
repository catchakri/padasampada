'use client';

import React, { useState } from 'react';
import { X, User, Award, ThumbsUp, BookOpen, Check } from 'lucide-react';
import { ContributorProfile } from '@/types/dictionary';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ContributorProfile;
  onSaveProfile: (profile: ContributorProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [name, setName] = useState(profile.name);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProfile({
      ...profile,
      name: name.trim()
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const sampleHandles = [
    'విజ్ఞాన అన్వేషకుడు',
    'తెలుగు మిత్రుడు',
    'భాషా ప్రేమికుడు',
    'నవీన తెలుగింపు',
    'సాహితీ వేదిక',
    'తెలుగు వికాసం'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-[#FCFAF7] border border-[#E0D5BE] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="telugu-maroon-gradient text-amber-50 px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div>
            <h3 className="text-lg font-bold font-telugu text-amber-100 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              <span>కంట్రిబ్యూటర్ ప్రొఫైల్ (Contributor Identity)</span>
            </h3>
            <p className="text-xs text-amber-200/80 font-telugu">
              మీరు ప్రతిపాదించే తెలుగు పదాల వద్ద కనిపించే పేరు
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-amber-900/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* User ID / Key Ribbon */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-telugu text-stone-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-stone-500">మీ ప్రత్యేక ఐడీ (User ID):</span>
              <span className="font-mono font-bold text-[#6B1114] bg-white px-2 py-0.5 rounded border border-amber-200">
                {profile.id}
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              ప్రతి వినియోగదారుడు నిష్పాక్షికంగా ఒకే ఓటు వేయడానికి ఈ గుర్తింపు ఉపయోగపడుతుంది.
            </p>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
              మీ పేరు లేదా మారుపేరు (Display Name / Contributor Handle) <span className="text-rose-600">*</span>
            </label>
            <input
              id="input-contributor-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ఉదా: తెలుగు మిత్రుడు, Catchakri, చక్రధర్..."
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-telugu font-semibold"
            />
          </div>

          {/* Suggested Telugu Handles */}
          <div>
            <span className="text-[11px] font-telugu text-stone-500 block mb-1.5">
              త్వరిత ఎంపికలు (Quick Handles):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleHandles.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => setName(handle)}
                  className="px-2.5 py-1 bg-white border border-stone-200 hover:border-amber-500 rounded-md text-xs font-telugu text-stone-700 hover:text-[#6B1114] hover:bg-amber-50 transition-all shadow-2xs"
                >
                  {handle}
                </button>
              ))}
            </div>
          </div>

          {/* User Contributions Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center font-telugu">
              <div className="flex items-center justify-center gap-1 text-stone-500 text-xs mb-0.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>ప్రతిపాదనలు</span>
              </div>
              <span className="text-lg font-bold text-stone-800">{profile.totalSubmissions || 0}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center font-telugu">
              <div className="flex items-center justify-center gap-1 text-stone-500 text-xs mb-0.5">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                <span>వేసిన ఓట్లు</span>
              </div>
              <span className="text-lg font-bold text-stone-800">{profile.totalVotesCast || 0}</span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-800 font-telugu"
            >
              రద్దు
            </button>

            <button
              id="btn-save-profile"
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 font-bold text-xs sm:text-sm rounded-lg shadow-md font-telugu transition-all active:scale-95"
            >
              {isSaved ? <Check className="w-4 h-4" /> : null}
              <span>{isSaved ? 'నమోదయ్యింది!' : 'సేవ్ చేయండి (Update Name)'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
