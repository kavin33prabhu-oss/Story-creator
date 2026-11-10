import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ImageIcon,
  Bookmark,
  Calendar,
  FileText,
  Clock,
  Layers,
  Loader2,
} from 'lucide-react';
import { Story } from '../types/story';
import { downloadStoryAsTxt, saveStory } from '../services/storage';
import { illustrateStoryApi } from '../services/api';

interface StoryReaderModalProps {
  story: Story | null;
  onClose: () => void;
  onContinueStory: (story: Story) => void;
  onStoryUpdated?: (updatedStory: Story) => void;
  onShowToast: (msg: string) => void;
}

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({
  story,
  onClose,
  onContinueStory,
  onStoryUpdated,
  onShowToast,
}) => {
  const [activeAct, setActiveAct] = useState<'full' | 'beginning' | 'middle' | 'ending'>('full');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isIllustrating, setIsIllustrating] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(story);

  useEffect(() => {
    setCurrentStory(story);
  }, [story]);

  // Clean up speech synthesis on close or unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!currentStory) return null;

  const handleCopy = () => {
    const textToCopy = `${currentStory.title}\n\n${currentStory.fullText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    onShowToast('Story copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadStoryAsTxt(currentStory);
    onShowToast(`Downloaded "${currentStory.title}.txt"`);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      onShowToast('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentStory.fullText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      onShowToast('Reading story aloud...');
    }
  };

  const handleGenerateIllustration = async () => {
    if (!currentStory.illustrationConcept) return;

    setIsIllustrating(true);
    try {
      const res = await illustrateStoryApi(
        currentStory.illustrationConcept,
        currentStory.title,
        currentStory.genre
      );

      if (res.success) {
        const updated: Story = {
          ...currentStory,
          imageUrl: res.imageUrl || undefined,
        };
        setCurrentStory(updated);
        saveStory(updated);
        if (onStoryUpdated) onStoryUpdated(updated);
        onShowToast(
          res.imageUrl
            ? 'Illustration generated successfully!'
            : 'Scene concept visualized!'
        );
      } else {
        onShowToast(res.error || 'Could not generate image');
      }
    } catch (err: unknown) {
      console.error(err);
      onShowToast('Illustration generation encountered an issue.');
    } finally {
      setIsIllustrating(false);
    }
  };

  const readingTimeMinutes = Math.max(1, Math.ceil(currentStory.wordCount / 200));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-modal-title"
    >
      <div className="bg-[#100e29] border border-purple-800/50 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-purple-950/60 bg-[#141133]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
              <span className="font-semibold text-purple-400 uppercase tracking-wider">
                {currentStory.genre}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{readingTimeMinutes} min read</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-purple-400" />
                <span className="font-mono tabular-nums">{currentStory.wordCount} words</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentStory.language}</span>
            </div>

            <h2
              id="story-modal-title"
              className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide"
            >
              {currentStory.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Read Aloud Button */}
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? 'Stop Narration' : 'Read Aloud'}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-purple-600 text-white border-purple-400 animate-pulse'
                  : 'bg-slate-900/80 text-slate-300 border-purple-900/40 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              title="Copy Story"
              className="p-2.5 rounded-lg bg-slate-900/80 text-slate-300 border border-purple-900/40 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Download TXT Button */}
            <button
              onClick={handleDownload}
              title="Download as TXT"
              className="p-2.5 rounded-lg bg-slate-900/80 text-slate-300 border border-purple-900/40 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-300" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close modal"
              className="p-2.5 rounded-lg bg-slate-900/80 text-slate-400 border border-purple-900/40 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Synopsis Hook */}
          {currentStory.synopsis && (
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/30 italic text-purple-200/90 text-sm leading-relaxed">
              "{currentStory.synopsis}"
            </div>
          )}

          {/* AI Story Illustration Card */}
          <div className="rounded-xl overflow-hidden border border-purple-900/40 bg-[#0c0a1f] shadow-lg">
            {currentStory.imageUrl ? (
              <div className="relative group">
                <img
                  src={currentStory.imageUrl}
                  alt={currentStory.title}
                  className="w-full max-h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <div className="text-xs text-slate-300 line-clamp-2">
                    <span className="font-semibold text-purple-300">Scene Concept: </span>
                    {currentStory.illustrationConcept}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-purple-300 shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                      Scene Illustration Concept
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentStory.illustrationConcept ||
                        'Visual description crafted by Gemini AI for this dramatic moment.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateIllustration}
                  disabled={isIllustrating}
                  className="px-4 py-2 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700/60 text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center cursor-pointer disabled:opacity-50"
                >
                  {isIllustrating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                      <span>Generating Art...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Illustrate Scene</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Act Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-purple-950 max-w-md">
            <button
              onClick={() => setActiveAct('full')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                activeAct === 'full'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full Story
            </button>
            <button
              onClick={() => setActiveAct('beginning')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                activeAct === 'beginning'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Beginning
            </button>
            <button
              onClick={() => setActiveAct('middle')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                activeAct === 'middle'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Middle
            </button>
            <button
              onClick={() => setActiveAct('ending')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                activeAct === 'ending'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ending
            </button>
          </div>

          {/* Story Text Section */}
          <div className="font-reading text-slate-100 text-base sm:text-lg story-prose whitespace-pre-line leading-relaxed max-w-3xl">
            {activeAct === 'full' && (
              <div>{currentStory.fullText}</div>
            )}
            {activeAct === 'beginning' && (
              <div>
                <span className="font-heading text-xs uppercase tracking-widest text-purple-400 block mb-3 font-sans not-italic">
                  Act I · The Inciting Incident & Beginning
                </span>
                {currentStory.beginning}
              </div>
            )}
            {activeAct === 'middle' && (
              <div>
                <span className="font-heading text-xs uppercase tracking-widest text-purple-400 block mb-3 font-sans not-italic">
                  Act II · Rising Conflict & Climax
                </span>
                {currentStory.middle}
              </div>
            )}
            {activeAct === 'ending' && (
              <div>
                <span className="font-heading text-xs uppercase tracking-widest text-purple-400 block mb-3 font-sans not-italic">
                  Act III · Resolution & Aftermath
                </span>
                {currentStory.ending}
              </div>
            )}
          </div>

          {/* Character Tags */}
          {currentStory.characterNames && currentStory.characterNames.length > 0 && (
            <div className="pt-6 border-t border-purple-950/60">
              <span className="text-xs text-slate-400 block mb-2 font-medium">
                Characters in this tale:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentStory.characterNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-md bg-purple-950/60 text-purple-200 border border-purple-900/40"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-purple-950/60 bg-[#141133]/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-purple-400" />
            <span>Saved in your offline library</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onContinueStory(currentStory);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-purple-950 transition-all cursor-pointer"
            >
              <span>Continue This Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
