'use client';

import React, { useState } from 'react';
import { X, Sparkles, Plus, Loader2, Clock } from 'lucide-react';
import { EnglishConcept, TeluguProposal } from '@/types/dictionary';
import { getBrevityInfo } from '@/lib/linguistics';

interface AddTeluguProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  concept: EnglishConcept | null;
  onAddProposal: (conceptId: string, proposal: TeluguProposal) => void;
  currentUserId: string;
  currentUserName: string;
}

export const AddTeluguProposalModal: React.FC<AddTeluguProposalModalProps> = ({
  isOpen,
  onClose,
  concept,
  onAddProposal,
  currentUserId,
  currentUserName
}) => {
  const [teluguWord, setTeluguWord] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [rationale, setRationale] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  if (!isOpen || !concept) return null;

  const brevity = teluguWord ? getBrevityInfo(teluguWord) : null;

  const handleGenerateAI = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/gemini/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          englishWord: concept.englishWord,
          englishDefinition: concept.englishDefinition,
          category: concept.category
        })
      });
      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        setAiSuggestions(data.suggestions);
        const first = data.suggestions[0];
        setTeluguWord(first.teluguWord || '');
        setTransliteration(first.transliteration || '');
        setRationale(first.rationale || '');
        setExampleSentence(first.exampleSentence || '');
      }
    } catch (e) {
      console.error('AI error:', e);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleApplyAISuggestion = (sug: any) => {
    setTeluguWord(sug.teluguWord);
    setTransliteration(sug.transliteration);
    setRationale(sug.rationale);
    setExampleSentence(sug.exampleSentence);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teluguWord.trim()) return;

    const newProposal: TeluguProposal = {
      id: `prop-${Date.now()}`,
      conceptId: concept.id,
      teluguWord: teluguWord.trim(),
      transliteration: transliteration.trim(),
      rationale: rationale.trim() || 'ఆంగ్ల భావనకు సమగ్రమైన తెలుగింపు.',
      exampleSentence: exampleSentence.trim(),
      contributorName: currentUserName || 'తెలుగు మిత్రుడు',
      contributorId: currentUserId,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      downvotes: 0,
      status: 'pending', // Submissions enter pending review
      votedUserIds: { [currentUserId]: 'up' },
      isStandardized: false
    };

    onAddProposal(concept.id, newProposal);
    onClose();

    // Reset
    setTeluguWord('');
    setTransliteration('');
    setRationale('');
    setExampleSentence('');
    setAiSuggestions([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-[#FCFAF7] border border-[#E0D5BE] rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="telugu-maroon-gradient text-amber-50 px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div>
            <span className="text-[11px] text-amber-300 font-serif italic uppercase tracking-wider block">
              {concept.englishWord} కోసం
            </span>
            <h3 className="text-xl font-bold font-telugu text-amber-100">
              + నూతన తెలుగు పద ప్రతిపాదన
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-amber-900/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Moderation Notice */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs font-telugu text-amber-900 flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>పరిశీలన ప్రక్రియ: </strong>
              మీ ప్రతిపాదన మోడరేషన్ డెస్క్ లో సమీక్షకు చేరుతుంది. ఆమోదం పొందిన తర్వాత ప్రజా ఓటింగ్ లో పాల్గొంటుంది.
            </div>
          </div>

          {/* AI Suggestion Box */}
          <div className="bg-[#FFF9EE] border border-[#F3DFC1] rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-telugu text-amber-900">
              <strong className="text-[#8B2500]">💡 AI సలహా: </strong>
              ఈ భావనకు అనువైన తెలుగు ప్రత్యామ్నాయ పదాలను శోధించండి.
            </div>
            <button
              type="button"
              id="btn-ai-suggest-for-concept"
              disabled={isLoadingAI}
              onClick={handleGenerateAI}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow font-telugu transition-all shrink-0"
            >
              {isLoadingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>శోధిస్తోంది...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>AI తో సూచించు</span>
                </>
              )}
            </button>
          </div>

          {/* AI Suggestions Pills */}
          {aiSuggestions.length > 0 && (
            <div className="space-y-2 bg-amber-50/70 border border-amber-200 rounded-2xl p-3">
              <span className="text-xs font-bold font-telugu text-amber-900">AI ప్రతిపాదనలు (ఎంచుకోండి):</span>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyAISuggestion(sug)}
                    className="px-3 py-1.5 bg-white border border-amber-300 hover:border-amber-600 rounded-xl text-xs font-telugu text-stone-800 hover:bg-amber-100/50 transition-all text-left shadow-2xs"
                  >
                    <strong className="text-[#7D191D]">{sug.teluguWord}</strong> <span className="text-stone-500 italic">({sug.transliteration})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Telugu Word Input */}
          <div>
            <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
              తెలుగు పదం (Telugu Word) <span className="text-rose-600">*</span>
            </label>
            <input
              id="input-add-telugu-word-field"
              type="text"
              required
              value={teluguWord}
              onChange={(e) => setTeluguWord(e.target.value)}
              placeholder="ఉదా: సంగణకం, గణకి, తెరపటం..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-base text-[#6B1114] font-bold focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-telugu shadow-xs"
            />

            {/* Live Brevity Indicator */}
            {brevity && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-telugu">
                <span className={`px-2 py-0.5 rounded-full border ${brevity.colorClass} font-bold`}>
                  ⚡ {brevity.count} అక్షరాలు - {brevity.label} (+{brevity.bonus} బోనస్)
                </span>
              </div>
            )}
          </div>

          {/* Transliteration */}
          <div>
            <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
              ఆంగ్ల లిప్యంతరీకరణ (English Transliteration)
            </label>
            <input
              id="input-add-translit-field"
              type="text"
              value={transliteration}
              onChange={(e) => setTransliteration(e.target.value)}
              placeholder="e.g. Sanganakam, Ganaki..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-serif italic"
            />
          </div>

          {/* Rationale */}
          <div>
            <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
              ఎందుకు? అర్థ సమర్థన (Rationale / Etymology) <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="input-add-rationale-field"
              required
              rows={2}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="ఈ పదాన్ని ఎందుకు ఎంచుకున్నారు? మూలం & అర్థం ఏమిటి?..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-telugu"
            />
          </div>

          {/* Example Sentence */}
          <div>
            <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
              వాక్య ప్రయోగం (Example Sentence)
            </label>
            <input
              id="input-add-example-sentence-field"
              type="text"
              value={exampleSentence}
              onChange={(e) => setExampleSentence(e.target.value)}
              placeholder="నిత్య జీవితంలో ఈ పదాన్ని ఎలా వాడవచ్చు..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-telugu"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-800 font-telugu"
            >
              రద్దు చేయండి
            </button>

            <button
              type="submit"
              id="btn-submit-telugu-proposal"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-md font-telugu transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>ప్రతిపాదనను సమర్పించండి</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
