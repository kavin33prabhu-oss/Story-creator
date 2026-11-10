import React, { useState } from 'react';
import {
  Sparkles,
  Dice5,
  Feather,
  Users,
  Globe,
  Sliders,
  X,
  Plus,
  Loader2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { Genre, Story, StoryLength, WritingStyle } from '../types/story';
import { generateStoryApi } from '../services/api';
import { getSavedCharacters, saveStory } from '../services/storage';

interface StoryGeneratorProps {
  currentGenre: Genre;
  onGenreChange: (genre: Genre) => void;
  onStoryCreated: (story: Story) => void;
  initialPrompt?: string;
}

const RANDOM_IDEAS: Record<Genre, string[]> = {
  Fantasy: [
    'A rogue alchemist creates an ink that makes whatever is written in it temporarily come to life.',
    'An apprentice glassblower discovers they can trap wandering memories inside blown-glass orbs.',
    'The guardians of the moon bridge realize the constellations are shifting out of order.',
  ],
  'Science Fiction': [
    'A lunar archivist discovers an unauthorized transmission originating from Earth’s core.',
    'The first sentient interstellar probe returns to Earth after 400 years, but refuses to speak to humans.',
    'A deep-sea mining crew unearths an ancient alien beacon buried in the Mariana Trench.',
  ],
  Mystery: [
    'A reclusive antiquarian finds a diary describing tomorrow’s crimes in precise, handwriting detail.',
    'A painting at the Grand National Museum changes slightly every evening after the guards lock the doors.',
    'During a blizzard at a luxury mountaintop hotel, the master key to every room vanishes.',
  ],
  Horror: [
    'An old lighthouse begins turning on by itself, but instead of shining a beam, it casts a beam of absolute darkness.',
    'A botanist brings home a rare nocturnal orchid whose petals whisper names of people about to go missing.',
    'A radio repairman finds a frequency that broadcasts the quiet thoughts of the person holding the receiver.',
  ],
  Adventure: [
    'Two rival cartographers are forced to team up to locate a sunken pirate fortress in the Bermuda Triangle.',
    'A high-altitude mountaineer discovers a hidden temperate valley protected by towering thermal vents.',
    'A hot air balloonist gets swept up by a jet stream into an uncharted archipelago of sky islands.',
  ],
  Comedy: [
    'A wizard’s clumsy cat accidentally drinks an invisibility potion right before the annual imperial inspection.',
    'Two eccentric retired spies start competing neighborhood bakeries, using high-tech espionage gadgets to steal secret pastry recipes.',
    'An alien diplomatic delegation arrives on Earth and mistakes a chaotic toddler birthday party for an official summit.',
  ],
  'Romance-free friendship stories': [
    'Two veteran deep-sea submarine welders must rely entirely on each other when an electrical failure traps them in the abyss.',
    'Childhood best friends who took different paths reunite to save their hometown astronomy observatory from demolition.',
    'An elderly craftsman and a rebellious runaway apprentice bond while restoring a historic clock tower clockwork mechanism.',
  ],
  Inspirational: [
    'A young girl from a drought-stricken village designs a low-cost fog harvesting net that transforms her community.',
    'A retired marathon runner with mobility challenges mentors an anxious teenager to cross their first finish line.',
    'A community garden in an urban desert brings together four estranged generations of neighbors through the joy of harvest.',
  ],
};

const WRITING_STYLES: WritingStyle[] = [
  'Cinematic & Dramatic',
  'Classic Fairy Tale',
  'Dark & Suspenseful',
  'Fast-paced & Action-driven',
  'Whimsical & Lighthearted',
  'Poetic & Lyrical',
  'First-Person Memoir',
];

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Japanese',
  'Italian',
  'Portuguese',
];

