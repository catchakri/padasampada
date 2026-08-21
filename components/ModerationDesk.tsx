'use client';

import React, { useState } from 'react';
import { EnglishConcept, TeluguProposal, ModerationStatus } from '@/types/dictionary';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Volume2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { speakWord } from '@/lib/storage';
import { getBrevityInfo, calculateLongevityDays } from '@/lib/linguistics';

interface ModerationDeskProps {
  concepts: EnglishConcept[];
  onModerateProposal: (conceptId: string, proposalId: string, newStatus: ModerationStatus, note?: string) => void;
  onModerateConcept: (conceptId: string, newStatus: ModerationStatus, note?: string) => void;
  onBatchApproveAll: () => void;
  currentUserName: string;
}

export const ModerationDesk: React.FC<ModerationDeskProps> = ({
  concepts,
  onModerateProposal,
  onModerateConcept,
  onBatchApproveAll,
  currentUserName
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'proposals' | 'concepts'>('all');
  const [rejectionNote, setRejectionNote] = useState<string>('');
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);

  // Gather pending items
  const pendingConcepts = concepts.filter(c => c.status === 'pending');
  
  const pendingProposalsList: { concept: EnglishConcept; proposal: TeluguProposal }[] = [];
  concepts.forEach(c => {
    (c.proposals || []).forEach(p => {
      if (p.status === 'pending') {
        pendingProposalsList.push({ concept: c, proposal: p });
      }
    });
  });

  const totalPending = pendingConcepts.length + pendingProposalsList.length;

  const handleRejectSubmit = (conceptId: string, proposalId?: string) => {
    const note = rejectionNote.trim() || 'భాషా ప్రమాణాలకు లేదా నిబంధనలకు అనుగుణంగా లేనందున తిరస్కరించబడింది.';
    if (proposalId) {
      onModerateProposal(conceptId, proposalId, 'rejected', note);
    } else {
      onModerateConcept(conceptId, 'rejected', note);
    }
    setActiveRejectId(null);
    setRejectionNote('');
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      
      {/* Moderation Desk Banner Header */}
      <div className="bg-gradient-to-r from-[#5E0D10] to-[#801318] text-amber-50 rounded-2xl p-5 sm:p-6 shadow-md border border-amber-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
              <h2 className="text-xl sm:text-2xl font-bold font-telugu text-amber-100">
                పద పరిశీలన & మోడరేషన్ వేదిక (Word Moderation Desk)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/90 font-telugu max-w-2xl">
              వినియోగదారులు ప్రతిపాదించిన కొత్త పదాలు ప్రజా ఓటింగ్ వేదికకు చేరేముందు సంస్కృతి, అర్థం, వ్యాకరణ నాణ్యతను సమీక్షించండి.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {totalPending > 0 ? (
              <button
                id="btn-batch-approve-all"
                onClick={onBatchApproveAll}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold rounded-xl shadow text-xs sm:text-sm font-telugu transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>అన్నీ ఆమోదించు ({totalPending} Pending)</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-telugu font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>అన్ని పదాలు సమీక్షించబడ్డాయి</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-amber-500/20 text-xs font-telugu">
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <span className="text-amber-300/80 block text-[11px]">మొత్తం పరిశీలనలో ఉన్నవి</span>
            <strong className="text-lg font-bold text-amber-100">{totalPending}</strong>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <span className="text-amber-300/80 block text-[11px]">కొత్త భావనలు (Concepts)</span>
            <strong className="text-lg font-bold text-amber-100">{pendingConcepts.length}</strong>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <span className="text-amber-300/80 block text-[11px]">తెలుగు ప్రయోగాలు (Proposals)</span>
            <strong className="text-lg font-bold text-amber-100">{pendingProposalsList.length}</strong>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <span className="text-amber-300/80 block text-[11px]">సమీక్షకుడు</span>
            <strong className="text-sm font-bold text-amber-200 truncate block">{currentUserName}</strong>
          </div>
        </div>
      </div>

      {/* Filter Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg font-telugu transition-all ${
            selectedFilter === 'all'
              ? 'bg-[#7D191D] text-amber-50 shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          అన్నీ ({totalPending})
        </button>
        <button
          onClick={() => setSelectedFilter('concepts')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg font-telugu transition-all ${
            selectedFilter === 'concepts'
              ? 'bg-[#7D191D] text-amber-50 shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          కొత్త ఆంగ్ల భావనలు ({pendingConcepts.length})
        </button>
        <button
          onClick={() => setSelectedFilter('proposals')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg font-telugu transition-all ${
            selectedFilter === 'proposals'
              ? 'bg-[#7D191D] text-amber-50 shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          తెలుగు పద ప్రతిపాదనలు ({pendingProposalsList.length})
        </button>
      </div>

      {/* Main Review Queue */}
      {totalPending === 0 ? (
        <div className="w-full bg-white border border-[#E8DEC8] rounded-2xl p-10 text-center font-telugu shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">సమీక్షించడానికి పెండింగ్ పదాలు ఏవీ లేవు!</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            అన్ని వినియోగదారు సమర్పణలు పరిశీలించబడ్డాయి. కొత్త ప్రతిపాదనలు వచ్చినప్పుడు ఇక్కడ కనిపిస్తాయి.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Render Pending Concepts */}
          {(selectedFilter === 'all' || selectedFilter === 'concepts') &&
            pendingConcepts.map((concept) => (
              <div
                key={concept.id}
                className="bg-white border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-telugu">
                      కొత్త భావన (New Concept)
                    </span>
                    <span className="text-xs text-stone-500 font-telugu">{concept.category}</span>
                  </div>
                  <span className="text-xs font-mono text-stone-400">ID: {concept.id}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-serif italic text-[#6B1114]">
                    {concept.englishWord}
                  </h3>
                  {concept.englishDefinition && (
                    <p className="text-stone-600 text-xs sm:text-sm mt-1">{concept.englishDefinition}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 font-telugu pt-2 border-t border-stone-100">
                  <span>సమర్పించినవారు: <strong className="text-stone-700">{concept.createdBy}</strong></span>
                  <span>తేదీ: {new Date(concept.createdAt).toLocaleDateString('te-IN')}</span>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    id={`btn-approve-concept-${concept.id}`}
                    onClick={() => onModerateConcept(concept.id, 'approved', 'ఆమోదించబడింది')}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs font-telugu shadow transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ఆమోదించు (Approve)</span>
                  </button>

                  <button
                    id={`btn-reject-concept-${concept.id}`}
                    onClick={() => setActiveRejectId(concept.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-xs font-telugu transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>తిరస్కరించు (Reject)</span>
                  </button>
                </div>

                {/* Rejection Note Drawer */}
                {activeRejectId === concept.id && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-2 animate-in fade-in duration-150">
                    <label className="block text-xs font-bold text-rose-900 font-telugu">
                      తిరస్కరణ కారణం (Rejection Reason):
                    </label>
                    <input
                      type="text"
                      value={rejectionNote}
                      onChange={(e) => setRejectionNote(e.target.value)}
                      placeholder="ఉదా: నకిలీ పదం, అస్పష్టమైన నిర్వచనం..."
                      className="w-full bg-white border border-rose-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 font-telugu"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveRejectId(null)}
                        className="px-3 py-1 text-xs text-stone-600 font-telugu"
                      >
                        రద్దు
                      </button>
                      <button
                        onClick={() => handleRejectSubmit(concept.id)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded font-telugu"
                      >
                        నిర్ధారించు (Confirm Reject)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

          {/* Render Pending Proposals */}
          {(selectedFilter === 'all' || selectedFilter === 'proposals') &&
            pendingProposalsList.map(({ concept, proposal }) => {
              const brevity = getBrevityInfo(proposal.teluguWord);

              return (
                <div
                  key={proposal.id}
                  className="bg-white border-2 border-amber-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-telugu">
                        తెలుగు పదం పరిశీలన
                      </span>
                      <span className="text-xs font-serif italic text-stone-600">
                        Concept: <strong className="text-stone-900">{concept.englishWord}</strong>
                      </span>
                    </div>
                    
                    {/* Brevity Pill */}
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${brevity.colorClass} font-telugu`}>
                      ⚡ {brevity.count} అక్షరాలు ({brevity.label})
                    </span>
                  </div>

                  {/* Word & Audio */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold font-telugu text-[#6B1114]">
                      {proposal.teluguWord}
                    </span>
                    {proposal.transliteration && (
                      <span className="text-stone-500 font-serif italic text-sm">
                        ({proposal.transliteration})
                      </span>
                    )}
                    <button
                      onClick={() => speakWord(proposal.teluguWord, proposal.transliteration)}
                      className="p-1 text-stone-400 hover:text-amber-800 hover:bg-amber-100 rounded-full"
                      title="ఉచ్చారణ వినండి"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rationale & Example */}
                  {proposal.rationale && (
                    <div className="text-xs sm:text-sm font-telugu text-stone-800 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <strong className="text-stone-900">అర్థ సమర్థన: </strong>
                      <span>{proposal.rationale}</span>
                    </div>
                  )}

                  {proposal.exampleSentence && (
                    <div className="text-xs font-telugu text-stone-600 bg-amber-50/50 p-2 rounded border-l-2 border-amber-600">
                      <strong>ఉదాహరణ: </strong>
                      <span className="italic">&ldquo;{proposal.exampleSentence}&rdquo;</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-stone-500 font-telugu pt-2 border-t border-stone-100">
                    <span>ప్రతిపాదించినవారు: <strong className="text-stone-700">{proposal.contributorName}</strong></span>
                    <span>తేదీ: {new Date(proposal.createdAt).toLocaleDateString('te-IN')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      id={`btn-approve-prop-${proposal.id}`}
                      onClick={() => onModerateProposal(concept.id, proposal.id, 'approved', 'ఆమోదించబడింది')}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs font-telugu shadow transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ఆమోదించు (Approve to Voting)</span>
                    </button>

                    <button
                      id={`btn-reject-prop-${proposal.id}`}
                      onClick={() => setActiveRejectId(proposal.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-xs font-telugu transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>తిరస్కరించు (Reject)</span>
                    </button>
                  </div>

                  {/* Rejection Note Drawer */}
                  {activeRejectId === proposal.id && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-2 animate-in fade-in duration-150">
                      <label className="block text-xs font-bold text-rose-900 font-telugu">
                        తిరస్కరణ కారణం (Rejection Reason):
                      </label>
                      <input
                        type="text"
                        value={rejectionNote}
                        onChange={(e) => setRejectionNote(e.target.value)}
                        placeholder="ఉదా: సరియైన అర్థం లేదు, అసభ్యకరమైన పదం, నకిలీ..."
                        className="w-full bg-white border border-rose-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 font-telugu"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveRejectId(null)}
                          className="px-3 py-1 text-xs text-stone-600 font-telugu"
                        >
                          రద్దు
                        </button>
                        <button
                          onClick={() => handleRejectSubmit(concept.id, proposal.id)}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded font-telugu"
                        >
                          నిర్ధారించు (Confirm Reject)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

        </div>
      )}

    </div>
  );
};
