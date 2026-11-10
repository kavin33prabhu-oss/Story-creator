export type Genre =
  | 'Horror'
  | 'Comedy'
  | 'Adventure'
  | 'Fantasy'
  | 'Mystery'
  | 'Romance-free friendship stories'
  | 'Science Fiction'
  | 'Inspirational';

export type StoryLength = 'short' | 'medium' | 'long';

export type StoryLanguage =
  | 'English'
  | 'Spanish'
  | 'French'
  | 'German'
  | 'Hindi'
  | 'Japanese'
  | 'Italian'
  | 'Portuguese';

export type WritingStyle =
  | 'Cinematic & Dramatic'
  | 'Classic Fairy Tale'
  | 'Dark & Suspenseful'
  | 'Fast-paced & Action-driven'
  | 'Whimsical & Lighthearted'
  | 'Poetic & Lyrical'
  | 'First-Person Memoir';

export interface Story {
  id: string;
  title: string;
  genre: Genre;
  synopsis: string;
  beginning: string;
  middle: string;
  ending: string;
  fullText: string;
  characterNames: string[];
  length: StoryLength;
  language: string;
  style: string;
  createdAt: string;
  wordCount: number;
  illustrationConcept: string;
  imageUrl?: string;
  continuationHistory?: Array<{
    prompt: string;
    text: string;
    date: string;
  }>;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  appearance: string;
  personality: string[];
  background: string;
  quirk: string;
  genre: Genre;
  createdAt: string;
}

export interface StoryGenerationRequest {
  idea: string;
  genre: Genre;
  length: StoryLength;
  characters: string[];
  language: string;
  style: string;
}

export interface StoryContinuationRequest {
  existingStory: string;
  continuationPrompt: string;
  genre?: string;
  style?: string;
  language?: string;
}

export interface CharacterGenerationRequest {
  genre: Genre;
  archetypeOrRole?: string;
  inspiration?: string;
}
