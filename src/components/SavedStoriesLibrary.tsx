import React, { useState } from 'react';
import {
  BookMarked,
  Search,
  Trash2,
  Download,
  BookOpen,
  GitBranch,
  Sparkles,
  Calendar,
  Clock,
  FileText,
  Filter,
} from 'lucide-react';
import { Genre, Story } from '../types/story';
import { downloadStoryAsTxt } from '../services/storage';

interface SavedStoriesLibraryProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  onContinueStory: (story: Story) => void;
  onDeleteStory: (id: string, title: string) => void;
  onShowToast: (msg: string) => void;
  onNewStory: () => void;
}

export const SavedStoriesLibrary: React.FC<SavedStoriesLibraryProps> = ({
  stories,
  onSelectStory,
  onContinueStory,
  onDeleteStory,
  onShowToast,
  onNewStory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [storyToDelete, setStoryToDelete] = useState<{ id: string; title: string } | null>(null);

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.fullText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = genreFilter === 'all' || story.genre === genreFilter;

    return matchesSearch && matchesGenre;
  });

  const totalWords = stories.reduce((acc, s) => acc + (s.wordCount || 0), 0);
  const uniqueGenres = Array.from(new Set(stories.map((s) => s.genre))).length;

  const handleDownload = (e: React.MouseEvent, story: Story) => {
    e.stopPropagation();
    downloadStoryAsTxt(story);
    onShowToast(`Downloaded "${story.title}.txt"`);
  };

  const handleConfirmDelete = () => {
    if (storyToDelete) {
      onDeleteStory(storyToDelete.id, storyToDelete.title);
      setStoryToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Metrics */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#131032] to-[#0b0a1a] border border-purple-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
            <BookMarked className="w-4 h-4" />
            <span>Archive of Imagination</span>
          </div>
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">
            Saved Stories Library
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            Browse, re-read, expand, or download your complete collection of tales. All stories are stored locally on your device for instant offline access.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-6 py-3 px-5 rounded-xl bg-[#0b0a1a]/80 border border-purple-900/40 text-xs text-slate-400 shrink-0">
          <div>
            <span className="block font-heading text-lg font-bold text-slate-100 tabular-nums">
              {stories.length}
            </span>
            <span>Saved Stories</span>
          </div>
          <div className="w-px h-8 bg-purple-950" />
          <div>
            <span className="block font-heading text-lg font-bold text-slate-100 tabular-nums">
              {totalWords.toLocaleString()}
            </span>
            <span>Words Weaved</span>
          </div>
          <div className="w-px h-8 bg-purple-950" />
          <div>
            <span className="block font-heading text-lg font-bold text-slate-100 tabular-nums">
              {uniqueGenres}
            </span>
            <span>Genres</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#12102b] border border-purple-900/40">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories by title, characters, or text..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0b0a1a] border border-purple-900/40 text-slate-200 text-xs focus:outline-none focus:border-purple-500 placeholder-slate-500"
          />
        </div>

        {/* Genre Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="py-2 px-3 rounded-lg bg-[#0b0a1a] border border-purple-900/40 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Genres ({stories.length})</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Horror">Horror</option>
            <option value="Adventure">Adventure</option>
            <option value="Comedy">Comedy</option>
            <option value="Romance-free friendship stories">Friendship</option>
            <option value="Inspirational">Inspirational</option>
          </select>
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#12102b] border border-purple-900/30 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-900/40 flex items-center justify-center text-purple-400 mb-3">
            <BookMarked className="w-6 h-6" />
          </div>
          <h4 className="font-heading text-base font-bold text-slate-200 mb-1">
            No Stories Found
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
            {searchQuery || genreFilter !== 'all'
              ? 'No stories match your current search or genre filter.'
              : 'You have not created any stories yet. Launch the story generator to craft your first masterpiece!'}
          </p>
          <button
            onClick={onNewStory}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Create a New Story Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => {
            const readingTime = Math.max(1, Math.ceil(story.wordCount / 200));
            const formattedDate = new Date(story.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={story.id}
                onClick={() => onSelectStory(story)}
                className="p-5 rounded-2xl bg-[#12102b] border border-purple-900/40 hover:border-purple-600/70 hover:shadow-xl hover:shadow-purple-950/50 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                <div>
                  {/* Story thumbnail if exists */}
                  {story.imageUrl && (
                    <div className="h-36 -mx-5 -mt-5 mb-4 overflow-hidden relative border-b border-purple-950">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12102b] via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Header metadata */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-purple-400 uppercase tracking-wider text-[11px]">
                      {story.genre}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-purple-400" />
                      <span>{readingTime} min</span>
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-purple-200 transition-colors mb-2 line-clamp-2">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-3 mb-4">
                    {story.synopsis || story.beginning || story.fullText}
                  </p>
                </div>

                <div>
                  {/* Character pills if present */}
                  {story.characterNames && story.characterNames.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {story.characterNames.slice(0, 2).map((c, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-900/40 line-clamp-1 max-w-[140px]"
                        >
                          {c}
                        </span>
                      ))}
                      {story.characterNames.length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                          +{story.characterNames.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Action Footer */}
                  <div className="pt-3 border-t border-purple-950/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onContinueStory(story);
                        }}
                        title="Continue Story"
                        className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-purple-950 text-slate-300 hover:text-purple-200 border border-purple-950 transition-colors cursor-pointer"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDownload(e, story)}
                        title="Download TXT"
                        className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-purple-950 text-slate-300 hover:text-purple-200 border border-purple-950 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStoryToDelete({ id: story.id, title: story.title });
                        }}
                        title="Delete Story"
                        className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {storyToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12102b] border border-red-900/60 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h4 className="font-heading text-lg font-bold text-white mb-2">
              Delete Story?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to delete <span className="text-purple-300 font-semibold">"{storyToDelete.title}"</span>? This action removes the story from your local library permanently.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setStoryToDelete(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium cursor-pointer"
              >
                Delete Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
