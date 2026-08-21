'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Award,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Check,
  Copy,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Flame,
  Volume2
} from 'lucide-react';
import { ContributorProfile, EnglishConcept, TeluguProposal } from '@/types/dictionary';
import { getBrevityInfo, calculateLongevityDays } from '@/lib/linguistics';
import { speakWord } from '@/lib/storage';

interface UserProfileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ContributorProfile;
  concepts: EnglishConcept[];
  onSaveProfile: (profile: ContributorProfile) => void;
  onSwitchUser?: (newUserId: string, newName: string) => void;
}

export const UserProfileDashboard: React.FC<UserProfileDashboardProps> = ({
  isOpen,
  onClose,
  profile,
  concepts,
  onSaveProfile,
  onSwitchUser
}) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || '');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'badges'>('overview');

  if (!isOpen) return null;

  // Find all proposals submitted by this user
  const userProposals: { concept: EnglishConcept; proposal: TeluguProposal }[] = [];
  concepts.forEach((concept) => {
    (concept.proposals || []).forEach((prop) => {
      if (prop.contributorId === profile.id) {
        userProposals.push({ concept, proposal: prop });
      }
    });
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProfile({
      ...profile,
      name: name.trim(),
      bio: bio.trim()
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1500);
  };

  const sampleHandles = [
    'విజ్ఞాన అన్వేషకుడు',
    'తెలుగు మిత్రుడు',
    'భాషా ప్రేమికుడు',
    'నవీన తెలుగింపు',
    'సాహితీ వేదిక',
    'నిఘంటు శిల్పి'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#FCFAF7] border border-[#E0D5BE] rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Ornate Header */}
        <div className="telugu-maroon-gradient text-amber-50 px-6 py-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-telugu text-amber-100 flex items-center gap-2">
                <span>{profile.name}</span>
                {profile.role === 'trusted_moderator' && (
                  <span className="px-2 py-0.5 bg-amber-400 text-stone-900 text-[10px] font-bold rounded-full font-telugu">
                    ధర్మకర్త / Moderator
                  </span>
                )}
              </h3>
              <p className="text-xs text-amber-200/80 font-telugu">
                కంట్రిబ్యూటర్ ప్రొఫైల్ & వ్యక్తిగత భాషా డాష్‌బోర్డ్
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-300 hover:text-white hover:bg-amber-900/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs in Modal */}
        <div className="flex items-center bg-[#F3EDE2] border-b border-[#E2D5BE] px-6 text-xs font-telugu">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#7D191D] text-[#7D191D]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            సమీక్ష & గుర్తింపు (Overview & Profile)
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'submissions'
                ? 'border-[#7D191D] text-[#7D191D]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>నా పదాలు (My Submissions)</span>
            <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full text-[10px]">
              {userProposals.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'badges'
                ? 'border-[#7D191D] text-[#7D191D]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>బిరుదులు & గౌరవాలు (Badges)</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: OVERVIEW & PROFILE EDIT */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* User ID & Key Info Ribbon */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-telugu">
                <div>
                  <span className="text-stone-500 block text-[11px]">ప్రత్యేక కంట్రిబ్యూటర్ ఐడీ (Unique User ID):</span>
                  <span className="font-mono font-bold text-sm text-[#6B1114]">{profile.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyId}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-amber-100/60 border border-amber-300 rounded-lg text-xs font-semibold text-stone-700 transition-all shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                    <span>{copied ? 'కాపీ అయ్యింది!' : 'ఐడీ కాపీ చేయండి'}</span>
                  </button>
                </div>
              </div>

              {/* 4-Stat Metric Cards Dashboard Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Words Added */}
                <div className="bg-white border border-amber-200/80 rounded-2xl p-3.5 text-center font-telugu shadow-2xs">
                  <div className="flex items-center justify-center gap-1 text-stone-500 text-xs mb-1">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span>జోడించిన పదాలు</span>
                  </div>
                  <div className="text-2xl font-bold text-[#6B1114]">{profile.totalSubmissions || userProposals.length}</div>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    ({profile.approvedSubmissions || userProposals.filter(p => p.proposal.status === 'approved').length} ఆమోదం)
                  </span>
                </div>

                {/* Total Upvotes Received */}
                <div className="bg-white border border-emerald-200/80 rounded-2xl p-3.5 text-center font-telugu shadow-2xs">
                  <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs mb-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>పొందిన అప్‌వోట్లు</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">+{profile.totalUpvotesReceived || 0}</div>
                  <span className="text-[10px] text-emerald-600/70 block mt-0.5">ప్రజా మద్దతు</span>
                </div>

                {/* Total Downvotes Received */}
                <div className="bg-white border border-rose-200/80 rounded-2xl p-3.5 text-center font-telugu shadow-2xs">
                  <div className="flex items-center justify-center gap-1 text-rose-700 text-xs mb-1">
                    <ThumbsDown className="w-4 h-4" />
                    <span>డౌన్‌వోట్లు</span>
                  </div>
                  <div className="text-2xl font-bold text-rose-700">{profile.totalDownvotesReceived || 0}</div>
                  <span className="text-[10px] text-rose-500/70 block mt-0.5">సవరణ అవసరం</span>
                </div>

                {/* Standardized in Nigantu */}
                <div className="bg-white border border-amber-300 rounded-2xl p-3.5 text-center font-telugu shadow-2xs">
                  <div className="flex items-center justify-center gap-1 text-amber-800 text-xs mb-1">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>నిఘంటువులో స్థిరం</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-800">{profile.standardizedCount || 0}</div>
                  <span className="text-[10px] text-amber-700/80 block mt-0.5">స్థిరపడిన పదాలు</span>
                </div>
              </div>

              {/* Secondary Stats Row: Votes Cast & Reputation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between font-telugu">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-500">భాషా కీర్తి గుణకం (Reputation Score)</div>
                      <div className="text-lg font-bold text-stone-900">{profile.reputationScore || 10} పాయింట్లు</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between font-telugu">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <ThumbsUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-500">వేసిన మొత్తం ఓట్లు (Total Votes Cast)</div>
                      <div className="text-lg font-bold text-stone-900">{profile.totalVotesCast || 0} ఓట్లు</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold font-telugu text-[#6B1114] flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-700" />
                  <span>కంట్రిబ్యూటర్ వివరాల సవరణ (Edit Profile Info)</span>
                </h4>

                <div>
                  <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
                    ప్రదర్శించబడే పేరు (Display Name / Contributor Handle) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ఉదా: తెలుగు మిత్రుడు, Catchakri..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-telugu font-semibold"
                  />
                </div>

                {/* Quick Handle Suggestions */}
                <div>
                  <span className="text-[11px] font-telugu text-stone-500 block mb-1">
                    త్వరిత మారుపేర్లు (Quick Handles):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleHandles.map((handle) => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => setName(handle)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 border border-stone-200 hover:border-amber-400 rounded-md text-xs font-telugu text-stone-700 hover:text-[#6B1114] transition-all"
                      >
                        {handle}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
                    చిరు పరిచయం / భావన (Bio / Cultural Note)
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="మీ గురించి లేదా తెలుగు భాషపై మీ ఆసక్తి గురించి..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-telugu"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    id="btn-save-user-profile-dash"
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow font-telugu transition-all active:scale-95"
                  >
                    {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                    <span>{isSaved ? 'వివరాలు సేవ్ అయ్యాయి!' : 'వివరాలు నవీకరించండి (Save Profile)'}</span>
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* TAB 2: MY SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold font-telugu text-stone-800">
                  మీరు సమర్పించిన ప్రతిపాదనలు ({userProposals.length}):
                </h4>
              </div>

              {userProposals.length === 0 ? (
                <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-8 text-center font-telugu">
                  <BookOpen className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                  <p className="text-stone-700 font-bold text-sm">మీరు ఇంకా ఏ పదాన్నీ ప్రతిపాదించలేదు.</p>
                  <p className="text-stone-500 text-xs mt-1">
                    ఫీడ్ లోని ఏదైనా ఆంగ్ల భావనకు మీ తెలుగు పదాన్ని జోడించండి!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userProposals.map(({ concept, proposal }) => {
                    const brevity = getBrevityInfo(proposal.teluguWord);
                    const netVotes = proposal.upvotes - proposal.downvotes;

                    return (
                      <div
                        key={proposal.id}
                        className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs space-y-2 font-telugu"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-serif italic text-xs font-bold text-stone-500">
                              {concept.englishWord}
                            </span>
                            
                            {/* Moderation Status Pill */}
                            {proposal.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-bold">
                                <Clock className="w-3 h-3" />
                                <span>సమీక్షలో ఉంది (Pending Review)</span>
                              </span>
                            )}
                            {proposal.status === 'approved' && !proposal.isStandardized && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>ఆమోదించబడింది (In Voting)</span>
                              </span>
                            )}
                            {proposal.isStandardized && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold shadow-2xs">
                                <Award className="w-3 h-3 text-amber-100" />
                                <span>నిఘంటువు స్థిరపడింది!</span>
                              </span>
                            )}
                            {proposal.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-full text-[10px] font-bold">
                                <XCircle className="w-3 h-3" />
                                <span>తిరస్కరించబడింది (Rejected)</span>
                              </span>
                            )}
                          </div>

                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${brevity.colorClass}`}>
                            {brevity.count} అక్షరాలు
                          </span>
                        </div>

                        {/* Word Details */}
                        <div className="flex items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-[#6B1114]">{proposal.teluguWord}</span>
                            {proposal.transliteration && (
                              <span className="text-stone-500 text-xs italic">({proposal.transliteration})</span>
                            )}
                            <button
                              onClick={() => speakWord(proposal.teluguWord, proposal.transliteration)}
                              className="p-1 text-stone-400 hover:text-amber-800"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Upvotes / Downvotes tally */}
                          <div className="flex items-center gap-2 text-xs font-bold font-sans">
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              👍 +{proposal.upvotes}
                            </span>
                            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              👎 -{proposal.downvotes}
                            </span>
                            <span className="text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-bold">
                              Net: {netVotes > 0 ? `+${netVotes}` : netVotes}
                            </span>
                          </div>
                        </div>

                        {proposal.rationale && (
                          <p className="text-xs text-stone-600 pt-1">
                            <strong>అర్థం: </strong>{proposal.rationale}
                          </p>
                        )}

                        {proposal.moderationNote && (
                          <div className="text-[11px] text-stone-600 bg-stone-100 p-2 rounded border border-stone-200">
                            <strong>మోడరేటర్ గమనిక: </strong>{proposal.moderationNote}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CULTURAL BADGES & HONORS */}
          {activeTab === 'badges' && (
            <div className="space-y-4 font-telugu">
              <h4 className="text-sm font-bold text-stone-800">
                మీరు సాధించిన భాషా సేవ పురస్కారాలు & బిరుదులు (Milestones):
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(profile.badges || ['🌱 మొదటి పద సృష్టికర్త']).map((badge, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-amber-300/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-xs">{badge}</div>
                      <div className="text-[10px] text-stone-500">భాషా పరిరక్షణలో క్రియాశీల పాత్ర</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* All Potential Badges Info */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2 text-xs">
                <span className="font-bold text-stone-700 block">ఇతర సాధించదగిన బిరుదులు:</span>
                <ul className="space-y-1.5 text-stone-600 list-disc list-inside text-[11px]">
                  <li><strong>పద శిల్పి:</strong> 10 లేదా అంతకంటే ఎక్కువ తెలుగు పదాలు ప్రతిపాదించడం.</li>
                  <li><strong>నిఘంటు కర్త:</strong> మీ ప్రతిపాదించిన పదం 30+ ఓట్లతో అధికారిక నిఘంటువులో స్థిరపడటం.</li>
                  <li><strong>సంక్షిప్త పద శిల్పి:</strong> 4 అక్షరాల లోపు సమర్థవంతమైన లఘు పదాలను సృష్టించడం.</li>
                  <li><strong>శత ఓట్ల వీరుడు:</strong> మీ పదాలకు 100 కంటే ఎక్కువ అప్‌వోట్లు రావడం.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 border-t border-stone-200 px-6 py-3.5 flex items-center justify-between text-xs font-telugu">
          <span className="text-stone-500">
            నమోదైన తేదీ: {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString('te-IN') : 'ఆగస్టు 2026'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-bold font-telugu transition-all"
          >
            మూసివేయి (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
