import React from 'react';
import { BookOpen, Sparkles, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'continue' | 'characters' | 'library';
  setActiveTab: (tab: 'generator' | 'continue' | 'characters' | 'library') => void;
  onNewStory: () => void;
  savedStoriesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewStory,
  savedStoriesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0a1a]/90 backdrop-blur-md border-b border-purple-950/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-900/40 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-5 h-5 text-purple-100" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-wider text-slate-100 group-hover:text-purple-300 transition-colors whitespace-nowrap">
              AI Story Creator
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'generator'
                ? 'bg-purple-950/60 text-purple-200 border border-purple-800/50 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Story Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('continue')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'continue'
                ? 'bg-purple-950/60 text-purple-200 border border-purple-800/50 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Continue My Story
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'characters'
                ? 'bg-purple-950/60 text-purple-200 border border-purple-800/50 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Character Generator
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'bg-purple-950/60 text-purple-200 border border-purple-800/50 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Saved Stories</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-mono">
              {savedStoriesCount}
            </span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewStory}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 shadow-md shadow-purple-950/50 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Story</span>
          </button>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 gap-2 border-t border-purple-950/30 scrollbar-none">
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'generator' ? 'bg-purple-900/70 text-purple-200' : 'text-slate-400'
          }`}
        >
          Generator
        </button>
        <button
          onClick={() => setActiveTab('continue')}
          className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'continue' ? 'bg-purple-900/70 text-purple-200' : 'text-slate-400'
          }`}
        >
          Continue
        </button>
        <button
          onClick={() => setActiveTab('characters')}
          className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'characters' ? 'bg-purple-900/70 text-purple-200' : 'text-slate-400'
          }`}
        >
          Characters
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap shrink-0 flex items-center gap-1 ${
            activeTab === 'library' ? 'bg-purple-900/70 text-purple-200' : 'text-slate-400'
          }`}
        >
          <span>Library</span>
          <span className="text-[10px] bg-purple-950 px-1 rounded-full text-purple-300">
            {savedStoriesCount}
          </span>
        </button>
      </div>
    </header>
  );
};