export const StoryGenerator: React.FC<StoryGeneratorProps> = ({
  currentGenre,
  onGenreChange,
  onStoryCreated,
  initialPrompt = '',
}) => {
  const [idea, setIdea] = useState(initialPrompt);
  const [length, setLength] = useState<StoryLength>('medium');
  const [language, setLanguage] = useState<string>('English');
  const [style, setStyle] = useState<string>('Cinematic & Dramatic');
  const [characterInput, setCharacterInput] = useState('');
  const [characters, setCharacters] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCharacterDrawer, setShowCharacterDrawer] = useState(false);

  // Sync if initial prompt prop changes
  React.useEffect(() => {
    if (initialPrompt) {
      setIdea(initialPrompt);
    }
  }, [initialPrompt]);

  const savedVaultCharacters = getSavedCharacters();

  const handleAddCharacter = () => {
    const trimmed = characterInput.trim();
    if (trimmed && !characters.includes(trimmed)) {
      setCharacters([...characters, trimmed]);
      setCharacterInput('');
    }
  };

  const handleRemoveCharacter = (nameToRemove: string) => {
    setCharacters(characters.filter((c) => c !== nameToRemove));
  };

  const handleAddFromVault = (name: string, role: string) => {
    const formatted = `${name} (${role})`;
    if (!characters.includes(formatted)) {
      setCharacters([...characters, formatted]);
    }
  };

  const handleRandomIdea = () => {
    const list = RANDOM_IDEAS[currentGenre] || RANDOM_IDEAS['Fantasy'];
    const randomPick = list[Math.floor(Math.random() * list.length)];
    setIdea(randomPick);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!idea.trim()) {
      setErrorMessage('Please describe your story idea or pick a prompt inspiration.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);

    const stepTimer1 = setTimeout(() => setGenerationStep(2), 1400);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 3200);

    try {
      const res = await generateStoryApi({
        idea: idea.trim(),
        genre: currentGenre,
        length,
        characters,
        language,
        style,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to generate story');
      }

      // Save to localStorage automatically
      saveStory(res.data);
      onStoryCreated(res.data);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'An error occurred during generation';
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  return (
    <div className="bg-[#12102b] rounded-2xl border border-purple-900/40 p-6 lg:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative gradient corner glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-950/60 mb-6">
        <div>
          <h2 className="font-heading text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <Feather className="w-5 h-5 text-purple-400" />
            <span>AI Story Generator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Provide your premise, characters, and style to craft a three-act original tale
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomIdea}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800/50 hover:border-purple-600 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Dice5 className="w-4 h-4 text-purple-400" />
          <span>Surprise Me Idea</span>
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-100">Generation Notice</p>
            <p className="text-xs text-red-200/90 mt-0.5">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Story Idea Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="storyIdea" className="text-sm font-semibold text-slate-200">
              Story Idea or Premise <span className="text-purple-400">*</span>
            </label>
            <span className="text-xs text-slate-400">{idea.length} characters</span>
          </div>

          <textarea
            id="storyIdea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={4}
            placeholder="e.g. An adventurous cartographer climbs an enchanted sapphire spire during a lunar eclipse to find a forgotten celestial astrolabe..."
            className="w-full px-4 py-3 rounded-xl bg-[#0b0a1a] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-500 text-sm leading-relaxed focus:outline-none transition-all duration-200"
            disabled={isGenerating}
          />
        </div>

        {/* Customization Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 rounded-xl bg-[#0d0b21] border border-purple-950/80">
          {/* Story Length */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Story Length</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['short', 'medium', 'long'] as StoryLength[]).map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setLength(len)}
                  className={`py-2 px-1 text-xs rounded-lg font-medium capitalize text-center transition-all ${
                    length === len
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                      : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {len}
                  <span className="block text-[10px] opacity-75 font-normal">
                    {len === 'short' ? '~300w' : len === 'medium' ? '~600w' : '~1000w'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Story Language */}
          <div>
            <label
              htmlFor="storyLanguage"
              className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2.5"
            >
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>Language</span>
            </label>
            <select
              id="storyLanguage"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg bg-slate-900/80 border border-purple-900/40 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              disabled={isGenerating}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Writing Style */}
          <div>
            <label
              htmlFor="storyStyle"
              className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2.5"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Writing Style</span>
            </label>
            <select
              id="storyStyle"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg bg-slate-900/80 border border-purple-900/40 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              disabled={isGenerating}
            >
              {WRITING_STYLES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Character Names Section */}
        <div className="p-4 rounded-xl bg-[#0d0b21] border border-purple-950/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Characters in Story (Optional)</span>
            </label>

            {savedVaultCharacters.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCharacterDrawer(!showCharacterDrawer)}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                <Layers className="w-3 h-3" />
                <span>{showCharacterDrawer ? 'Close Vault' : 'Pick from Character Vault'}</span>
              </button>
            )}
          </div>

          {/* Vault selector popup/drawer */}
          {showCharacterDrawer && (
            <div className="mb-3 p-3 rounded-lg bg-purple-950/40 border border-purple-800/40 text-xs">
              <span className="text-[11px] font-semibold text-purple-300 block mb-2">
                Click a character to insert into this story:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {savedVaultCharacters.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => handleAddFromVault(char.name, char.role)}
                    className="px-2.5 py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-slate-200 text-xs border border-purple-700/50 transition-colors"
                  >
                    + {char.name} <span className="opacity-75">({char.role})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Character tags and input */}
          <div className="flex flex-wrap items-center gap-2">
            {characters.map((charName) => (
              <span
                key={charName}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-950/70 text-purple-200 border border-purple-800/60 text-xs"
              >
                <span>{charName}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCharacter(charName)}
                  className="text-purple-400 hover:text-purple-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <input
                type="text"
                value={characterInput}
                onChange={(e) => setCharacterInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCharacter();
                  }
                }}
                placeholder="Type character name and press Enter..."
                className="flex-1 py-1.5 px-3 rounded-lg bg-[#0b0a1a] border border-purple-900/40 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                disabled={isGenerating}
              />
              <button
                type="button"
                onClick={handleAddCharacter}
                className="px-2.5 py-1.5 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Generate Button / Progress Bar */}
        <div className="pt-2">
          {isGenerating ? (
            <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-800/60 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-3 text-purple-300 text-sm font-medium">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <span>
                  {generationStep === 1 && 'Connecting to Google Gemini AI...'}
                  {generationStep === 2 && 'Structuring Beginning, Middle, and Resolution...'}
                  {generationStep >= 3 && 'Polishing illustration concept & dialogue...'}
                </span>
              </div>
              <div className="w-full max-w-md h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-400 transition-all duration-700 ease-out"
                  style={{
                    width:
                      generationStep === 1
                        ? '33%'
                        : generationStep === 2
                        ? '66%'
                        : '92%',
                  }}
                />
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-base shadow-xl shadow-purple-950/60 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-purple-200" />
              <span>Generate Original Story</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
