'use client';

import React from 'react';
import { MugguStar } from '@/lib/muggu-patterns';
import { Sparkles, Info } from 'lucide-react';

interface NoticeBannerProps {
  threshold: number;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ threshold }) => {
  return (
    <div className="w-full bg-[#FFF9EE] border border-[#F3DFC1] rounded-xl p-3.5 sm:p-4 text-stone-800 shadow-sm relative overflow-hidden my-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-amber-700">
          <MugguStar className="w-5 h-5 animate-spin-slow" />
        </div>
        <div className="text-xs sm:text-[13px] leading-relaxed font-telugu text-[#5E3A18]">
          <strong className="text-[#8B2500] font-bold">సంప్రదాయ నియమం: </strong>
          ఆంగ్ల పదం కంటే సంక్షిప్తంగా ఉండి, సముదాయం నుండి కనీసం <strong className="text-[#B45309] underline decoration-amber-400 font-bold">{threshold} నికర ఆమోద ఓట్లు</strong> పొందిన పదం ఆటోమేటిక్‌గా <span className="font-bold text-[#8B2500]">హాల్ ఆఫ్ ఫేమ్ (ప్రామాణిక నిఘంటువు)</span> కి చేరుతుంది. హాల్ ఆఫ్ ఫేమ్ లో ఉన్న పదానికి ఎవరైనా నూతన ప్రత్యామ్నాయ పదాన్ని ప్రతిపాదిస్తే, అది ప్రజాస్వామ్యబద్ధంగా మళ్ళీ ఓటింగ్‌కై <span className="font-bold text-[#8B2500]">ప్రత్యక్ష ఫీడ్‌కు</span> మారుతుంది.
        </div>
      </div>
    </div>
  );
};
