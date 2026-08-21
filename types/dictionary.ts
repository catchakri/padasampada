export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface TeluguProposal {
  id: string;
  conceptId: string;
  teluguWord: string;
  transliteration: string;
  rationale: string;
  exampleSentence: string;
  contributorName: string;
  contributorId: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  votedUserIds?: Record<string, 'up' | 'down'>;
  isStandardized?: boolean;
  
  // Moderation & Scoring System
  status: ModerationStatus;
  moderationNote?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  
  // Brevity & Longevity metrics
  glyphCount?: number;
  brevityBonus?: number;
  longevityDays?: number;
  fitnessScore?: number;
}

export interface EnglishConcept {
  id: string;
  englishWord: string;
  category: string;
  englishDefinition: string;
  createdAt: string;
  createdBy: string;
  creatorId?: string;
  status: ModerationStatus;
  moderationNote?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  proposals: TeluguProposal[];
}

export type Category = 
  | 'దైనందిన సాంకేతికత (Daily Tech)'
  | 'రవాణా & ప్రయాణం (Transport)'
  | 'శాస్త్ర సాంకేతికత (Science & Tech)'
  | 'వైద్యం & ఆరోగ్యం (Health & Medicine)'
  | 'పాలన & న్యాయం (Admin & Law)'
  | 'కళలు & మాధ్యమాలు (Arts & Media)'
  | 'వ్యాపారం & వాణిజ్యం (Commerce)'
  | 'ఇతర భావనలు (General)';

export interface ContributorProfile {
  id: string;
  name: string;
  bio?: string;
  role: 'contributor' | 'trusted_moderator' | 'admin';
  totalSubmissions: number;
  approvedSubmissions: number;
  pendingSubmissions: number;
  rejectedSubmissions: number;
  totalUpvotesReceived: number;
  totalDownvotesReceived: number;
  totalVotesCast: number;
  standardizedCount: number;
  reputationScore: number;
  joinedAt: string;
  badges: string[];
  avatarSeed?: string;
}

export interface FirebaseConfigState {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  isConfigured: boolean;
}
