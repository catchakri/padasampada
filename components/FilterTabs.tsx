'use client';

import React from 'react';
import { Search, Trophy, Radio, Filter, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { TELUGU_CATEGORIES } from '@/lib/initial-data';

export type ActiveTab = 'live_feed' | 'hall_of_fame' | 'moderation_desk';

interface FilterTabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  liveFeedCount: number;
  hallOfFameCount: number;
  pendingCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: 'votes' | 'newest' | 'alphabetical' | 'brevity';
  setSortBy: (sort: 'votes' | 'newest' | 'alphabetical' | 'brevity') => void;
  threshold: number;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeTab,
  setActiveTab,
  liveFeedCount,
  hallOfFameCount,
  pendingCount,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  threshold
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Top Main Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Feed Tab */}
          <button
            id="tab-live-feed"
            onClick={() => setActiveTab('live_feed')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-telugu text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              activeTab === 'live_feed'
                ? 'bg-[#731317] text-amber-50 ring-2 ring-[#731317]/20 shadow-md'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80'
            }`}
          >
            <Radio className={`w-4 h-4 ${activeTab === 'live_feed' ? 'text-amber-300 animate-pulse' : 'text-amber-700'}`} />
            <span>ప్రత్యక్ష ఫీడ్ (Live Feed)</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-sans ${
              activeTab === 'live_feed' ? 'bg-amber-400 text-stone-900 font-bold' : 'bg-stone-100 text-stone-600'
            }`}>
              {liveFeedCount}
            </span>
          </button>

          {/* Hall of Fame / Standardized Dictionary Tab */}
          <button
            id="tab-hall-of-fame"
            onClick={() => setActiveTab('hall_of_fame')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-telugu text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              activeTab === 'hall_of_fame'
                ? 'bg-[#731317] text-amber-50 ring-2 ring-[#731317]/20 shadow-md'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80'
            }`}
          >
            <Trophy className={`w-4 h-4 ${activeTab === 'hall_of_fame' ? 'text-amber-300' : 'text-amber-600'}`} />
            <span>హాల్ ఆఫ్ ఫేమ్ ({threshold}+ ఓట్లు)</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-sans ${
              activeTab === 'hall_of_fame' ? 'bg-amber-400 text-stone-900 font-bold' : 'bg-stone-100 text-stone-600'
            }`}>
              {hallOfFameCount}
            </span>
          </button>

          {/* Word Moderation Desk Tab */}
          <button
            id="tab-moderation-desk"
            onClick={() => setActiveTab('moderation_desk')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-telugu text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              activeTab === 'moderation_desk'
                ? 'bg-[#731317] text-amber-50 ring-2 ring-[#731317]/20 shadow-md'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeTab === 'moderation_desk' ? 'text-amber-300' : 'text-amber-700'}`} />
            <span>మోడరేషన్ డెస్క్</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-sans font-bold ${
              pendingCount > 0 
                ? 'bg-amber-500 text-stone-950 animate-pulse' 
                : activeTab === 'moderation_desk' 
                ? 'bg-amber-400 text-stone-900' 
                : 'bg-stone-100 text-stone-600'
            }`}>
              {pendingCount}
            </span>
          </button>
        </div>

        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="input-search-words"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="పదాలను వెతకండి... (Search English/Telugu)..."
            className="w-full bg-white border border-stone-300/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#731317]/30 focus:border-[#731317] font-telugu placeholder:text-stone-400 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-sans"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Secondary Filter & Sort Controls */}
      {activeTab !== 'moderation_desk' && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/60 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="flex items-center gap-1 text-stone-500 font-telugu shrink-0">
              <Filter className="w-3.5 h-3.5 text-amber-700" />
              వర్గం:
            </span>
            <select
              id="select-category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:border-amber-600 font-telugu shadow-2xs"
            >
              {TELUGU_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-stone-500 font-telugu">
              <ArrowUpDown className="w-3 h-3 text-amber-700" />
              క్రమం:
            </span>
            <select
              id="select-sort-order"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:border-amber-600 font-telugu shadow-2xs"
            >
              <option value="votes">అత్యధిక ఓట్లు (Top Votes)</option>
              <option value="brevity">సంక్షిప్త పదాలు (Shorter is Better)</option>
              <option value="newest">తాజా ప్రతిపాదనలు (Newest)</option>
              <option value="alphabetical">అక్షర క్రమం (A-Z)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
