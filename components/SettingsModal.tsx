'use client';

import React, { useState } from 'react';
import { X, Settings2, Sliders, RotateCcw, Check, Info } from 'lucide-react';
import { INITIAL_CONCEPTS } from '@/lib/initial-data';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  threshold: number;
  onSaveThreshold: (val: number) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  threshold,
  onSaveThreshold,
  onResetData
}) => {
  const [val, setVal] = useState<number>(threshold);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveThreshold(val);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleResetConfirm = () => {
    if (confirm('మీరు నిఘంటువులోని డేటాను అసలు ప్రారంభ స్థితికి రీసెట్ చేయాలనుకుంటున్నారా?')) {
      onResetData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-[#FCFAF7] border border-[#E0D5BE] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="telugu-maroon-gradient text-amber-50 px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div>
            <h3 className="text-lg font-bold font-telugu text-amber-100 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-amber-400" />
              <span>నియమావళి & సెట్టింగులు (Settings)</span>
            </h3>
            <p className="text-xs text-amber-200/80 font-telugu">
              నిఘంటువు ప్రామాణిక నిబంధనల నిర్వహణ
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
        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {/* Threshold Setting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-telugu text-stone-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-700" />
                <span>హాల్ ఆఫ్ ఫేమ్ అర్హత ఓట్ల అవధి (Upvote Threshold):</span>
              </label>
              <span className="text-sm font-bold font-sans text-[#6B1114] bg-amber-100 px-2 py-0.5 rounded">
                {val} ఓట్లు
              </span>
            </div>

            <input
              id="range-threshold-slider"
              type="range"
              min={1}
              max={50}
              value={val}
              onChange={(e) => setVal(parseInt(e.target.value, 10))}
              className="w-full accent-[#7D191D] cursor-pointer"
            />

            <div className="flex items-center justify-between text-[11px] font-telugu text-stone-500">
              <button
                type="button"
                onClick={() => setVal(3)}
                className="hover:text-amber-800 underline"
              >
                పరీక్షకు (3 ఓట్లు)
              </button>
              <button
                type="button"
                onClick={() => setVal(30)}
                className="hover:text-amber-800 underline font-semibold text-[#6B1114]"
              >
                ప్రామాణికం (30 ఓట్లు)
              </button>
              <button
                type="button"
                onClick={() => setVal(40)}
                className="hover:text-amber-800 underline"
              >
                కఠినం (40 ఓట్లు)
              </button>
            </div>

            <p className="text-[11px] font-telugu text-stone-600 leading-relaxed bg-[#FFF9EE] p-2.5 rounded-lg border border-[#F3DFC1]">
              నికర ఓట్లు (Upvotes - Downvotes) ఈ సంఖ్యకు చేరుకున్నప్పుడు ఆ పదం శాశ్వత నిఘంటువులో స్థిరపడినదిగా గుర్తించబడుతుంది.
            </p>
          </div>

          {/* Reset Initial Dataset Option */}
          <div className="pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold font-telugu text-stone-800 block">
                  ప్రారంభ డేటా రీసెట్ (Reset Sample Data)
                </span>
                <span className="text-[11px] font-telugu text-stone-500">
                  అసలు తెలుగు సాంకేతిక పదాల ప్రాథమిక జాబితాను పునరుద్ధరించండి
                </span>
              </div>
              <button
                id="btn-reset-initial-data"
                type="button"
                onClick={handleResetConfirm}
                className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-300 rounded-lg text-xs font-semibold font-telugu transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>రీసెట్</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-800 font-telugu"
            >
              రద్దు
            </button>

            <button
              id="btn-save-settings"
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-[#7D191D] hover:bg-[#5E0D10] text-amber-100 font-bold text-xs sm:text-sm rounded-lg shadow font-telugu transition-all active:scale-95"
            >
              {isSaved ? <Check className="w-4 h-4" /> : null}
              <span>{isSaved ? 'సేవ్ అయ్యింది!' : 'సెట్టింగులు సేవ్ చేయండి'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
