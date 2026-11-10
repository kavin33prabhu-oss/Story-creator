import React, { useState } from 'react';
import {
  Sparkles,
  GitBranch,
  ArrowRight,
  BookOpen,
  FileText,
  AlertCircle,
  X,
  Loader2,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { Story } from '../types/story';
import { continueStoryApi } from '../services/api';
import { downloadStoryAsTxt, saveStory } from '../services/storage';

interface ContinueStoryViewProps {
  initialStoryText?: string;
  sourceStory?: Story | null;
  savedStories: Story[];
  onShowToast: (msg: string) => void;
  onOpenStoryInReader: (story: Story) => void;
}

const CONTINUATION_SPARKS = [
  'An unexpected betrayal by someone trusted reveals a darker conspiracy.',
  'An ancient mechanism or hidden chamber unlocks, revealing a long-lost relic.',
  'A sudden supernatural or cosmic anomaly turns the environment hazardous.',
  'A mysterious stranger arrives with urgent news that changes the quest entirely.',
  'Let the AI surprise me with a profound emotional climax or narrative twist.',
];

export const ContinueStoryView: React.FC<ContinueStoryViewProps> = ({
  initialStoryText = '',
  sourceStory = null,
  savedStories,
  onShowToast,
  onOpenStoryInReader,
}) => {
  const [existingText, setExistingText] = useState(
    initialStoryText || (sourceStory ? sourceStory.fullText : '')
  );
  const [activeStoryTitle, setActiveStoryTitle] = useState(
    sourceStory ? sourceStory.title : 'My Ongoing Story'
  );
  const [activeGenre, setActiveGenre] = useState(
    sourceStory ? sourceStory.genre : 'Fantasy'
  );
  const [continuationPrompt, setContinuationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [continuationResult, setContinuationResult] = useState<{
    continuationTitle: string;
    continuationText: string;
    mergedStory: string;
    newIllustrationConcept: string;
    totalWords: number;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // If sourceStory prop changes
  React.useEffect(() => {
    if (sourceStory) {
      setExistingText(sourceStory.fullText);
      setActiveStoryTitle(sourceStory.title);
      setActiveGenre(sourceStory.genre);
    }
  }, [sourceStory]);

  const handleSelectSavedStory = (storyId: string) => {
    const selected = savedStories.find((s) => s.id === storyId);
    if (selected) {
      setExistingText(selected.fullText);
      setActiveStoryTitle(selected.title);
      setActiveGenre(selected.genre);
      setContinuationResult(null);
    }
  };

  const handleGenerateContinuation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!existingText.trim()) {
      setErrorMsg('Please paste or write the existing story content to continue.');
      return;
    }

    setIsGenerating(true);

    try {
      const res = await continueStoryApi({
        existingStory: existingText.trim(),
        continuationPrompt: continuationPrompt.trim() || 'Develop a natural, compelling continuation and plot progression.',
        genre: activeGenre,
        style: 'Cinematic & Dramatic',
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to generate continuation');
      }

      setContinuationResult(res.data);

      // Create an updated or new Story record to save
      const updatedStory: Story = {
        id: sourceStory ? sourceStory.id : 'story_cont_' + Date.now(),
        title: sourceStory ? sourceStory.title : `${activeStoryTitle} (Continued)`,
        genre: activeGenre,
        synopsis: sourceStory
          ? sourceStory.synopsis
          : 'Continuation of an ongoing tale crafted with Gemini AI.',
        beginning: sourceStory ? sourceStory.beginning : existingText.slice(0, 300) + '...',
        middle: sourceStory ? sourceStory.middle : 'Continuing narrative...',
        ending: res.data.continuationText,
        fullText: res.data.mergedStory,
        characterNames: sourceStory ? sourceStory.characterNames : [],
        length: 'long',
        language: sourceStory ? sourceStory.language : 'English',
        style: sourceStory ? sourceStory.style : 'Cinematic & Dramatic',
        createdAt: new Date().toISOString(),
        wordCount: res.data.totalWords,
        illustrationConcept: res.data.newIllustrationConcept,
        imageUrl: sourceStory?.imageUrl,
      };

      saveStory(updatedStory);
      onShowToast('Continuation created and saved to library!');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Continuation generation encountered an issue';
      setErrorMsg(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMerged = () => {
    if (!continuationResult) return;
    navigator.clipboard.writeText(continuationResult.mergedStory);
    setCopied(true);
    onShowToast('Full story copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMerged = () => {
    if (!continuationResult) return;
    const dummyStory: Story = {
      id: 'download_' + Date.now(),
      title: activeStoryTitle + ' - Complete',
      genre: activeGenre,
      synopsis: 'Continued story',
      beginning: '',
      middle: '',
      ending: '',
      fullText: continuationResult.mergedStory,
      characterNames: [],
      length: 'long',
      language: 'English',
      style: 'Cinematic',
      createdAt: new Date().toISOString(),
      wordCount: continuationResult.totalWords,
      illustrationConcept: continuationResult.newIllustrationConcept,
    };
    downloadStoryAsTxt(dummyStory);
    onShowToast('Story downloaded as TXT!');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#131032] to-[#0b0a1a] border border-purple-900/40 shadow-xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
            <GitBranch className="w-4 h-4" />
            <span>Narrative Continuity Engine</span>
          </div>
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">
            Continue My Story
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Paste your existing manuscript or load an earlier tale. Gemini AI analyzes characters, tone, unresolved conflicts, and writes a seamless continuation.
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

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#12102b] border border-purple-900/40 shadow-xl space-y-5">
            {/* Quick Picker for Saved Stories */}
            {savedStories.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Or load a story from your Saved Library:</span>
                </label>
                <select
                  onChange={(e) => handleSelectSavedStory(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#0b0a1a] border border-purple-900/40 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose a story to continue...
                  </option>
                  {savedStories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.genre} · {s.wordCount} words)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Existing Story Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Existing Story Text</span>
                </label>
                <span className="text-xs text-slate-400">
                  {existingText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={existingText}
                onChange={(e) => setExistingText(e.target.value)}
                rows={8}
                placeholder="Paste the beginning or current draft of your story here..."
                className="w-full px-4 py-3 rounded-xl bg-[#0b0a1a] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-500 text-sm leading-relaxed focus:outline-none transition-all duration-200"
                disabled={isGenerating}
              />
            </div>

            {/* Directive / What Should Happen Next */}
            <div>
              <label className="text-sm font-semibold text-slate-200 block mb-2">
                What Should Happen Next? (Optional Directive)
              </label>
              <input
                type="text"
                value={continuationPrompt}
                onChange={(e) => setContinuationPrompt(e.target.value)}
                placeholder="e.g. A hidden staircase is discovered; an old friend warns of danger..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b0a1a] border border-purple-900/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-500 text-sm focus:outline-none transition-all duration-200"
                disabled={isGenerating}
              />

              {/* Sparks list */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {CONTINUATION_SPARKS.map((spark, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setContinuationPrompt(spark)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-900/40 transition-colors text-left"
                  >
                    + {spark}
                  </button>
                ))}
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateContinuation}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-xl shadow-purple-950/60 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-purple-200" />
                    <span>Gemini AI is weaving the continuation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-purple-200" />
                    <span>Generate Story Continuation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Continuation Output Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#12102b] border border-purple-900/40 shadow-xl min-h-[460px] flex flex-col justify-between">
            {continuationResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-purple-950/60">
                  <div>
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                      New Chapter Added
                    </span>
                    <h3 className="font-heading text-lg font-bold text-white">
                      {continuationResult.continuationTitle}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyMerged}
                      title="Copy Full Merged Story"
                      className="p-2 rounded-lg bg-slate-900 border border-purple-900/40 text-slate-300 hover:text-white"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={handleDownloadMerged}
                      title="Download Merged TXT"
                      className="p-2 rounded-lg bg-slate-900 border border-purple-900/40 text-purple-300 hover:text-white"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/30 text-xs text-purple-200">
                  <span className="font-semibold block mb-1">New Scene Concept:</span>
                  {continuationResult.newIllustrationConcept}
                </div>

                <div className="font-reading text-slate-200 text-sm leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto pr-2 border-l-2 border-purple-600/60 pl-4 py-1">
                  {continuationResult.continuationText}
                </div>

                <div className="pt-4 border-t border-purple-950/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Total Story Length: ~{continuationResult.totalWords} words</span>
                  <button
                    onClick={() => {
                      const completeStory: Story = {
                        id: 'merged_' + Date.now(),
                        title: activeStoryTitle,
                        genre: activeGenre,
                        synopsis: 'Continued story',
                        beginning: '',
                        middle: '',
                        ending: '',
                        fullText: continuationResult.mergedStory,
                        characterNames: [],
                        length: 'long',
                        language: 'English',
                        style: 'Cinematic',
                        createdAt: new Date().toISOString(),
                        wordCount: continuationResult.totalWords,
                        illustrationConcept: continuationResult.newIllustrationConcept,
                      };
                      onOpenStoryInReader(completeStory);
                    }}
                    className="text-purple-300 hover:text-purple-100 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>Read Full Story in Reader</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-900/40 flex items-center justify-center text-purple-400 mb-3">
                  <GitBranch className="w-6 h-6" />
                </div>
                <h4 className="font-heading text-base font-bold text-slate-200 mb-1">
                  Continuation Output
                </h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Enter your story on the left, optionally describe the next plot twist, and click generate to weave the next chapter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
