import { EnglishConcept, TeluguProposal, ContributorProfile, FirebaseConfigState } from '@/types/dictionary';
import { INITIAL_CONCEPTS } from './initial-data';
import { computeUserMetrics } from './linguistics';

const STORAGE_KEY_CONCEPTS = 'pada_sampada_concepts_v2';
const STORAGE_KEY_PROFILE = 'pada_sampada_user_profile_v2';
const STORAGE_KEY_THRESHOLD = 'pada_sampada_threshold';
const STORAGE_KEY_FIREBASE = 'pada_sampada_firebase_config';

export const DEFAULT_THRESHOLD = 30;

export function getStoredThreshold(): number {
  if (typeof window === 'undefined') return DEFAULT_THRESHOLD;
  const stored = localStorage.getItem(STORAGE_KEY_THRESHOLD);
  if (!stored) return DEFAULT_THRESHOLD;
  const val = parseInt(stored, 10);
  return isNaN(val) || val <= 0 ? DEFAULT_THRESHOLD : val;
}

export function saveStoredThreshold(val: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_THRESHOLD, val.toString());
}

export function getStoredUserProfile(): ContributorProfile {
  if (typeof window === 'undefined') {
    return {
      id: 'user_telugu_mitrudu',
      name: 'తెలుగు మిత్రుడు',
      bio: 'తెలుగు భాషాభివృద్ధికి, నిఘంటు సంపద పెంపునకు కృషి చేసే భాషా ప్రేమికుడు.',
      role: 'trusted_moderator',
      totalSubmissions: 0,
      approvedSubmissions: 0,
      pendingSubmissions: 0,
      rejectedSubmissions: 0,
      totalUpvotesReceived: 0,
      totalDownvotesReceived: 0,
      totalVotesCast: 0,
      standardizedCount: 0,
      reputationScore: 10,
      joinedAt: '2026-08-01T00:00:00.000Z',
      badges: ['🛡️ విశ్వసనీయ భాషా ధర్మకర్త (Trusted Moderator)', '🌱 మొదటి పద సృష్టికర్త (First Word Created)']
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.id) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  const newProfile: ContributorProfile = {
    id: `user_${Math.random().toString(36).substring(2, 9)}`,
    name: 'తెలుగు మిత్రుడు',
    bio: 'మాతృభాషా పరిరక్షణ & ఆధునిక తెలుగు పద సృష్టికర్త.',
    role: 'trusted_moderator',
    totalSubmissions: 0,
    approvedSubmissions: 0,
    pendingSubmissions: 0,
    rejectedSubmissions: 0,
    totalUpvotesReceived: 0,
    totalDownvotesReceived: 0,
    totalVotesCast: 0,
    standardizedCount: 0,
    reputationScore: 10,
    joinedAt: new Date().toISOString(),
    badges: ['🛡️ విశ్వసనీయ భాషా ధర్మకర్త (Trusted Moderator)']
  };
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
  return newProfile;
}

export function saveStoredUserProfile(profile: ContributorProfile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
}

export function getStoredConcepts(): EnglishConcept[] {
  if (typeof window === 'undefined') return INITIAL_CONCEPTS;
  const stored = localStorage.getItem(STORAGE_KEY_CONCEPTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_CONCEPTS, JSON.stringify(INITIAL_CONCEPTS));
    return INITIAL_CONCEPTS;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse concepts from storage', e);
  }
  return INITIAL_CONCEPTS;
}

export function saveStoredConcepts(concepts: EnglishConcept[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_CONCEPTS, JSON.stringify(concepts));
}

export function getStoredFirebaseConfig(): FirebaseConfigState {
  if (typeof window === 'undefined') return { isConfigured: false };
  const stored = localStorage.getItem(STORAGE_KEY_FIREBASE);
  if (!stored) return { isConfigured: false };
  try {
    return JSON.parse(stored);
  } catch {
    return { isConfigured: false };
  }
}

export function saveStoredFirebaseConfig(config: FirebaseConfigState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_FIREBASE, JSON.stringify(config));
}

