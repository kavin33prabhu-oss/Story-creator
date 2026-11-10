import { Character, Story } from '../types/story';

const STORIES_STORAGE_KEY = 'ai_story_creator_stories_v1';
const CHARACTERS_STORAGE_KEY = 'ai_story_creator_characters_v1';

// Seed starter stories for initial richness
const SEED_STORIES: Story[] = [
  {
    id: 'seed_story_fantasy',
    title: 'The Whispering Spire of Aethelgard',
    genre: 'Fantasy',
    synopsis:
      'High above the mortal clouds, an apprentice cartographer ascends a levitating crystalline sanctuary to restore an ancient celestial compass before the midnight eclipse extinguishes the floating realm.',
    beginning:
      'The air at seven thousand cubits smelled of ozone and powdered amethyst. Lyndis tightened the leather straps of her windswept satchel, feeling the heavy, cold brass of the astrolabe press against her ribs. Below her boots, the world was nothing more than a blanket of indigo mist pierced by the floating roots of the weeping willow islands. The Whispering Spire loomed before her—a monolith of faceted sapphire crystals humming a lullaby in a dialect no human tongue had spoken for six centuries.',
    middle:
      'As Lyndis reached the central rotunda, the sky darkened with unnatural swiftness. The celestial compass atop the dais had ceased rotating; its concentric rings of star-forged titanium were frozen in frost. From the shadows between the crystalline pillars emerged Sylas, the sanctuary’s guardian golem, his runic eyes flickering with amber apprehension. "The planetary alignment falters, Apprentice," the golem droned, gears grinding like distant thunder. "If the zenith prism does not catch the eclipse’s first corona beam, the gravity tether dissolves forever."',
    ending:
      'With her fingers trembling from the icy wind, Lyndis drew her grandmother’s tuning fork and struck the central spire. A pure harmonic note resonated through the crystal chamber, shattering the frost encasing the gears. As the moon slipped over the crimson sun, the beacon fired a magnificent column of violet radiance toward the heavens, reconnecting the floating islands in a web of living starlight. Lyndis exhaled, watching the willow blossoms catch fire with bioluminescent wonder.',
    fullText:
      'The air at seven thousand cubits smelled of ozone and powdered amethyst. Lyndis tightened the leather straps of her windswept satchel, feeling the heavy, cold brass of the astrolabe press against her ribs. Below her boots, the world was nothing more than a blanket of indigo mist pierced by the floating roots of the weeping willow islands. The Whispering Spire loomed before her—a monolith of faceted sapphire crystals humming a lullaby in a dialect no human tongue had spoken for six centuries.\n\nAs Lyndis reached the central rotunda, the sky darkened with unnatural swiftness. The celestial compass atop the dais had ceased rotating; its concentric rings of star-forged titanium were frozen in frost. From the shadows between the crystalline pillars emerged Sylas, the sanctuary’s guardian golem, his runic eyes flickering with amber apprehension. "The planetary alignment falters, Apprentice," the golem droned, gears grinding like distant thunder. "If the zenith prism does not catch the eclipse’s first corona beam, the gravity tether dissolves forever."\n\nWith her fingers trembling from the icy wind, Lyndis drew her grandmother’s tuning fork and struck the central spire. A pure harmonic note resonated through the crystal chamber, shattering the frost encasing the gears. As the moon slipped over the crimson sun, the beacon fired a magnificent column of violet radiance toward the heavens, reconnecting the floating islands in a web of living starlight. Lyndis exhaled, watching the willow blossoms catch fire with bioluminescent wonder.',
    characterNames: ['Lyndis (Apprentice Cartographer)', 'Sylas (Sanctuary Golem)'],
    length: 'medium',
    language: 'English',
    style: 'Cinematic & Dramatic',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    wordCount: 312,
    illustrationConcept:
      'A floating crystal island with radiant sapphire spires, weeping willow trees dripping with azure light, and a young explorer overlooking a celestial eclipse.',
    imageUrl: '/src/assets/images/story_fantasy_realm_1794321566758.jpg',
  },
  {
    id: 'seed_story_scifi',
    title: 'The Silent Signal of Kepler-452',
    genre: 'Science Fiction',
    synopsis:
      'Stranded on a glacial world beneath iridescent auroras, an exploratory engineer and his tracked rover unit decipher a resonant song echoing from inside a mountain of monolithic quartz.',
    beginning:
      'The barometer inside Commander Vance’s pressurized helmet read minus sixty Celsius, but the ice beneath his magnetic boots radiated a faint, rhythmic heat. Beside him, Unit 7—a treaded survey automaton with twin antenna stalks—tilted its optical scanner upward toward the twin moons piercing the violet stratosphere. An aurora borealis the color of bruised plums rippled overhead, painting the crystalline ridge in mesmerizing sheets of ultraviolet light.',
    middle:
      'Unit 7 chirped a three-note sequence, projecting an audio waveform onto Vance’s heads-up display. "Anomaly detected, Commander. The frequency is not tectonic. It matches the Fibonacci progression." Vance unhooked the sonic scanner from his utility belt and pressed the receiver directly against the sheer face of the quartz monolith. Through the comms link came a sound like glass harps played in a vacuum—a message beamed across thirty light-years, buried here waiting for someone with ears to listen.',
    ending:
      '"It is not a warning, Unit 7," Vance whispered, as the quartz wall slowly turned translucent, revealing stellar charts of constellations that existed before human antiquity. "It is an invitation." Together, man and machine sat at the edge of the precipice, logging the coordinates that would change humanity’s place among the stars forever.',
    fullText:
      'The barometer inside Commander Vance’s pressurized helmet read minus sixty Celsius, but the ice beneath his magnetic boots radiated a faint, rhythmic heat. Beside him, Unit 7—a treaded survey automaton with twin antenna stalks—tilted its optical scanner upward toward the twin moons piercing the violet stratosphere. An aurora borealis the color of bruised plums rippled overhead, painting the crystalline ridge in mesmerizing sheets of ultraviolet light.\n\nUnit 7 chirped a three-note sequence, projecting an audio waveform onto Vance’s heads-up display. "Anomaly detected, Commander. The frequency is not tectonic. It matches the Fibonacci progression." Vance unhooked the sonic scanner from his utility belt and pressed the receiver directly against the sheer face of the quartz monolith. Through the comms link came a sound like glass harps played in a vacuum—a message beamed across thirty light-years, buried here waiting for someone with ears to listen.\n\n"It is not a warning, Unit 7," Vance whispered, as the quartz wall slowly turned translucent, revealing stellar charts of constellations that existed before human antiquity. "It is an invitation." Together, man and machine sat at the edge of the precipice, logging the coordinates that would change humanity’s place among the stars forever.',
    characterNames: ['Commander Vance', 'Unit 7 (Survey Automaton)'],
    length: 'short',
    language: 'English',
    style: 'Fast-paced & Action-driven',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    wordCount: 268,
    illustrationConcept:
      'An astronaut and a robotic survey rover standing on a mountain ledge gazing at crystalline peaks under a vivid cosmic aurora and twin moons.',
    imageUrl: '/src/assets/images/story_scifi_cosmos_1794321567098.jpg',
  },
];

