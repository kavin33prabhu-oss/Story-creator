import React, { useState } from 'react';
import {
  Sparkles,
  UserPlus,
  Users,
  Compass,
  Trash2,
  Send,
  Loader2,
  AlertCircle,
  X,
  Shield,
  Heart,
  Eye,
  Bookmark,
} from 'lucide-react';
import { Character, Genre } from '../types/story';
import { generateCharacterApi } from '../services/api';
import { deleteCharacter, getSavedCharacters, saveCharacter } from '../services/storage';

interface CharacterGeneratorViewProps {
  onUseInStory: (characterNameWithRole: string, genre: Genre) => void;
  onShowToast: (msg: string) => void;
}

const ARCHETYPE_SUGGESTIONS = [
  'Reluctant Navigator',
  'Clockwork Medic',
  'Cynical Noir Detective',
  'Exiled Rune Priestess',
  'Deep Space Terraformer',
  'Mischievous Street Illusionist',
  'Loyal Shieldbearer Companion',
  'Quiet Botanical Scholar',
];

export const CharacterGeneratorView: React.FC<CharacterGeneratorViewProps> = ({
  onUseInStory,
  onShowToast,
}) => {
  const [genre, setGenre] = useState<Genre>('Fantasy');
  const [archetype, setArchetype] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [generatedCharacter, setGeneratedCharacter] = useState<Character | null>(null);
  const [vaultCharacters, setVaultCharacters] = useState<Character[]>(() =>
    getSavedCharacters()
  );

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const res = await generateCharacterApi({
        genre,
        archetypeOrRole: archetype.trim() || undefined,
        inspiration: inspiration.trim() || undefined,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to generate character');
      }

      setGeneratedCharacter(res.data);
      // Automatically save to vault
      saveCharacter(res.data);
      setVaultCharacters(getSavedCharacters());
      onShowToast(`Character "${res.data.name}" created and added to vault!`);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Character generation failed';
      setErrorMsg(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCharacter = (id: string, name: string) => {
    deleteCharacter(id);
    setVaultCharacters(getSavedCharacters());
    if (generatedCharacter?.id === id) {
      setGeneratedCharacter(null);
    }
    onShowToast(`Removed "${name}" from vault.`);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#131032] to-[#0b0a1a] border border-purple-900/40 shadow-xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>Character Foundry</span>
          </div>
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">
            AI Character Generator
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Create distinctive, three-dimensional characters complete with physical appearances, nuanced personality traits, deep backgrounds, and memorable quirks.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-100">Notice</p>
            <p className="text-xs text-red-200/90 mt-0.5">{errorMsg}</p>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: Form on Left, Output / Vault on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Generator Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#12102b] border border-purple-900/40 shadow-xl space-y-5">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-purple-950/60">
              <UserPlus className="w-4 h-4 text-purple-400" />
              <span>Forge a Character</span>
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Genre Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Story Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as Genre)}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#0b0a1a] border border-purple-900/40 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                  disabled={isGenerating}
                >
                  <option value="Fantasy">Fantasy</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Horror">Horror</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Romance-free friendship stories">
                    Romance-free friendship stories
                  </option>
                  <option value="Inspirational">Inspirational</option>
                </select>
              </div>

              {/* Archetype or Role */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Archetype or Role (Optional)
                </label>
                <input
                  type="text"
                  value={archetype}
                  onChange={(e) => setArchetype(e.target.value)}
                  placeholder="e.g. Reluctant Navigator, Clockwork Medic..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0b0a1a] border border-purple-900/40 text-slate-200 text-xs focus:outline-none focus:border-purple-500 placeholder-slate-500"
                  disabled={isGenerating}
                />

                <div className="mt-2 flex flex-wrap gap-1">
                  {ARCHETYPE_SUGGESTIONS.slice(0, 4).map((sugg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setArchetype(sugg)}
                      className="text-[10px] px-2 py-0.5 rounded bg-purple-950/50 hover:bg-purple-900 text-purple-300 border border-purple-900/30 transition-colors"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inspiration or Key Trait */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Key Inspiration or Nuance (Optional)
                </label>
                <textarea
                  value={inspiration}
                  onChange={(e) => setInspiration(e.target.value)}
                  rows={3}
                  placeholder="e.g. Carries an antique pocket watch that runs backward; harbors guilt over a lost expedition..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0b0a1a] border border-purple-900/40 text-slate-200 text-xs focus:outline-none focus:border-purple-500 placeholder-slate-500"
                  disabled={isGenerating}
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-purple-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Conceiving Character with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>Generate Character</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Generated Character Display & Vault */}
        <div className="lg:col-span-7 space-y-6">
          {/* Newly Generated Character Card */}
          {generatedCharacter && (
            <div className="p-6 rounded-2xl bg-[#141033] border border-purple-600/50 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-purple-900/50">
                <div>
                  <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{generatedCharacter.genre} Protagonist</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    {generatedCharacter.name}
                  </h3>
                  <p className="text-xs text-purple-300 font-medium">
                    {generatedCharacter.role}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onUseInStory(
                      `${generatedCharacter.name} (${generatedCharacter.role})`,
                      generatedCharacter.genre
                    )
                  }
                  className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-purple-950 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Use in Story Creator</span>
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                {/* Physical Appearance */}
                <div>
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>Physical Appearance</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed bg-[#0b0a1a]/60 p-3 rounded-lg border border-purple-950/60">
                    {generatedCharacter.appearance}
                  </p>
                </div>

                {/* Personality Traits */}
                <div>
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <Heart className="w-3.5 h-3.5 text-purple-400" />
                    <span>Personality & Temperament</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedCharacter.personality.map((trait, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-purple-950/80 text-purple-200 border border-purple-800/60 text-[11px]"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Background */}
                <div>
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Compass className="w-3.5 h-3.5 text-purple-400" />
                    <span>Character Background & Motive</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed bg-[#0b0a1a]/60 p-3 rounded-lg border border-purple-950/60">
                    {generatedCharacter.background}
                  </p>
                </div>

                {/* Quirk / Talisman */}
                <div>
                  <span className="font-semibold text-purple-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Distinctive Quirk or Talisman</span>
                  </span>
                  <p className="text-purple-200/90 leading-relaxed italic bg-purple-950/30 p-2.5 rounded-lg border border-purple-800/30">
                    "{generatedCharacter.quirk}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Character Vault List */}
          <div className="p-6 rounded-2xl bg-[#12102b] border border-purple-900/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-950/60">
              <h4 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-purple-400" />
                <span>Character Vault</span>
                <span className="text-xs text-slate-400 font-sans font-normal">
                  ({vaultCharacters.length} saved)
                </span>
              </h4>
            </div>

            {vaultCharacters.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Your character vault is empty. Generate your first character on the left!
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {vaultCharacters.map((char) => (
                  <div
                    key={char.id}
                    className="p-4 rounded-xl bg-[#0b0a1a] border border-purple-950 hover:border-purple-800/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-heading text-sm font-bold text-slate-100">
                          {char.name}
                        </h5>
                        <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-900/40">
                          {char.genre}
                        </span>
                      </div>
                      <p className="text-xs text-purple-400 font-medium mb-1">
                        {char.role}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {char.quirk}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          onUseInStory(`${char.name} (${char.role})`, char.genre)
                        }
                        className="px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-medium border border-purple-800/40 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3 text-purple-400" />
                        <span>Use</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCharacter(char.id, char.name)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer"
                        title="Delete character"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
