import { TeluguProposal, EnglishConcept, ContributorProfile } from '@/types/dictionary';

/**
 * Counts Telugu visual aksharas (syllables/glyphs) rather than raw UTF-16 code units.
 * For example: 'రైలురేవు' -> 4 aksharas (రై, లు, రే, వు)
 * 'సంగణకం' -> 4 aksharas (సం, గ, ణ, కం)
 * 'ధూమశకట నిలయం' -> 7 aksharas
 */
export function countTeluguAksharas(text: string): number {
  if (!text) return 0;
  const clean = text.trim();
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    try {
      const segmenter = new (Intl as any).Segmenter('te', { granularity: 'grapheme' });
      const segments = Array.from(segmenter.segment(clean));
      // Filter out pure whitespace segments
      return segments.filter((s: any) => s.segment.trim().length > 0).length;
    } catch {
      // Fallback
    }
  }

  // Fallback: Remove Telugu combining diacritics / virama (U+0C3E - U+0C4D, U+0C55, U+0C56)
  // while counting base consonants & vowels
  const nonSpacing = clean.replace(/[\u0C3E-\u0C4D\u0C55\u0C56]/g, '').replace(/\s+/g, '');
  return Math.max(1, nonSpacing.length);
}

/**
 * Brevity Rating:
 * "The shorter is the better"
 * 1-4 aksharas: 'అతి సంక్షిప్తం (Ultra-Concise)' -> +5 points
 * 5-6 aksharas: 'సంక్షిప్తం (Concise)' -> +3 points
 * 7-8 aksharas: 'మధ్యస్థం (Moderate)' -> +1 point
 * 9+ aksharas: 'విస్తృతం (Verbose)' -> 0 points
 */
export function getBrevityInfo(text: string): {
  count: number;
  label: string;
  bonus: number;
  colorClass: string;
} {
  const count = countTeluguAksharas(text);
  if (count <= 4) {
    return {
      count,
      label: 'అతి సంక్షిప్తం (Ultra-Concise)',
      bonus: 5,
      colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  } else if (count <= 6) {
    return {
      count,
      label: 'సంక్షిప్తం (Concise)',
      bonus: 3,
      colorClass: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  } else if (count <= 8) {
    return {
      count,
      label: 'మధ్యస్థం (Moderate)',
      bonus: 1,
      colorClass: 'bg-stone-100 text-stone-700 border-stone-300'
    };
  } else {
    return {
      count,
      label: 'విస్తృతం (Verbose)',
      bonus: 0,
      colorClass: 'bg-rose-50 text-rose-700 border-rose-200'
    };
  }
}

/**
 * Calculates longevity in days.
 */
export function calculateLongevityDays(createdAt: string): number {
  if (!createdAt) return 0;
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const diffDays = (now - createdTime) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.floor(diffDays));
}

/**
 * Calculates Dictionary Fitness Score:
 * Factors:
 * 1. Net Upvotes (Upvotes - Downvotes) * 1.0
 * 2. Brevity Bonus (Shorter is better: +5, +3, +1, +0)
 * 3. Longevity Days * 0.2 (Longevity in community without being downvoted)
 * 4. Downvote penalty: Downvotes * 0.5 additional penalty
 */
export function calculateDictionaryFitnessScore(proposal: TeluguProposal): number {
  const netVotes = proposal.upvotes - proposal.downvotes;
  const brevity = getBrevityInfo(proposal.teluguWord);
  const longevityDays = calculateLongevityDays(proposal.createdAt);
  
  const score = (netVotes * 1.0) + brevity.bonus + (longevityDays * 0.2) - (proposal.downvotes * 0.5);
  return Math.round(score * 10) / 10;
}

/**
 * Enriches a proposal with real-time calculated metrics.
 */
export function enrichProposalMetrics(proposal: TeluguProposal): TeluguProposal {
  const brevity = getBrevityInfo(proposal.teluguWord);
  const longevityDays = calculateLongevityDays(proposal.createdAt);
  const fitnessScore = calculateDictionaryFitnessScore(proposal);

  return {
    ...proposal,
    glyphCount: brevity.count,
    brevityBonus: brevity.bonus,
    longevityDays,
    fitnessScore
  };
}

/**
 * Computes user profile statistics dynamically from the list of concepts and proposals.
 */
export function computeUserMetrics(
  profile: ContributorProfile,
  concepts: EnglishConcept[]
): ContributorProfile {
  let totalSubmissions = 0;
  let approvedSubmissions = 0;
  let pendingSubmissions = 0;
  let rejectedSubmissions = 0;
  let totalUpvotesReceived = 0;
  let totalDownvotesReceived = 0;
  let standardizedCount = 0;

  concepts.forEach(concept => {
    // Check concept creator
    if (concept.creatorId === profile.id) {
      if (concept.status === 'approved') approvedSubmissions++;
      else if (concept.status === 'pending') pendingSubmissions++;
      else if (concept.status === 'rejected') rejectedSubmissions++;
    }

    // Check Telugu proposals by this contributor
    concept.proposals.forEach(prop => {
      if (prop.contributorId === profile.id) {
        totalSubmissions++;
        if (prop.status === 'approved') approvedSubmissions++;
        else if (prop.status === 'pending') pendingSubmissions++;
        else if (prop.status === 'rejected') rejectedSubmissions++;

        totalUpvotesReceived += prop.upvotes || 0;
        totalDownvotesReceived += prop.downvotes || 0;

        if (prop.isStandardized) {
          standardizedCount++;
        }
      }
    });
  });

  const reputationScore = Math.max(0, (totalUpvotesReceived * 2) - totalDownvotesReceived + (standardizedCount * 10));

  // Determine badges earned
  const badges: string[] = [];
  if (totalSubmissions >= 1) badges.push('🌱 మొదటి పద సృష్టికర్త (First Word Created)');
  if (totalSubmissions >= 5) badges.push('✍️ చురుకైన రచయిత (Active Contributor)');
  if (totalSubmissions >= 10) badges.push('🏛️ పద శిల్పి (Master Neologist)');
  if (standardizedCount >= 1) badges.push('🏆 నిఘంటు కర్త (Standardized Lexicographer)');
  if (standardizedCount >= 3) badges.push('👑 నిఘంటు నిర్మాత (Grand Dictionary Architect)');
  if (totalUpvotesReceived >= 25) badges.push('⭐ ప్రజాదరణ పొందిన పండితుడు (Community Choice)');
  if (profile.totalVotesCast >= 10) badges.push('🗳️ బాధ్యతాయుత ఓటరు (Active Voter)');
  if (profile.role === 'trusted_moderator' || profile.role === 'admin') {
    badges.push('🛡️ విశ్వసనీయ భాషా ధర్మకర్త (Trusted Moderator)');
  }

  return {
    ...profile,
    totalSubmissions,
    approvedSubmissions,
    pendingSubmissions,
    rejectedSubmissions,
    totalUpvotesReceived,
    totalDownvotesReceived,
    standardizedCount,
    reputationScore,
    badges
  };
}
