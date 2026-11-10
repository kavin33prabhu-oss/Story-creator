import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GenreShowcase } from './components/GenreShowcase';
import { StoryGenerator } from './components/StoryGenerator';
import { StoryReaderModal } from './components/StoryReaderModal';
import { ContinueStoryView } from './components/ContinueStoryView';
import { CharacterGeneratorView } from './components/CharacterGeneratorView';
import { SavedStoriesLibrary } from './components/SavedStoriesLibrary';
import { Toast } from './components/Toast';
import { Genre, Story } from './types/story';
import { deleteStory, getSavedStories, saveStory } from './services/storage';
import { BookOpen, Sparkles, Clock, ArrowRight, Bookmark } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'continue' | 'characters' | 'library'>('generator');
  const [selectedGenre, setSelectedGenre] = useState<Genre>('Fantasy');
  const [savedStories, setSavedStories] = useState<Story[]>(() => getSavedStories());
  const [activeReaderStory, setActiveReaderStory] = useState<Story | null>(null);
  const [sourceStoryForContinuation, setSourceStoryForContinuation] = useState<Story | null>(null);
  const [initialGeneratorPrompt, setInitialGeneratorPrompt] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync saved stories from localStorage
  const refreshStories = () => {
    setSavedStories(getSavedStories());
  };

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleNewStoryClick = () => {
    setActiveTab('generator');
    setInitialGeneratorPrompt('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePromptSparkSelect = (prompt: string, genre: string) => {
    setSelectedGenre(genre as Genre);
    setInitialGeneratorPrompt(prompt);
    setActiveTab('generator');
    const generatorElem = document.getElementById('story-generator-section');
    if (generatorElem) {
      generatorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStoryCreated = (story: Story) => {
    refreshStories();
    setActiveReaderStory(story);
    handleShowToast(`Story "${story.title}" generated and saved!`);
  };

  const handleStoryUpdated = (updatedStory: Story) => {
    saveStory(updatedStory);
    refreshStories();
    setActiveReaderStory(updatedStory);
  };

  const handleDeleteStory = (id: string, title: string) => {
    deleteStory(id);
    refreshStories();
    handleShowToast(`Story "${title}" deleted.`);
  };

  const handleContinueStoryTrigger = (story: Story) => {
    setSourceStoryForContinuation(story);
    setActiveTab('continue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseCharacterInStory = (characterDesc: string, genre: Genre) => {
    setSelectedGenre(genre);
    setInitialGeneratorPrompt(
      (prev) =>
        prev
          ? `${prev} Starring ${characterDesc}.`
          : `A tale featuring ${characterDesc}.`
    );
    setActiveTab('generator');
    handleShowToast(`Added character to Story Generator!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Recent stories (top 3)
  const recentStories = savedStories.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0b0a1a] text-slate-100 flex flex-col font-ui bg-cosmic-grid">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewStory={handleNewStoryClick}
        savedStoriesCount={savedStories.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'generator' && (
          <div>
            {/* Hero Section */}
            <HeroSection
              onStartCreating={() => {
                const generatorElem = document.getElementById('story-generator-section');
                if (generatorElem) {
                  generatorElem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onExploreLibrary={() => setActiveTab('library')}
              onSelectPromptSpark={handlePromptSparkSelect}
            />

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
              {/* Genre Showcase Grid */}
              <GenreShowcase
                selectedGenre={selectedGenre}
                onSelectGenre={(g) => setSelectedGenre(g)}
              />

              {/* Story Generator Form */}
              <div id="story-generator-section" className="scroll-mt-24">
                <StoryGenerator
                  currentGenre={selectedGenre}
                  onGenreChange={setSelectedGenre}
                  onStoryCreated={handleStoryCreated}
                  initialPrompt={initialGeneratorPrompt}
                />
              </div>

              {/* Recently Created Stories Section */}
              {recentStories.length > 0 && (
                <div className="pt-6 border-t border-purple-950/60">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-purple-400" />
                      <span>Recently Created Stories</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('library')}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <span>View All in Library</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {recentStories.map((story) => (
                      <div
                        key={story.id}
                        onClick={() => setActiveReaderStory(story)}
                        className="p-4 rounded-xl bg-[#12102b] border border-purple-900/40 hover:border-purple-600/60 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-purple-300 mb-1.5 font-medium">
                            <span>{story.genre}</span>
                            <span className="text-slate-400">{story.wordCount} words</span>
                          </div>
                          <h4 className="font-heading text-sm font-bold text-slate-100 group-hover:text-purple-200 mb-1 line-clamp-1">
                            {story.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {story.synopsis || story.fullText}
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-purple-950 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                          <span className="text-purple-400 group-hover:text-purple-200 flex items-center gap-1">
                            Read tale →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'continue' && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <ContinueStoryView
              sourceStory={sourceStoryForContinuation}
              savedStories={savedStories}
              onShowToast={handleShowToast}
              onOpenStoryInReader={(story) => {
                refreshStories();
                setActiveReaderStory(story);
              }}
            />
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <CharacterGeneratorView
              onUseInStory={handleUseCharacterInStory}
              onShowToast={handleShowToast}
            />
          </div>
        )}

        {activeTab === 'library' && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <SavedStoriesLibrary
              stories={savedStories}
              onSelectStory={(s) => setActiveReaderStory(s)}
              onContinueStory={handleContinueStoryTrigger}
              onDeleteStory={handleDeleteStory}
              onShowToast={handleShowToast}
              onNewStory={handleNewStoryClick}
            />
          </div>
        )}
      </main>

      {/* Reader Modal */}
      {activeReaderStory && (
        <StoryReaderModal
          story={activeReaderStory}
          onClose={() => setActiveReaderStory(null)}
          onContinueStory={handleContinueStoryTrigger}
          onStoryUpdated={handleStoryUpdated}
          onShowToast={handleShowToast}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Footer */}
      <footer className="border-t border-purple-950/40 bg-[#070612] py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-heading text-slate-300 font-bold">AI Story Creator</span>
            <span>· Powered by Google Gemini AI</span>
          </div>

          <div className="text-slate-400">
            Stories stored offline on your device · Instant TXT export
          </div>
        </div>
      </footer>
    </div>
  );
}
