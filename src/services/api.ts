import {
  Character,
  CharacterGenerationRequest,
  Story,
  StoryContinuationRequest,
  StoryGenerationRequest,
} from '../types/story';

export async function checkApiHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.error('API health check error:', err);
    return { status: 'error', hasApiKey: false };
  }
}

export async function generateStoryApi(
  payload: StoryGenerationRequest
): Promise<{ success: boolean; data?: Story; error?: string }> {
  try {
    const res = await fetch('/api/story/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, error: json.error || 'Failed to generate story' };
    }

    const storyData: Story = {
      id: 'story_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: json.data.title || 'Untitled Tale',
      genre: json.data.genre,
      synopsis: json.data.synopsis || '',
      beginning: json.data.beginning || '',
      middle: json.data.middle || '',
      ending: json.data.ending || '',
      fullText:
        json.data.fullText ||
        `${json.data.beginning}\n\n${json.data.middle}\n\n${json.data.ending}`,
      characterNames: json.data.characters || payload.characters || [],
      length: json.data.length,
      language: json.data.language,
      style: json.data.style,
      createdAt: json.data.createdAt || new Date().toISOString(),
      wordCount: json.data.wordCount || 0,
      illustrationConcept: json.data.illustrationConcept || '',
    };

    return { success: true, data: storyData };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error occurred';
    return { success: false, error: message };
  }
}

export async function continueStoryApi(
  payload: StoryContinuationRequest
): Promise<{
  success: boolean;
  data?: {
    continuationTitle: string;
    continuationText: string;
    mergedStory: string;
    newIllustrationConcept: string;
    totalWords: number;
    date: string;
  };
  error?: string;
}> {
  try {
    const res = await fetch('/api/story/continue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, error: json.error || 'Failed to continue story' };
    }

    return { success: true, data: json.data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error occurred';
    return { success: false, error: message };
  }
}

export async function generateCharacterApi(
  payload: CharacterGenerationRequest
): Promise<{ success: boolean; data?: Character; error?: string }> {
  try {
    const res = await fetch('/api/character/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, error: json.error || 'Failed to generate character' };
    }

    return { success: true, data: json.data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error occurred';
    return { success: false, error: message };
  }
}

export async function illustrateStoryApi(
  conceptPrompt: string,
  title: string,
  genre: string
): Promise<{ success: boolean; imageUrl?: string | null; conceptPrompt?: string; error?: string }> {
  try {
    const res = await fetch('/api/story/illustrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conceptPrompt, title, genre }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, error: json.error || 'Failed to illustrate story' };
    }

    return {
      success: true,
      imageUrl: json.imageUrl,
      conceptPrompt: json.conceptPrompt,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error occurred';
    return { success: false, error: message };
  }
}