const SEED_CHARACTERS: Character[] = [
  {
    id: 'seed_char_1',
    name: 'Lyndis Vael',
    role: 'Apprentice Cartographer of the Upper Skies',
    appearance: 'Lean and nimble, wearing wind-sculpted boiled leather coat, brass goggles, and copper-threaded hair wraps.',
    personality: ['Relentlessly curious', 'Stubbornly pragmatic', 'Quietly compassionate', 'Perceptive observer'],
    background: 'Raised in the low cloud harbors of Oakhaven, Lyndis spent her childhood calculating stellar drifts until she won an imperial scholarship to map the uncharted sky archipelago.',
    quirk: 'Always carries a brass pocket pendulum that she taps three times against her collarbone before making difficult choices.',
    genre: 'Fantasy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed_char_2',
    name: 'Inspector James Hallowell',
    role: 'Midnight Watch Detective',
    appearance: 'Tall and gaunt with silvering temples, worn tweed trench coat smelling of pipe tobacco and damp rain, silver pocket watch.',
    personality: ['Methodical deduction', 'Unshakeable composure', 'Haunted by past cases', 'Dry, wry humor'],
    background: 'Former military cryptographer who transferred to the metropolitan constabulary after unmasking the notorious Black Wharf Syndicate.',
    quirk: 'Sketches quick geometrical diagrams of crime scenes on matches before lighting his lamp.',
    genre: 'Mystery',
    createdAt: new Date().toISOString(),
  },
];

export function getSavedStories(): Story[] {
  try {
    const raw = localStorage.getItem(STORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(SEED_STORIES));
      return SEED_STORIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read stories from localStorage:', err);
    return SEED_STORIES;
  }
}

export function saveStory(story: Story): void {
  try {
    const stories = getSavedStories();
    const existingIndex = stories.findIndex((s) => s.id === story.id);
    if (existingIndex >= 0) {
      stories[existingIndex] = story;
    } else {
      stories.unshift(story);
    }
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories));
  } catch (err) {
    console.error('Failed to save story to localStorage:', err);
  }
}

export function deleteStory(id: string): void {
  try {
    const stories = getSavedStories().filter((s) => s.id !== id);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories));
  } catch (err) {
    console.error('Failed to delete story from localStorage:', err);
  }
}

export function getSavedCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(CHARACTERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(SEED_CHARACTERS));
      return SEED_CHARACTERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read characters from localStorage:', err);
    return SEED_CHARACTERS;
  }
}

export function saveCharacter(character: Character): void {
  try {
    const characters = getSavedCharacters();
    const existingIndex = characters.findIndex((c) => c.id === character.id);
    if (existingIndex >= 0) {
      characters[existingIndex] = character;
    } else {
      characters.unshift(character);
    }
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(characters));
  } catch (err) {
    console.error('Failed to save character to localStorage:', err);
  }
}

export function deleteCharacter(id: string): void {
  try {
    const characters = getSavedCharacters().filter((c) => c.id !== id);
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(characters));
  } catch (err) {
    console.error('Failed to delete character from localStorage:', err);
  }
}

// Download story as a beautifully structured TXT document
export function downloadStoryAsTxt(story: Story): void {
  const charactersStr =
    story.characterNames && story.characterNames.length > 0
      ? story.characterNames.join(', ')
      : 'Unspecified';

  const dateStr = new Date(story.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const content = `================================================================================
${story.title.toUpperCase()}
================================================================================
Genre: ${story.genre}
Length: ${story.length.toUpperCase()} (~${story.wordCount} words)
Language: ${story.language}
Style: ${story.style}
Created: ${dateStr}
Characters: ${charactersStr}

SYNOPSIS:
${story.synopsis}

--------------------------------------------------------------------------------
STORY TEXT
--------------------------------------------------------------------------------

${story.fullText}

================================================================================
ILLUSTRATION CONCEPT:
${story.illustrationConcept}
================================================================================
Generated with AI Story Creator | Powered by Google Gemini AI
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const sanitizedTitle = story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  link.href = url;
  link.download = `${sanitizedTitle || 'story'}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
