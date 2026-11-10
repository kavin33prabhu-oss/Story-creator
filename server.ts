import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

// Initialize Google Gen AI client with User-Agent header for aistudio-build
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(apiKey),
      timestamp: new Date().toISOString(),
    });
  });

  // Story Generation Endpoint
  app.post('/api/story/generate', async (req: Request, res: Response) => {
    try {
      const { idea, genre, length, characters, language, style } = req.body;

      if (!idea && !genre) {
        return res.status(400).json({ error: 'Please provide a story idea or choose a genre.' });
      }

      if (!apiKey) {
        return res.status(500).json({
          error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment secrets.',
        });
      }

      let wordTarget = 'around 350-450 words';
      if (length === 'short') wordTarget = 'around 250-350 words';
      else if (length === 'medium') wordTarget = 'around 550-700 words';
      else if (length === 'long') wordTarget = 'around 900-1200 words';

      const characterInstruction = Array.isArray(characters) && characters.length > 0
        ? `Ensure these specific characters play prominent roles in the story: ${characters.join(', ')}.`
        : 'Create authentic, memorable characters suited for this narrative.';

      const prompt = `You are a master storyteller creating an original, captivating story in the ${genre || 'Fantasy'} genre.
Story Premise / Idea: "${idea || 'An unexpected mystery unfolding under the twilight sky'}"
Selected Genre: ${genre || 'Fantasy'}
Target Word Count: ${wordTarget}
Language: Write the story entirely in ${language || 'English'}.
Writing Style: ${style || 'Cinematic & Dramatic'}
Character Guidance: ${characterInstruction}

Requirements:
1. Provide a compelling, captivating Title.
2. Provide a 2-sentence captivating Synopsis.
3. Clearly structure the narrative into three distinct acts:
   - Beginning: Establish the world, characters, inciting incident, and initial tension.
   - Middle: Rising action, obstacles, development of conflicts, surprising revelation, and climax.
   - Ending: Meaningful resolution, emotional resonance, and satisfying closure.
4. Provide the full complete story text with paragraph breaks.
5. Create a vivid, highly descriptive Illustration Concept describing a single central cinematic scene that captures the soul of this story.
6. Provide a list of key character names with short 1-line descriptors.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an award-winning master author and creative writing mentor. You weave vivid sensory details, emotional depth, authentic dialogue, and gripping pacing. Deliver the output strictly in the requested JSON structure.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'An evocative, attractive title for the story',
              },
              synopsis: {
                type: Type.STRING,
                description: 'A 2-sentence compelling hook and synopsis',
              },
              beginning: {
                type: Type.STRING,
                description: 'The beginning act of the story',
              },
              middle: {
                type: Type.STRING,
                description: 'The middle act of the story including conflict and climax',
              },
              ending: {
                type: Type.STRING,
                description: 'The ending act with resolution',
              },
              fullText: {
                type: Type.STRING,
                description: 'The full unbroken story text with paragraphs',
              },
              illustrationConcept: {
                type: Type.STRING,
                description: 'A vivid concept description of a key dramatic scene suitable for an illustration',
              },
              characters: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Names of the characters involved in the story',
              },
            },
            required: ['title', 'synopsis', 'beginning', 'middle', 'ending', 'fullText', 'illustrationConcept'],
          },
        },
      });

      const rawJson = response.text || '{}';
      const parsedData = JSON.parse(rawJson);

      const wordCount = (parsedData.fullText || `${parsedData.beginning} ${parsedData.middle} ${parsedData.ending}`)
        .trim()
        .split(/\s+/).length;

      return res.json({
        success: true,
        data: {
          ...parsedData,
          genre: genre || 'Fantasy',
          length: length || 'medium',
          language: language || 'English',
          style: style || 'Cinematic & Dramatic',
          wordCount,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      console.error('Error generating story:', err);
      const message = err instanceof Error ? err.message : 'Failed to generate story';
      return res.status(500).json({
        success: false,
        error: message,
      });
    }
  });

  // Continue My Story Endpoint
  app.post('/api/story/continue', async (req: Request, res: Response) => {
    try {
      const { existingStory, continuationPrompt, genre, style, language } = req.body;

      if (!existingStory || !existingStory.trim()) {
        return res.status(400).json({ error: 'Please provide the existing story to continue.' });
      }

      if (!apiKey) {
        return res.status(500).json({
          error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment secrets.',
        });
      }

      const prompt = `You are a master fiction author tasked with writing a seamless, captivating continuation to an ongoing story.

EXISTING STORY:
"""
${existingStory}
"""

USER'S CONTINUATION DIRECTIVE / NEXT EVENT:
"${continuationPrompt || 'Develop an unexpected twist or deeper conflict that pushes the characters to their limits.'}"

Genre: ${genre || 'Fiction'}
Style: ${style || 'Cinematic & Dramatic'}
Language: Maintain the same language (${language || 'English'}).

Instructions:
1. Maintain strict consistency in tone, pacing, character motivations, and world-building established in the original story.
2. Pick up directly where the story left off or naturally transition into the next chapter/sequence.
3. Write a rich, immersive continuation (approximately 300 to 500 words).
4. Provide a descriptive title for this continuation chapter.
5. Create a new illustration concept reflecting the new key dramatic moment.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an expert novel editor and continuation author. You match authorial voice with perfection and introduce compelling plot developments.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              continuationTitle: {
                type: Type.STRING,
                description: 'Title or chapter header for the new continuation',
              },
              continuationText: {
                type: Type.STRING,
                description: 'The new continuation narrative text',
              },
              newIllustrationConcept: {
                type: Type.STRING,
                description: 'Concept for illustrating this new scene',
              },
            },
            required: ['continuationTitle', 'continuationText', 'newIllustrationConcept'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const continuationText = parsed.continuationText || '';
      const mergedStory = `${existingStory.trim()}\n\n---\n\n### ${parsed.continuationTitle || 'Part II'}\n\n${continuationText}`;
      const totalWords = mergedStory.trim().split(/\s+/).length;

      return res.json({
        success: true,
        data: {
          continuationTitle: parsed.continuationTitle,
          continuationText,
          mergedStory,
          newIllustrationConcept: parsed.newIllustrationConcept,
          totalWords,
          date: new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      console.error('Error continuing story:', err);
      const message = err instanceof Error ? err.message : 'Failed to continue story';
      return res.status(500).json({
        success: false,
        error: message,
      });
    }
  });

  // AI Character Generator Endpoint
  app.post('/api/character/generate', async (req: Request, res: Response) => {
    try {
      const { genre, archetypeOrRole, inspiration } = req.body;

      if (!apiKey) {
        return res.status(500).json({
          error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment secrets.',
        });
      }

      const prompt = `Create a fully fleshed out, unique and memorable original character tailored for a ${genre || 'Fantasy'} story.
Archetype or Role idea: ${archetypeOrRole || 'Unique protagonist or key companion'}
Inspiration or specific trait requested: ${inspiration || 'Rich internal conflict and compelling presence'}

Generate:
1. Character Full Name
2. Role or Title (e.g., "The Reluctant Cartographer", "Midnight Clockmaker", "Deep Sea Archivist")
3. Physical Appearance (clothing, distinctive features, bearing)
4. 3 to 4 distinct Personality Traits (with a short explanation)
5. Deep Character Background (origin story, driving desire, greatest fear)
6. A memorable Quirk or Talisman (a unique habit, vocal cadence, or personal object they carry)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a master character designer for high-end literature and screenwriting. Avoid tired clichés; design characters with depth, vulnerability, and distinctive charisma.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              appearance: { type: Type.STRING },
              personality: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              background: { type: Type.STRING },
              quirk: { type: Type.STRING },
            },
            required: ['name', 'role', 'appearance', 'personality', 'background', 'quirk'],
          },
        },
      });

      const characterData = JSON.parse(response.text || '{}');

      return res.json({
        success: true,
        data: {
          id: 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
          ...characterData,
          genre: genre || 'Fantasy',
          createdAt: new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      console.error('Error generating character:', err);
      const message = err instanceof Error ? err.message : 'Failed to generate character';
      return res.status(500).json({
        success: false,
        error: message,
      });
    }
  });

  // Story Scene Illustration Endpoint
  app.post('/api/story/illustrate', async (req: Request, res: Response) => {
    try {
      const { conceptPrompt, title, genre } = req.body;

      if (!conceptPrompt) {
        return res.status(400).json({ error: 'Illustration concept prompt is required.' });
      }

      if (!apiKey) {
        return res.status(500).json({
          error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment secrets.',
        });
      }

      // Detailed art prompt styling for the model
      const enrichedPrompt = `A breathtaking visual story illustration of: ${conceptPrompt}. Genre: ${genre || 'Storytelling'}. High artistic quality, atmospheric mood, rich depth, enchanting lighting, cinematic composition, digital painting masterpiece.`;

      try {
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                text: enrichedPrompt,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: '16:9',
            },
          },
        });

        let imageUrl: string | null = null;
        for (const part of imageResponse.candidates?.[0]?.content?.parts ?? []) {
          if (part.inlineData?.data) {
            const base64EncodeString: string = part.inlineData.data;
            const mime = part.inlineData.mimeType ?? 'image/png';
            imageUrl = `data:${mime};base64,${base64EncodeString}`;
            break;
          }
        }

        if (imageUrl) {
          return res.json({
            success: true,
            imageUrl,
            conceptPrompt,
          });
        }
      } catch (imageErr: unknown) {
        console.warn('Image generation model threw, providing enriched concept fallback:', imageErr);
      }

      // If direct image generation is unsupported or unavailable on the active tier,
      // return the enriched concept and prompt details gracefully so frontend displays
      // an aesthetic visual card with the concept and prompt
      return res.json({
        success: true,
        imageUrl: null,
        conceptPrompt,
        message: 'Concept visualized. Image generation model fallback activated.',
      });
    } catch (err: unknown) {
      console.error('Error in illustration endpoint:', err);
      const message = err instanceof Error ? err.message : 'Failed to illustrate story';
      return res.status(500).json({
        success: false,
        error: message,
      });
    }
  });

  // Mount Vite middleware in development or serve static in production
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Story Creator] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
