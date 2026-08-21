'use client';

import React, { useState } from 'react';
import { X, Sparkles, Plus, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import { EnglishConcept, TeluguProposal, Category } from '@/types/dictionary';
import { TELUGU_CATEGORIES } from '@/lib/initial-data';
import { getBrevityInfo } from '@/lib/linguistics';

interface AddConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConcept: (concept: EnglishConcept) => void;
  currentUserId: string;
  currentUserName: string;
}

export const AddConceptModal: React.FC<AddConceptModalProps> = ({
  isOpen,
  onClose,
  onAddConcept,
  currentUserId,
  currentUserName
}) => {
  const [englishWord, setEnglishWord] = useState('');
  const [category, setCategory] = useState<string>('దైనందిన సాంకేతికత (Daily Tech)');
  const [englishDefinition, setEnglishDefinition] = useState('');

  // Initial Telugu proposal (optional)
  const [teluguWord, setTeluguWord] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [rationale, setRationale] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  if (!isOpen) return null;

  const brevity = teluguWord ? getBrevityInfo(teluguWord) : null;

  const handleGenerateAI = async () => {
    if (!englishWord.trim()) {
      alert('దయచేసి ముందుగా ఆంగ్ల పదం (English Word) నమోదు చేయండి.');
      return;
    }

    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/gemini/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          englishWord,
          englishDefinition,
          category
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
      console.error('AI Suggestion error:', e);
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
    if (!englishWord.trim()) return;

    const conceptId = `concept-${Date.now()}`;
    const proposals: TeluguProposal[] = [];

    if (teluguWord.trim()) {
      proposals.push({
        id: `prop-${Date.now()}-1`,
        conceptId,
        teluguWord: teluguWord.trim(),
        transliteration: transliteration.trim(),
        rationale: rationale.trim() || 'ఆంగ్ల భావనకు తగిన సహజమైన తెలుగు వ్యక్తీకరణ.',
        exampleSentence: exampleSentence.trim(),
        contributorName: currentUserName || 'తెలుగు మిత్రుడు',
        contributorId: currentUserId,
        createdAt: new Date().toISOString(),
        upvotes: 1,
        downvotes: 0,
        status: 'pending', // Submissions enter pending review
        votedUserIds: { [currentUserId]: 'up' },
        isStandardized: false
      });
    }

    const newConcept: EnglishConcept = {
      id: conceptId,
      englishWord: englishWord.trim(),
      category: category || 'దైనందిన సాంకేతికత (Daily Tech)',
      englishDefinition: englishDefinition.trim(),
      createdAt: new Date().toISOString(),
      createdBy: currentUserName,
      creatorId: currentUserId,
      status: 'pending', // New concept enters pending review
      proposals
    };

    onAddConcept(newConcept);
    onClose();
    // Reset form
    setEnglishWord('');
    setEnglishDefinition('');
    setTeluguWord('');
    setTransliteration('');
    setRationale('');
    setExampleSentence('');
    setAiSuggestions([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-[#FCFAF7] border border-[#E0D5BE] rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="telugu-maroon-gradient text-amber-50 px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div>
            <h3 className="text-xl font-bold font-telugu text-amber-100 flex items-center gap-2">
              <span>+ కొత్త ఆంగ్ల పదం చేర్చండి</span>
            </h3>
            <p className="text-xs text-amber-200/80 font-telugu">
              ఆంగ్ల పద భావనకు లేదా ఆధునిక సాంకేతిక భావనకు తెలుగింపు ప్రతిపాదన
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-amber-900/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Moderation notice */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs font-telugu text-amber-900 flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>గమనిక: </strong>
              సమర్పించిన కొత్త పదాలు సమీక్షకు (Moderation Queue) వెళ్తాయి. ఆమోదం పొందిన వెంటనే ప్రజా ఓటింగ్ వేదికలో ప్రత్యక్షమవుతాయి.
            </div>
          </div>

          {/* English Word Input & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
                ఆంగ్ల పదం (English Word) <span className="text-rose-600">*</span>
              </label>
              <input
                id="input-new-english-word"
                type="text"
                required
                value={englishWord}
                onChange={(e) => setEnglishWord(e.target.value)}
                placeholder="ఉదా: Drone, Cloud, Avatar..."
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-sans font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
                వర్గం (Category)
              </label>
              <select
                id="select-new-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-telugu"
              >
                {TELUGU_CATEGORIES.filter(c => !c.startsWith('అన్నీ')).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* English Definition */}
          <div>
            <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
              ఆంగ్ల వివరణ (Definition / Context in English)
            </label>
            <textarea
              id="input-new-english-def"
              rows={2}
              value={englishDefinition}
              onChange={(e) => setEnglishDefinition(e.target.value)}
              placeholder="Brief explanation of what this word means in modern context..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-sans"
            />
          </div>

          {/* AI Helper Banner */}
          <div className="bg-[#FFF9EE] border border-[#F3DFC1] rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-telugu text-amber-900">
              <span className="font-bold text-[#8B2500]">💡 భాషా సాయం: </span>
              ఆంగ్ల పదం నమోదు చేసి AI తో సంక్షిప్త తెలుగు పద ప్రతిపాదనలు పొందండి.
            </div>
            <button
              type="button"
              id="btn-generate-ai-suggestions"
              disabled={isLoadingAI || !englishWord.trim()}
              onClick={handleGenerateAI}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow font-telugu transition-all shrink-0"
            >
              {isLoadingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>రూపొందిస్తోంది...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>AI తో పదం సూచించు</span>
                </>
              )}
            </button>
          </div>

          {/* AI Suggestions Pills if generated */}
          {aiSuggestions.length > 0 && (
            <div className="space-y-2 bg-amber-50/70 border border-amber-200 rounded-2xl p-3">
              <span className="text-xs font-bold font-telugu text-amber-900">AI సూచించిన పదాలు (క్లిక్ చేసి ఎంచుకోండి):</span>
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

          {/* Initial Telugu Word Proposal Section */}
          <div className="pt-2 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-telugu text-[#6B1114]">
                తెలుగు పదం (Telugu Word Proposal) - ఐచ్ఛికం / Optional
              </span>
              <span className="text-[11px] font-telugu text-stone-500">
                (చిన్నదైన పదం ప్రాధాన్యత పొందుతుంది)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium font-telugu text-stone-700 mb-1">
                  తెలుగు పదం (Telugu Script)
                </label>
                <input
                  id="input-proposal-telugu-word"
                  type="text"
                  value={teluguWord}
                  onChange={(e) => setTeluguWord(e.target.value)}
                  placeholder="ఉదా: నింగిగూఢచారి, సంగణకం, గణకి..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-telugu font-bold text-[#6B1114]"
                />
                
                {/* Live Brevity Indicator */}
                {brevity && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-telugu">
                    <span className={`px-2 py-0.5 rounded-full border ${brevity.colorClass} font-bold`}>
                      ⚡ {brevity.count} అక్షరాలు - {brevity.label} (+{brevity.bonus} బోనస్ పాయింట్లు)
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium font-telugu text-stone-700 mb-1">
                  లిప్యంతరీకరణ (English Transliteration)
                </label>
                <input
                  id="input-proposal-translit"
                  type="text"
                  value={transliteration}
                  onChange={(e) => setTransliteration(e.target.value)}
                  placeholder="e.g. Ganaki, Sanganakam..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-serif italic"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium font-telugu text-stone-700 mb-1">
                ఎందుకు / అర్థ సమర్థన (Rationale / Etymology)
              </label>
              <textarea
                id="input-proposal-rationale"
                rows={2}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="ఈ పదాన్ని ఎందుకు ఎంచుకున్నారు? అర్థ వివరణ..."
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-telugu"
              />
            </div>

            <div>
              <label className="block text-xs font-medium font-telugu text-stone-700 mb-1">
                ఉదాహరణ వాక్యం (Example Sentence in Telugu)
              </label>
              <input
                id="input-proposal-example"
                type="text"
                value={exampleSentence}
                onChange={(e) => setExampleSentence(e.target.value)}
                placeholder="నిత్య వ్యవహారంలో ఎలా వాడవచ్చో ఉదాహరణ..."
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-telugu"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-800 font-telugu"
            >
              రద్దు చేయండి (Cancel)
            </button>

            <button
              type="submit"
              id="btn-submit-add-concept"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 font-bold text-xs sm:text-sm rounded-xl shadow-md font-telugu transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>పదాన్ని సమర్పించండి (Submit)</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