// Speak Telugu Word with SpeechSynthesis
export function speakWord(text: string, transliteration?: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel(); // Stop ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  
  // Look for Telugu voice (te-IN) or Indian English voice
  const teluguVoice = voices.find(v => v.lang === 'te-IN' || v.lang.startsWith('te'));
  const indianVoice = voices.find(v => v.lang === 'en-IN' || v.lang.includes('India'));

  if (teluguVoice) {
    utterance.voice = teluguVoice;
    utterance.lang = 'te-IN';
  } else if (indianVoice && transliteration) {
    utterance.text = transliteration;
    utterance.voice = indianVoice;
    utterance.lang = 'en-IN';
  } else {
    utterance.lang = 'te-IN';
  }

  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

// Export formatting helpers
export function exportToCSV(concepts: EnglishConcept[]): string {
  const headers = [
    'Concept ID',
    'English Word',
    'Category',
    'Status',
    'English Definition',
    'Telugu Word',
    'Transliteration',
    'Telugu Aksharas (Length)',
    'Rationale / Meaning',
    'Example Sentence',
    'Upvotes',
    'Downvotes',
    'Net Score',
    'Is Standardized (In Dictionary)',
    'Moderation Status',
    'Contributor'
  ];

  const rows: string[][] = [];

  concepts.forEach(concept => {
    concept.proposals.forEach(prop => {
      rows.push([
        `"${concept.id}"`,
        `"${concept.englishWord.replace(/"/g, '""')}"`,
        `"${concept.category.replace(/"/g, '""')}"`,
        `"${concept.status || 'approved'}"`,
        `"${(concept.englishDefinition || '').replace(/"/g, '""')}"`,
        `"${prop.teluguWord.replace(/"/g, '""')}"`,
        `"${(prop.transliteration || '').replace(/"/g, '""')}"`,
        `${prop.glyphCount || prop.teluguWord.length}`,
        `"${(prop.rationale || '').replace(/"/g, '""')}"`,
        `"${(prop.exampleSentence || '').replace(/"/g, '""')}"`,
        `${prop.upvotes}`,
        `${prop.downvotes}`,
        `${prop.upvotes - prop.downvotes}`,
        `${prop.isStandardized ? 'YES' : 'NO'}`,
        `"${prop.status || 'approved'}"`,
        `"${(prop.contributorName || '').replace(/"/g, '""')}"`
      ]);
    });
  });

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportToJSON(concepts: EnglishConcept[]): string {
  return JSON.stringify(
    {
      dictionaryName: 'పద సంపద - Pada Sampada Telugu Neologisms & Nigantu',
      license: 'Creative Commons Attribution-ShareAlike (CC BY-SA 4.0) Open Data',
      exportedAt: new Date().toISOString(),
      totalConcepts: concepts.length,
      totalProposals: concepts.reduce((sum, c) => sum + c.proposals.length, 0),
      concepts
    },
    null,
    2
  );
}

export function exportToMarkdown(concepts: EnglishConcept[]): string {
  let md = `# పద సంపద - ప్రామాణిక తెలుగు నిఘంటువు (Pada Sampada Dictionary)\n\n`;
  md += `*స్వేచ్ఛా భాషా విజ్ఞానం • Open Source Telugu Culture & Modern Neologism Dictionary*\n\n`;
  md += `| ఆంగ్ల పదం (English) | తెలుగు పదం (Telugu) | అక్షరాల నిడివి (Length) | అర్థ సమర్థన (Rationale) | ఓట్లు (Votes) | హోదా (Status) |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  concepts.forEach(c => {
    c.proposals.forEach(p => {
      const status = p.isStandardized ? '🏆 నిఘంటువు స్థిరపడింది' : p.status === 'pending' ? '🟡 సమీక్షలో ఉంది' : '⚡ ప్రజా ఓటింగ్';
      md += `| **${c.englishWord}** | **${p.teluguWord}** | ${p.teluguWord.length} అక్షరాలు | ${p.rationale} | 👍 +${p.upvotes - p.downvotes} | ${status} |\n`;
    });
  });

  return md;
}

export function downloadFile(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
