import React from 'react';
import { Sparkles, Compass, Feather, BookMarked, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStartCreating: () => void;
  onExploreLibrary: () => void;
  onSelectPromptSpark: (prompt: string, genre: string) => void;
}

const PROMPT_SPARKS = [
  {
    title: 'The Clockwork Heart of the Labyrinth',
    prompt:
      'In a sunken clockwork labyrinth beneath an ancient desert, an eccentric mechanist and her brass owl discover a ticking mechanical heart that controls the flow of time itself.',
    genre: 'Fantasy',
  },
  {
    title: 'The Silent Signal of Outpost 9',
    prompt:
      'Deep inside an icy mining asteroid near Jupiter’s rings, an audio technician intercepts an anomalous radio broadcast playing a melody from 1920s Earth.',
    genre: 'Science Fiction',
  },
  {
    title: 'The Rainmaker of Baker Street',
    prompt:
      'Every time a murder occurs in Victorian London, a strange localized rainstorm falls exclusively upon the victim’s street, carrying the scent of almond blossom and river silt.',
    genre: 'Mystery',
  },
  {
    title: 'The Great Marmalade Heist',
    prompt:
      'Two hopelessly disorganized raccoon siblings attempt to steal a prize-winning jar of bitter-orange marmalade from the annual county fair baking tent.',
    genre: 'Comedy',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCreating,
  onExploreLibrary,
  onSelectPromptSpark,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-purple-950/40 bg-gradient-to-b from-[#131030]/60 via-[#0b0a1a] to-[#0b0a1a]">
      {/* Background starlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-purple-700/15 via-indigo-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Typographic & Action Section */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed editorial kicker */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-semibold mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Next-Generation Creative Storytelling Studio</span>
              <span aria-hidden="true">·</span>
              <span>Gemini AI Engine</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-[1.15] mb-6 text-balance">
              Where Every Idea Becomes an{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-200">
                Epic Tale
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl font-light">
              Craft original, unforgettable stories in seconds. Customize genres, character casts, narrative styles, and lengths. Generate vivid scene illustrations and seamlessly continue your ongoing adventures with Google Gemini AI.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onStartCreating}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white font-medium shadow-lg shadow-purple-900/40 hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Feather className="w-5 h-5 text-purple-200" />
                <span>Create New Story</span>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </button>

              <button
                onClick={onExploreLibrary}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 border border-purple-900/40 hover:border-purple-700/60 transition-all duration-200 cursor-pointer"
              >
                <BookMarked className="w-4 h-4 text-purple-400" />
                <span>Saved Stories Library</span>
              </button>
            </div>

            {/* Quiet unboxed feature highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-purple-950/60 text-xs text-slate-400">
              <div>
                <span className="block text-slate-200 font-semibold text-sm">8 Genres</span>
                <span>Horror to Sci-Fi</span>
              </div>
              <div>
                <span className="block text-slate-200 font-semibold text-sm">3 Acts</span>
                <span>Beginning, Middle, End</span>
              </div>
              <div>
                <span className="block text-slate-200 font-semibold text-sm">Characters</span>
                <span>Deep Persona Weaver</span>
              </div>
              <div>
                <span className="block text-slate-200 font-semibold text-sm">TXT Export</span>
                <span>Download & Keep</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Container */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-purple-800/40 shadow-2xl shadow-purple-950/60 bg-[#120f2e] h-full min-h-[320px] flex flex-col justify-end group">
              <img
                src="/src/assets/images/story_hero_magic_1794321566078.jpg"
                alt="Enchanted open storybook floating in a starlit cosmic library"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a1a] via-[#0b0a1a]/40 to-transparent" />

              <div className="relative z-10 p-6">
                <div className="flex items-center gap-2 text-xs text-purple-300 mb-1">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>The Infinite Library</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  Every Page Holds a World
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Start with a spark of imagination, or continue an unfinished journey. Our AI storyteller shapes dialogue, rhythm, and twists with authorial nuance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Sparks Row */}
        <div className="mt-12 pt-8 border-t border-purple-950/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Sparks — Instant Inspirations</span>
            </div>
            <span className="text-xs text-slate-500">Click any idea to begin</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PROMPT_SPARKS.map((spark, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPromptSpark(spark.prompt, spark.genre)}
                className="text-left p-3.5 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-900/30 hover:border-purple-600/50 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-purple-300 mb-1.5">
                  <span className="font-medium">{spark.genre}</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-purple-300 transition-colors">
                    Use prompt →
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white mb-1 line-clamp-1">
                  {spark.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {spark.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
