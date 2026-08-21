'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { NoticeBanner } from '@/components/NoticeBanner';
import { FilterTabs, ActiveTab } from '@/components/FilterTabs';
import { ConceptCard } from '@/components/ConceptCard';
import { AddConceptModal } from '@/components/AddConceptModal';
import { AddTeluguProposalModal } from '@/components/AddTeluguProposalModal';
import { ExportModal } from '@/components/ExportModal';
import { FirebaseConfigModal } from '@/components/FirebaseConfigModal';
import { UserProfileDashboard } from '@/components/UserProfileDashboard';
import { ModerationDesk } from '@/components/ModerationDesk';
import { SettingsModal } from '@/components/SettingsModal';
import { MugguDivider, ToranamMotif, DeepamIcon } from '@/lib/muggu-patterns';
import { EnglishConcept, TeluguProposal, ContributorProfile, FirebaseConfigState, ModerationStatus } from '@/types/dictionary';
import {
  getStoredConcepts,
  saveStoredConcepts,
  getStoredUserProfile,
  saveStoredUserProfile,
  getStoredThreshold,
  saveStoredThreshold,
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig
} from '@/lib/storage';
import { INITIAL_CONCEPTS } from '@/lib/initial-data';
import { getFirestoreDB, syncConceptToFirestore, syncUserProfileToFirestore } from '@/lib/firebase-config';
import { computeUserMetrics, countTeluguAksharas, calculateDictionaryFitnessScore } from '@/lib/linguistics';
import { onSnapshot, collection } from 'firebase/firestore';
import { Plus, BookOpen, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [concepts, setConcepts] = useState<EnglishConcept[]>(() => getStoredConcepts());
  const [userProfile, setUserProfile] = useState<ContributorProfile>(() => getStoredUserProfile());
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfigState>(() => getStoredFirebaseConfig());
  const [threshold, setThreshold] = useState<number>(() => getStoredThreshold());
  
  // UI Navigation & Filters
  const [activeTab, setActiveTab] = useState<ActiveTab>('live_feed');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('అన్నీ (All Categories)');
  const [sortBy, setSortBy] = useState<'votes' | 'newest' | 'alphabetical' | 'brevity'>('votes');

  // Modals
  const [isAddConceptOpen, setIsAddConceptOpen] = useState(false);
  const [isAddProposalOpen, setIsAddProposalOpen] = useState(false);
  const [targetConceptForProposal, setTargetConceptForProposal] = useState<EnglishConcept | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFirebaseOpen, setIsFirebaseOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Compute live user stats whenever concepts change
  const currentComputedProfile = useMemo(() => {
    return computeUserMetrics(userProfile, concepts);
  }, [userProfile, concepts]);

  // Sync to Firestore & Storage if Firebase is configured
  useEffect(() => {
    const db = getFirestoreDB(firebaseConfig);
    if (db) {
      try {
        const unsubscribe = onSnapshot(collection(db, 'telugu_concepts'), (snapshot) => {
          if (!snapshot.empty) {
            const remoteConcepts: EnglishConcept[] = [];
            snapshot.forEach((doc) => {
              remoteConcepts.push(doc.data() as EnglishConcept);
            });
            if (remoteConcepts.length > 0) {
              setConcepts(remoteConcepts);
              saveStoredConcepts(remoteConcepts);
            }
          }
        });
        return () => unsubscribe();
      } catch (e) {
        console.warn('Live Firestore listener notice:', e);
      }
    }
  }, [firebaseConfig]);

  // Count pending reviews across all concepts and proposals
  const pendingCount = useMemo(() => {
    let count = concepts.filter(c => c.status === 'pending').length;
    concepts.forEach(c => {
      count += (c.proposals || []).filter(p => p.status === 'pending').length;
    });
    return count;
  }, [concepts]);

  // Update concepts & sync to storage + Firestore
  const updateConceptsState = (newConcepts: EnglishConcept[]) => {
    setConcepts(newConcepts);
    saveStoredConcepts(newConcepts);
    const updatedProf = computeUserMetrics(userProfile, newConcepts);
    setUserProfile(updatedProf);
    saveStoredUserProfile(updatedProf);
    syncUserProfileToFirestore(updatedProf);
  };

  // Add new English Concept
  const handleAddConcept = (newConcept: EnglishConcept) => {
    const updated = [newConcept, ...concepts];
    updateConceptsState(updated);
    syncConceptToFirestore(newConcept);
  };

  // Add Telugu Proposal to existing concept
  const handleAddProposal = (conceptId: string, proposal: TeluguProposal) => {
    const updated = concepts.map((c) => {
      if (c.id === conceptId) {
        const existingProps = c.proposals || [];
        const updatedProps = [...existingProps, proposal];
        const updatedConcept = { ...c, proposals: updatedProps };
        syncConceptToFirestore(updatedConcept);
        return updatedConcept;
      }
      return c;
    });

    updateConceptsState(updated);
  };

  // Upvote / Downvote Action handler
  const handleVote = (conceptId: string, proposalId: string, voteType: 'up' | 'down') => {
    let votesDelta = 0;

    const updated = concepts.map((c) => {
      if (c.id !== conceptId) return c;

      const updatedProps = c.proposals.map((prop) => {
        if (prop.id !== proposalId) return prop;

        const currentVotedMap = { ...(prop.votedUserIds || {}) };
        const existingVote = currentVotedMap[userProfile.id];

        let newUpvotes = prop.upvotes;
        let newDownvotes = prop.downvotes;

        if (existingVote === voteType) {
          // Toggle off vote
          delete currentVotedMap[userProfile.id];
          if (voteType === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
          if (voteType === 'down') newDownvotes = Math.max(0, newDownvotes - 1);
        } else {
          // New vote or switch vote
          if (existingVote === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
          if (existingVote === 'down') newDownvotes = Math.max(0, newDownvotes - 1);

          currentVotedMap[userProfile.id] = voteType;
          if (voteType === 'up') {
            newUpvotes += 1;
            votesDelta = 1;
          }
          if (voteType === 'down') {
            newDownvotes += 1;
            votesDelta = 1;
          }
        }

        const netVotes = newUpvotes - newDownvotes;
        const isStandardized = netVotes >= threshold;

        return {
          ...prop,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          votedUserIds: currentVotedMap,
          isStandardized
        };
      });

      const updatedConcept = { ...c, proposals: updatedProps };
      syncConceptToFirestore(updatedConcept);
      return updatedConcept;
    });

    updateConceptsState(updated);

    if (votesDelta > 0) {
      const updatedProfile = {
        ...userProfile,
        totalVotesCast: (userProfile.totalVotesCast || 0) + 1
      };
      setUserProfile(updatedProfile);
      saveStoredUserProfile(updatedProfile);
      syncUserProfileToFirestore(updatedProfile);
    }
  };

  // Moderate single proposal
  const handleModerateProposal = (
    conceptId: string,
    proposalId: string,
    newStatus: ModerationStatus,
    note?: string
  ) => {
    const updated = concepts.map((c) => {
      if (c.id !== conceptId) return c;
      const updatedProps = c.proposals.map((prop) => {
        if (prop.id !== proposalId) return prop;
        return {
          ...prop,
          status: newStatus,
          moderationNote: note || (newStatus === 'approved' ? 'ఆమోదించబడింది' : 'తిరస్కరించబడింది'),
          moderatedBy: userProfile.name,
          moderatedAt: new Date().toISOString()
        };
      });
      const updatedConcept = { ...c, proposals: updatedProps };
      syncConceptToFirestore(updatedConcept);
      return updatedConcept;
    });

    updateConceptsState(updated);
  };

  // Moderate single concept
  const handleModerateConcept = (
    conceptId: string,
    newStatus: ModerationStatus,
    note?: string
  ) => {
    const updated = concepts.map((c) => {
      if (c.id !== conceptId) return c;
      const updatedConcept = {
        ...c,
        status: newStatus,
        moderationNote: note || (newStatus === 'approved' ? 'ఆమోదించబడింది' : 'తిరస్కరించబడింది'),
        moderatedBy: userProfile.name,
        moderatedAt: new Date().toISOString()
      };
      syncConceptToFirestore(updatedConcept);
      return updatedConcept;
    });

    updateConceptsState(updated);
  };

  // One-command batch approve all pending items
  const handleBatchApproveAll = () => {
    const now = new Date().toISOString();
    const updated = concepts.map((c) => {
      const updatedProps = (c.proposals || []).map((p) => {
        if (p.status === 'pending') {
          return {
            ...p,
            status: 'approved' as ModerationStatus,
            moderationNote: 'ఏకకాలంలో ఆమోదించబడింది (Batch Approved)',
            moderatedBy: userProfile.name,
            moderatedAt: now
          };
        }
        return p;
      });

      const updatedConcept: EnglishConcept = {
        ...c,
        status: c.status === 'pending' ? ('approved' as ModerationStatus) : c.status,
        moderationNote: c.status === 'pending' ? 'ఏకకాలంలో ఆమోదించబడింది' : c.moderationNote,
        moderatedBy: userProfile.name,
        moderatedAt: now,
        proposals: updatedProps
      };

      syncConceptToFirestore(updatedConcept);
      return updatedConcept;
    });

    updateConceptsState(updated);
  };

  // Open add proposal modal for a concept
  const handleOpenAddProposal = (concept: EnglishConcept) => {
    setTargetConceptForProposal(concept);
    setIsAddProposalOpen(true);
  };

  // Threshold updates
  const handleSaveThreshold = (newThreshold: number) => {
    setThreshold(newThreshold);
    saveStoredThreshold(newThreshold);
  };

  // Reset data to initial state
  const handleResetData = () => {
    updateConceptsState(INITIAL_CONCEPTS);
  };

  // Filter & Categorize Concepts for Tabs
  const { liveFeedList, hallOfFameList, filteredConcepts } = useMemo(() => {
    // 1. Separate into Live Feed and Hall of Fame
    const liveFeed: EnglishConcept[] = [];
    const hallOfFame: EnglishConcept[] = [];

    concepts.forEach((c) => {
      // If concept is rejected, do not show in public feed
      if (c.status === 'rejected') return;

      // Filter proposals: in public view, display approved proposals (plus pending if user is the contributor)
      const visibleProps = (c.proposals || []).filter(
        p => p.status === 'approved' || p.contributorId === userProfile.id || userProfile.role === 'trusted_moderator'
      );

      const conceptWithVisibleProps = {
        ...c,
        proposals: visibleProps
      };

      // If concept has any proposal that reached the threshold, it qualifies for Hall of Fame
      const hasStandardizedProposal = visibleProps.some(
        (p) => (p.upvotes - p.downvotes) >= threshold || p.isStandardized
      );

      if (hasStandardizedProposal) {
        hallOfFame.push(conceptWithVisibleProps);
      }
      liveFeed.push(conceptWithVisibleProps);
    });

    // 2. Filter by Active Tab
    const currentList = activeTab === 'hall_of_fame' ? hallOfFame : liveFeed;

    // 3. Filter by Category
    const categoryFiltered = currentList.filter((c) => {
      if (selectedCategory.startsWith('అన్నీ')) return true;
      return c.category === selectedCategory;
    });

    // 4. Search Filter
    const query = searchQuery.trim().toLowerCase();
    const searched = categoryFiltered.filter((c) => {
      if (!query) return true;
      const matchEnglish = c.englishWord.toLowerCase().includes(query);
      const matchDef = c.englishDefinition?.toLowerCase().includes(query);
      const matchTelugu = c.proposals.some(
        (p) =>
          p.teluguWord.toLowerCase().includes(query) ||
          p.transliteration.toLowerCase().includes(query) ||
          p.rationale.toLowerCase().includes(query) ||
          p.exampleSentence?.toLowerCase().includes(query)
      );
      return matchEnglish || matchDef || matchTelugu;
    });

    // 5. Sorting
    const sorted = [...searched].sort((a, b) => {
      if (sortBy === 'votes') {
        const topA = Math.max(...(a.proposals.map((p) => p.upvotes - p.downvotes).concat([0])));
        const topB = Math.max(...(b.proposals.map((p) => p.upvotes - p.downvotes).concat([0])));
        return topB - topA;
      }
      if (sortBy === 'brevity') {
        // Shorter is better: sort by shortest primary proposal aksharas
        const minLenA = Math.min(...(a.proposals.map((p) => countTeluguAksharas(p.teluguWord)).concat([99])));
        const minLenB = Math.min(...(b.proposals.map((p) => countTeluguAksharas(p.teluguWord)).concat([99])));
        return minLenA - minLenB;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'alphabetical') {
        return a.englishWord.localeCompare(b.englishWord);
      }
      return 0;
    });

    return {
      liveFeedList: liveFeed,
      hallOfFameList: hallOfFame,
      filteredConcepts: sorted
    };
  }, [concepts, activeTab, selectedCategory, searchQuery, sortBy, threshold, userProfile]);

  return (
    <div className="min-h-screen telugu-canvas-bg text-stone-800 flex flex-col font-telugu relative selection:bg-amber-200 selection:text-stone-900">
      
      {/* Top Header */}
      <Header
        onOpenAddConcept={() => setIsAddConceptOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenFirebase={() => setIsFirebaseOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavigateToModeration={() => setActiveTab('moderation_desk')}
        userProfile={currentComputedProfile}
        firebaseConfig={firebaseConfig}
        threshold={threshold}
        pendingCount={pendingCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        
        {/* Notice Rule Banner */}
        <NoticeBanner threshold={threshold} />

        {/* Tab & Search Filter Navigation Bar */}
        <FilterTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          liveFeedCount={liveFeedList.length}
          hallOfFameCount={hallOfFameList.length}
          pendingCount={pendingCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          threshold={threshold}
        />

        {/* Decorative Divider */}
        <MugguDivider />

        {/* Dynamic Main Body Content */}
        {activeTab === 'moderation_desk' ? (
          <ModerationDesk
            concepts={concepts}
            onModerateProposal={handleModerateProposal}
            onModerateConcept={handleModerateConcept}
            onBatchApproveAll={handleBatchApproveAll}
            currentUserName={userProfile.name}
          />
        ) : (
          /* Concept Cards Feed */
          <section className="space-y-6">
            {filteredConcepts.length > 0 ? (
              filteredConcepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  onVote={handleVote}
                  onOpenAddProposal={handleOpenAddProposal}
                  onModerateProposal={handleModerateProposal}
                  currentUserId={userProfile.id}
                  threshold={threshold}
                  isModerator={userProfile.role === 'trusted_moderator'}
                />
              ))
            ) : (
              /* Empty State */
              <div className="w-full bg-white border border-[#E8DEC8] rounded-2xl p-10 text-center font-telugu shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#6B1114]">పదాలు ఏవీ కనుగొనబడలేదు</h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                    మీరు వెతికిన పదానికి సరిపోయే ప్రతిపాదనలు ఇంకా లేవు. మీరే సరికొత్త ఆంగ్ల భావనను లేదా తెలుగింపును సృష్టించవచ్చు!
                  </p>
                </div>
                <button
                  onClick={() => setIsAddConceptOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 font-bold text-xs rounded-xl shadow font-telugu transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ కొత్త ఆంగ్ల పదం చేర్చండి</span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* Bottom Festive Culture Quote & Motif */}
        <div className="py-8 text-center space-y-3">
          <MugguDivider />
          <div className="flex items-center justify-center gap-3 text-amber-800">
            <DeepamIcon className="w-5 h-5" />
            <p className="text-xs sm:text-sm font-telugu-serif italic text-stone-600">
              &ldquo;దేశభాషలందు తెలుగు లెస్స • భాష బతికితేనే జాతి జీవిస్తుంది&rdquo;
            </p>
            <DeepamIcon className="w-5 h-5 scale-x-[-1]" />
          </div>
        </div>

      </main>

      {/* Traditional Telugu Footer */}
      <footer className="w-full bg-[#3D0A0C] text-amber-200/80 border-t border-amber-900/60 py-8 px-4 text-xs font-telugu">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <ToranamMotif className="w-6 h-6 text-amber-400/80" />
            <div>
              <span className="font-bold text-amber-100 text-sm">పద సంపద (Pada Sampada)</span>
              <span className="block text-[11px] text-amber-300/60">తెలుగు సంస్కృతి & ఆధునిక నిఘంటు ప్రామాణీకరణ వేదిక</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-amber-200/90">
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:text-amber-100 underline decoration-amber-500/40"
            >
              ఓపెన్ డేటా ఎగుమతి (CSV/JSON)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('moderation_desk')}
              className="hover:text-amber-100 underline decoration-amber-500/40"
            >
              మోడరేషన్ డెస్క్ ({pendingCount})
            </button>
            <span>•</span>
            <button
              onClick={() => setIsFirebaseOpen(true)}
              className="hover:text-amber-100 underline decoration-amber-500/40"
            >
              ఫైర్‌బేస్ క్లౌడ్ స్థితి
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-amber-100 underline decoration-amber-500/40"
            >
              ఓట్ల నియమాలు
            </button>
          </div>

          <div className="text-[11px] text-amber-400/60">
            స్వేచ్ఛా తెలుగు విజ్ఞానం • Creative Commons Open Data
          </div>

        </div>
      </footer>

      {/* Modals */}
      <AddConceptModal
        isOpen={isAddConceptOpen}
        onClose={() => setIsAddConceptOpen(false)}
        onAddConcept={handleAddConcept}
        currentUserId={userProfile.id}
        currentUserName={userProfile.name}
      />

      <AddTeluguProposalModal
        isOpen={isAddProposalOpen}
        onClose={() => {
          setIsAddProposalOpen(false);
          setTargetConceptForProposal(null);
        }}
        concept={targetConceptForProposal}
        onAddProposal={handleAddProposal}
        currentUserId={userProfile.id}
        currentUserName={userProfile.name}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        concepts={concepts}
      />

      <FirebaseConfigModal
        isOpen={isFirebaseOpen}
        onClose={() => setIsFirebaseOpen(false)}
        config={firebaseConfig}
        onSaveConfig={(newConfig) => {
          setFirebaseConfig(newConfig);
          saveStoredFirebaseConfig(newConfig);
        }}
        onTriggerSync={() => {
          concepts.forEach((c) => syncConceptToFirestore(c));
          syncUserProfileToFirestore(currentComputedProfile);
          alert('అన్ని పదాలు, ఓట్లు మరియు యూజర్ ప్రొఫైల్ ఫైర్‌బేస్ కు విజయవంతంగా సింక్ చేయబడ్డాయి!');
        }}
      />

      <UserProfileDashboard
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={currentComputedProfile}
        concepts={concepts}
        onSaveProfile={(newProf) => {
          setUserProfile(newProf);
          saveStoredUserProfile(newProf);
          syncUserProfileToFirestore(newProf);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        threshold={threshold}
        onSaveThreshold={handleSaveThreshold}
        onResetData={handleResetData}
      />

    </div>
  );
}
