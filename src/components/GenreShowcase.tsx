import React from 'react';
import {
  Skull,
  Laugh,
  Compass,
  Wand2,
  Search,
  Users,
  Rocket,
  Sun,
  Sparkles,
} from 'lucide-react';
import { Genre } from '../types/story';

interface GenreInfo {
  genre: Genre;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  exampleThemes: string[];
}

export const GENRE_LIST: GenreInfo[] = [
  {
    genre: 'Fantasy',
    tagline: 'Ancient Magic & Wonder',
    description: 'Enchanted realms, mythical creatures, levitating citadels, and timeless celestial prophecies.',
    icon: Wand2,
    accentColor: 'from-purple-600 to-indigo-600',
    exampleThemes: ['Crystal Spire', 'Runic Relic', 'Forgotten Order'],
  },
  {
    genre: 'Science Fiction',
    tagline: 'Cosmic Horizons & Technology',
    description: 'Far-off galaxies, artificial intelligence, lunar colonies, and anomalies at the edge of time.',
    icon: Rocket,
    accentColor: 'from-cyan-600 to-blue-700',
    exampleThemes: ['Deep Space Signal', 'Cybernetics', 'Wormhole Transit'],
  },
  {
    genre: 'Mystery',
    tagline: 'Intricate Clues & Twists',
    description: 'Shadowy secrets, detective inquiries, vanishing artifacts, and shocking third-act reveals.',
    icon: Search,
    accentColor: 'from-amber-600 to-orange-700',
    exampleThemes: ['Locked Manor', 'Coded Manuscript', 'The Midnight Witness'],
  },
  {
    genre: 'Horror',
    tagline: 'Chills & Psychological Dread',
    description: 'Supernatural manifestations, creeping dread, uncanny haunted occurrences, and survival instinct.',
    icon: Skull,
    accentColor: 'from-rose-700 to-red-900',
    exampleThemes: ['The Abandoned Sanitarium', 'Fog of the Moors', 'The Mirror Entity'],
  },
  {
    genre: 'Adventure',
    tagline: 'Daring Quests & Expeditions',
    description: 'Wild frontiers, sunken temples, hazardous wilderness journeys, and ancient treasures.',
    icon: Compass,
    accentColor: 'from-emerald-600 to-teal-700',
    exampleThemes: ['Sunken Galleon', 'Jungle Archipelago', 'The Lost Summit'],
  },
  {
    genre: 'Comedy',
    tagline: 'Clever Wit & Absurd Mischief',
    description: 'Laugh-out-loud disasters, witty dialogue, hilarious misunderstandings, and lovable eccentric characters.',
    icon: Laugh,
    accentColor: 'from-yellow-500 to-amber-600',
    exampleThemes: ['Bungled Banquet', 'Accidental Mayor', 'Rogue Familiar'],
  },
  {
    genre: 'Romance-free friendship stories',
    tagline: 'Loyalty & Unbreakable Bonds',
    description: 'Deep platonic camaraderie, partners-in-arms, shared hardship, and friends standing together against all odds.',
    icon: Users,
    accentColor: 'from-violet-600 to-purple-800',
    exampleThemes: ['Childhood Oath', 'The Fellowship of Strangers', 'Lifelong Wingmates'],
  },
  {
    genre: 'Inspirational',
    tagline: 'Triumph, Hope & Resilience',
    description: 'Overcoming profound adversity, quiet courage, small acts of kindness, and discovering inner strength.',
    icon: Sun,
    accentColor: 'from-amber-500 to-rose-600',
    exampleThemes: ['The Quiet Comeback', 'A Village United', 'Against Impossible Odds'],
  },
];

interface GenreShowcaseProps {
  selectedGenre: Genre;
  onSelectGenre: (genre: Genre) => void;
}

export const GenreShowcase: React.FC<GenreShowcaseProps> = ({
  selectedGenre,
  onSelectGenre,
}) => {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Story Genre Universe</span>
          </h3>
          <p className="text-xs text-slate-400">
            Select one of 8 tailored genres to guide narrative tone, tropes, and conflict pacing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {GENRE_LIST.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedGenre === item.genre;

          return (
            <button
              key={item.genre}
              type="button"
              onClick={() => onSelectGenre(item.genre)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-purple-950/70 border-purple-500 shadow-md shadow-purple-900/40 ring-1 ring-purple-500/50'
                  : 'bg-[#121029]/80 border-purple-900/30 hover:border-purple-700/60 hover:bg-[#181538]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.accentColor} text-white shadow-sm`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-600/50">
                      Selected
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-slate-100 group-hover:text-purple-200 transition-colors line-clamp-1 mb-0.5">
                  {item.genre}
                </h4>
                <p className="text-[11px] text-purple-400 font-medium mb-1.5">
                  {item.tagline}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-purple-950/50 flex flex-wrap gap-1">
                {item.exampleThemes.slice(0, 2).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-slate-400/80 bg-black/20 px-1.5 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
