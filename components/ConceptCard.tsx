'use client';

import React, { useState } from 'react';
import { EnglishConcept, TeluguProposal, ModerationStatus } from '@/types/dictionary';
import { Volume2, ThumbsUp, ThumbsDown, Award, Plus, Sparkles, Clock, CheckCircle2, XCircle, ShieldCheck, Flame } from 'lucide-react';
import { speakWord } from '@/lib/storage';
import { getBrevityInfo, calculateLongevityDays, calculateDictionaryFitnessScore } from '@/lib/linguistics';
import confetti from 'canvas-confetti';

interface ConceptCardProps {
  concept: EnglishConcept;
  onVote: (conceptId: string, proposalId: string, type: 'up' | 'down') => void;
  onOpenAddProposal: (concept: EnglishConcept) => void;
  onModerateProposal?: (conceptId: string, proposalId: string, newStatus: ModerationStatus, note?: string) => void;
  currentUserId: string;
  threshold: number;
  isModerator?: boolean;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  concept,
  onVote,
  onOpenAddProposal,
  onModerateProposal,
  currentUserId,
  threshold,
  isModerator = false
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSpeak = (prop: TeluguProposal) => {
    setPlayingId(prop.id);
    speakWord(prop.teluguWord, prop.transliteration);
    setTimeout(() => {
      setPlayingId(null);
    }, 1500);
  };

  const handleVoteClick = (proposalId: string, type: 'up' | 'down', currentNet: number) => {
    onVote(concept.id, proposalId, type);
    if (type === 'up' && currentNet + 1 >= threshold) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D97706', '#701518', '#F59E0B', '#10B981']
      });
    }
  };

  // Sort proposals by Dictionary Fitness Score (Net Upvotes + Brevity Bonus + Longevity - Penalties)
  const sortedProposals = [...(concept.proposals || [])].sort((a, b) => {
    const scoreA = calculateDictionaryFitnessScore(a);
    const scoreB = calculateDictionaryFitnessScore(b);
    return scoreB - scoreA;
  });

  return (
    <div className="w-full bg-[#FCFAF7] border border-[#E8DFC9] rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      
      {/* Top Bar: Category Pill, Concept Status & "+ నా తెలుగు పదం" Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        
        <div className="flex items-center gap-2">
          {/* Category Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs font-semibold rounded-full font-telugu">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            {concept.category}
          </span>

          {/* Pending Concept Status Tag */}
          {concept.status === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[11px] font-bold font-telugu">
              <Clock className="w-3 h-3" />
              <span>భావన సమీక్షలో ఉంది</span>
            </span>
          )}
        </div>

        {/* Propose Telugu Word Button */}
        <button
          id={`btn-add-telugu-proposal-${concept.id}`}
          onClick={() => onOpenAddProposal(concept)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-amber-50 text-[#7D191D] hover:text-[#5E0D10] border border-[#7D191D]/30 hover:border-[#7D191D] text-xs sm:text-sm font-bold rounded-full font-telugu transition-all active:scale-95 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ నా తెలుగు పదం (Propose Translation)</span>
        </button>
      </div>

      {/* English Concept Title & Definition */}
      <div className="mb-5">
        <h2 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#6B1114] tracking-tight mb-1">
          {concept.englishWord}
        </h2>
        {concept.englishDefinition && (
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
            {concept.englishDefinition}
          </p>
        )}
      </div>

      {/* Translations Header Label */}
      <div className="flex items-center justify-between mb-3 text-xs font-telugu text-stone-500 border-b border-stone-200/60 pb-1.5">
        <span className="font-bold text-stone-700 flex items-center gap-1">
          <span>తెలుగు ప్రత్యామ్నాయ పదాలు (Telugu Translations & Alternatives):</span>
          <span className="text-[11px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-full">
            {sortedProposals.length}
          </span>
        </span>
        <span className="text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          💡 సంక్షిప్తత + ఓట్లు + జీవనకాలం ప్రాతిపదికన వర్గీకరణ
        </span>
      </div>

      {/* Proposals Container */}
      <div className="space-y-3.5">
        {sortedProposals && sortedProposals.length > 0 ? (
          sortedProposals.map((prop, index) => {
            const netVotes = prop.upvotes - prop.downvotes;
            const isStandardized = netVotes >= threshold || prop.isStandardized;
            const userVote = prop.votedUserIds?.[currentUserId];
            const progressPercent = Math.min(100, Math.max(0, (netVotes / threshold) * 100));
            
            const brevity = getBrevityInfo(prop.teluguWord);
            const longevityDays = calculateLongevityDays(prop.createdAt);
            const fitnessScore = calculateDictionaryFitnessScore(prop);

            const isTopRanked = index === 0;

            return (
              <div
                key={prop.id}
                className={`telugu-proposal-card rounded-2xl p-4 sm:p-5 relative transition-all border ${
                  isStandardized 
                    ? 'bg-gradient-to-r from-[#FFFDF9] to-[#FEF9EE] border-amber-400 ring-1 ring-amber-400/60 shadow-xs' 
                    : isTopRanked
                    ? 'bg-white border-amber-300 shadow-2xs'
                    : 'bg-[#FAF8F5] border-stone-200'
                }`}
              >
                {/* Top Badge: Standardized or Leading Candidate */}
                {isStandardized ? (
                  <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow flex items-center gap-1 font-telugu">
                    <Award className="w-3 h-3 text-amber-200" />
                    <span>🏆 నిఘంటువులో స్థిరపడింది (Nigantu Standardized)</span>
                  </div>
                ) : isTopRanked && netVotes > 0 ? (
                  <div className="absolute -top-2.5 right-4 bg-[#7D191D] text-amber-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1 font-telugu">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>అగ్రగామి ఎంపిక (Top Candidate)</span>
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left Column: Word, Length Tag, Brevity, Rationale, Example */}
                  <div className="flex-1 space-y-2.5">
                    
                    {/* Word, Transliteration, Brevity Badge & Speaker */}
                    <div className="flex items-center flex-wrap gap-2.5">
                      <span className="text-2xl sm:text-2xl font-bold font-telugu text-[#6B1114]">
                        {prop.teluguWord}
                      </span>

                      {prop.transliteration && (
                        <span className="text-stone-500 font-serif italic text-sm">
                          ({prop.transliteration})
                        </span>
                      )}

                      {/* Speaker Pronunciation Button */}
                      <button
                        id={`btn-pronounce-${prop.id}`}
                        onClick={() => handleSpeak(prop)}
                        aria-label={`Pronounce ${prop.teluguWord}`}
                        className={`p-1.5 rounded-full transition-all ${
                          playingId === prop.id
                            ? 'bg-amber-200 text-amber-900 scale-110'
                            : 'text-stone-400 hover:text-amber-800 hover:bg-amber-100/60'
                        }`}
                        title="ఉచ్చారణ వినండి (Listen Pronunciation)"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {/* Brevity & Word Length Pill (The shorter is the better) */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${brevity.colorClass} font-telugu`}>
                        <span>⚡ {brevity.count} అక్షరాలు</span>
                        <span className="text-[10px] opacity-80">({brevity.label})</span>
                      </span>

                      {/* Longevity & Fitness Score Tags */}
                      <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-telugu border border-stone-200" title="సమాజంలో ఆమోదం పొందిన రోజులు">
                        ⏳ {longevityDays > 0 ? `${longevityDays} రోజులు` : 'ఈ రోజే ప్రతిపాదించబడింది'}
                      </span>

                      {/* Moderation Status Pill if not standard approved */}
                      {prop.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-bold font-telugu">
                          <Clock className="w-3 h-3" />
                          <span>పరిశీలనలో ఉంది</span>
                        </span>
                      )}
                    </div>

                    {/* Rationale / Meaning (ఎందుకు / అర్థం) */}
                    {prop.rationale && (
                      <div className="text-xs sm:text-[13px] leading-relaxed font-telugu text-stone-800">
                        <strong className="text-stone-900 font-bold">ఎందుకు / అర్థం: </strong>
                        <span>{prop.rationale}</span>
                      </div>
                    )}

                    {/* Example Sentence (ఉదాహరణ) */}
                    {prop.exampleSentence && (
                      <div className="text-xs sm:text-[12px] font-telugu text-stone-600 bg-amber-50/60 border-l-2 border-amber-600/50 pl-2.5 py-1 rounded-r">
                        <strong className="text-stone-700 font-semibold">ఉదాహరణ: </strong>
                        <span className="italic">&ldquo;{prop.exampleSentence}&rdquo;</span>
                      </div>
                    )}

                    {/* Contributor & Fitness Metric Line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-telugu text-stone-500 pt-0.5">
                      <div>
                        ప్రతిపాదించినవారు: <span className="font-semibold text-stone-700">{prop.contributorName || 'తెలుగు మిత్రుడు'}</span>
                      </div>
                      <div className="text-stone-600 font-sans text-[11px]">
                        నిఘంటు అర్హత స్కోరు: <strong className="text-[#6B1114]">{fitnessScore} pts</strong>
                      </div>
                    </div>

                    {/* Progress to Dictionary Threshold */}
                    {!isStandardized && (
                      <div className="pt-1 max-w-xs">
                        <div className="flex items-center justify-between text-[10px] text-stone-500 font-telugu mb-1">
                          <span>నిఘంటువు అర్హత: {netVotes} / {threshold} ఓట్లు</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Moderator Quick Action Panel if word is pending and user is moderator */}
                    {isModerator && prop.status === 'pending' && onModerateProposal && (
                      <div className="pt-2 border-t border-amber-200/60 flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900 font-telugu">మోడరేటర్ చర్య:</span>
                        <button
                          onClick={() => onModerateProposal(concept.id, prop.id, 'approved', 'ఆమోదించబడింది')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold font-telugu shadow-2xs"
                        >
                          ✓ ఆమోదించు
                        </button>
                        <button
                          onClick={() => onModerateProposal(concept.id, prop.id, 'rejected', 'తిరస్కరించబడింది')}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-md text-xs font-semibold font-telugu"
                        >
                          ✕ తిరస్కరించు
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Right Column: Voting Action Group (Thumb Up / Net / Thumb Down) */}
                  <div className="flex sm:flex-col items-center justify-end gap-1.5 shrink-0 self-end sm:self-center">
                    
                    <div className="flex items-center bg-white border border-stone-200/90 rounded-xl p-1 shadow-xs">
                      
                      {/* Upvote Button */}
                      <button
                        id={`btn-upvote-${prop.id}`}
                        onClick={() => handleVoteClick(prop.id, 'up', netVotes)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          userVote === 'up'
                            ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-400'
                            : 'hover:bg-stone-100 text-stone-600'
                        }`}
                        title="ఈ పదాన్ని ఎంచుకోండి (+1 Upvote)"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${userVote === 'up' ? 'text-emerald-700 fill-emerald-600' : ''}`} />
                        <span className="font-sans font-bold">{prop.upvotes}</span>
                      </button>

                      {/* Net Score Badge */}
                      <div className={`px-2 text-xs font-bold font-sans ${
                        netVotes > 0 ? 'text-emerald-700' : netVotes < 0 ? 'text-rose-700' : 'text-stone-500'
                      }`}>
                        {netVotes > 0 ? `+${netVotes}` : netVotes}
                      </div>

                      {/* Downvote Button */}
                      <button
                        id={`btn-downvote-${prop.id}`}
                        onClick={() => handleVoteClick(prop.id, 'down', netVotes)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          userVote === 'down'
                            ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-400'
                            : 'hover:bg-stone-100 text-stone-600'
                        }`}
                        title="సరికాదు అని భావిస్తే (-1 Downvote)"
                      >
                        <ThumbsDown className={`w-3.5 h-3.5 ${userVote === 'down' ? 'text-rose-700 fill-rose-600' : ''}`} />
                        <span className="font-sans font-bold">{prop.downvotes}</span>
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-amber-50/50 border border-dashed border-amber-200 rounded-xl p-5 text-center font-telugu">
            <p className="text-stone-600 text-sm mb-2">ఈ ఆంగ్ల భావనకు ఇంకా ఎవరూ తెలుగు పదాన్ని ప్రతిపాదించలేదు.</p>
            <button
              onClick={() => onOpenAddProposal(concept)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#7D191D] hover:bg-[#5E0D10] text-amber-100 text-xs font-bold rounded-full shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>మొదటి తెలుగు పదాన్ని ప్రతిపాదించండి</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
