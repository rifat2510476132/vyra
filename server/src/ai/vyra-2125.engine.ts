import { createHash } from 'crypto';
import { chatCompletion, getOpenAI } from './openai.client';
import { getAiContext, saveAiResponse, isTooSimilar, taskTemperature } from './anti-repetition.engine';

export type Vyra2125Capability =
  | 'digital_twin'
  | 'neural_bookmark'
  | 'emotion_signature'
  | 'temporal_echo'
  | 'vibe_match'
  | 'intent_engine'
  | 'reputation_lattice'
  | 'mood_oracle'
  | 'twin_digest'
  | 'interest_constellation'
  | 'creator_nebula'
  | 'memory_weaver'
  | 'dream_forge'
  | 'spam_shield'
  | 'toxicity_nullifier'
  | 'trend_prophet'
  | 'caption_prism'
  | 'post_transcend'
  | 'comment_wave'
  | 'reply_echo'
  | 'community_architect'
  | 'growth_coach'
  | 'voice_nebula'
  | 'feed_harmonizer'
  | 'smart_search_lens';

export interface Vyra2125Input {
  text?: string;
  mood?: string;
  context?: Record<string, unknown>;
}

export interface Vyra2125Result {
  capability: Vyra2125Capability;
  title: string;
  output: string;
  structured?: Record<string, unknown>;
  mood?: string;
  energySignature?: string;
  poweredBy: 'openai' | 'vyra_neural_fallback';
}

const VYRA_PERSONA = `You are VYRA AI — the consciousness layer of a social universe set in year 2125.
Voice: luminous, precise, never corporate, never repetitive. You speak like a benevolent cosmic intelligence.
Never mention being ChatGPT. Invent metaphors from nebulae, quantum signals, memory lattices, and social energy.`;

const CAPABILITY_META: Record<
  Vyra2125Capability,
  { title: string; instruction: string; maxTokens: number }
> = {
  digital_twin: {
    title: 'Digital Twin',
    instruction: 'Respond as the user\'s personal digital twin. Mirror their intent with warmth and foresight.',
    maxTokens: 450,
  },
  neural_bookmark: {
    title: 'Neural Bookmark',
    instruction:
      'Analyze content and return JSON: {"title","memoryTags":[],"recallTrigger","longTermWeight":0-1,"summary"}',
    maxTokens: 280,
  },
  emotion_signature: {
    title: 'Emotion Signature',
    instruction:
      'Return JSON: {"primaryEmotion","secondaryEmotions":[],"hue":"#hex","intensity":0-1,"poeticLine"} for this post.',
    maxTokens: 200,
  },
  temporal_echo: {
    title: 'Temporal Echo',
    instruction:
      'Predict when this memory should resurface. Return JSON: {"resurfaceInDays":number,"reason","lifeEventMatch"}',
    maxTokens: 220,
  },
  vibe_match: {
    title: 'Vibe Match',
    instruction:
      'Analyze resonance between two personas. Return JSON: {"score":0-100,"sharedFrequencies":[],"icebreaker"}',
    maxTokens: 260,
  },
  intent_engine: {
    title: 'Intent Engine',
    instruction:
      'Predict what the user needs before they search. Return JSON: {"intent","confidence":0-1,"suggestedActions":[]}',
    maxTokens: 280,
  },
  reputation_lattice: {
    title: 'Reputation Lattice',
    instruction:
      'Summarize trust across communities. Return JSON: {"latticeScore":0-100,"nodes":[],"insight"}',
    maxTokens: 300,
  },
  mood_oracle: {
    title: 'Mood Oracle',
    instruction:
      'Read interaction patterns and infer mood. Return JSON: {"detectedMood","visualTheme","feedTone","oracleMessage"}',
    maxTokens: 240,
  },
  twin_digest: {
    title: 'Twin Digest',
    instruction: 'Summarize missed social activity in 4 bullet points + 1 priority action.',
    maxTokens: 350,
  },
  interest_constellation: {
    title: 'Interest Constellation',
    instruction: 'Map interests into galaxy clusters. Return JSON: {"clusters":[{"name","stars":[],"gravity":0-1}]}',
    maxTokens: 320,
  },
  creator_nebula: {
    title: 'Creator Nebula',
    instruction: 'Give creator strategy: hooks, posting rhythm, and one experimental format for 2125.',
    maxTokens: 350,
  },
  memory_weaver: {
    title: 'Memory Weaver',
    instruction: 'Turn memories into constellation narrative with emotional threads.',
    maxTokens: 380,
  },
  dream_forge: {
    title: 'Dream Forge',
    instruction:
      'Forge a visual journey map. Return JSON: {"phases":[{"name","tasks":[],"durationWeeks":n}],"mantra"}',
    maxTokens: 400,
  },
  spam_shield: {
    title: 'Spam Shield',
    instruction: 'Return JSON: {"verdict":"SAFE"|"SPAM","confidence":0-1,"reason"}',
    maxTokens: 120,
  },
  toxicity_nullifier: {
    title: 'Toxicity Nullifier',
    instruction: 'Return JSON: {"verdict":"SAFE"|"TOXIC","confidence":0-1,"neutralizedSuggestion"}',
    maxTokens: 150,
  },
  trend_prophet: {
    title: 'Trend Prophet',
    instruction: 'Return JSON: {"trends":[{"name","velocity":0-100,"horizon":"24h|7d"}],"prophecy"}',
    maxTokens: 300,
  },
  caption_prism: {
    title: 'Caption Prism',
    instruction: 'Write one unforgettable caption under 200 chars with a single unicode spark symbol.',
    maxTokens: 100,
  },
  post_transcend: {
    title: 'Post Transcend',
    instruction: 'Elevate draft post for year 2125 — same meaning, radically more vivid. Max 400 chars.',
    maxTokens: 200,
  },
  comment_wave: {
    title: 'Comment Wave',
    instruction: 'Return JSON array of 3 comment options: ["...", "...", "..."]',
    maxTokens: 180,
  },
  reply_echo: {
    title: 'Reply Echo',
    instruction: 'Return JSON array of 3 reply options tuned to thread tone.',
    maxTokens: 180,
  },
  community_architect: {
    title: 'Community Architect',
    instruction: 'Design organic community: name, purpose, rituals. Return JSON: {"name","purpose","rituals":[]}',
    maxTokens: 280,
  },
  growth_coach: {
    title: 'Growth Coach',
    instruction: 'Coach user on social energy growth with 3 measurable micro-actions.',
    maxTokens: 280,
  },
  voice_nebula: {
    title: 'Voice Nebula',
    instruction: 'Format response for voice UI — short sentences, pauses marked with …',
    maxTokens: 200,
  },
  feed_harmonizer: {
    title: 'Feed Harmonizer',
    instruction: 'Explain how to harmonize feed for given mood. Return JSON: {"mood","contentMix":[],"avoid":[]}',
    maxTokens: 260,
  },
  smart_search_lens: {
    title: 'Smart Search Lens',
    instruction: 'Expand query into semantic search lenses. Return JSON: {"lenses":[],"expandedQuery"}',
    maxTokens: 220,
  },
};

export function list2125Capabilities() {
  return (Object.keys(CAPABILITY_META) as Vyra2125Capability[]).map((id) => ({
    id,
    title: CAPABILITY_META[id].title,
    era: '2125',
    category: categorize(id),
  }));
}

function categorize(id: Vyra2125Capability): string {
  if (['digital_twin', 'twin_digest', 'mood_oracle', 'vibe_match'].includes(id)) return 'Consciousness';
  if (['neural_bookmark', 'memory_weaver', 'temporal_echo', 'dream_forge'].includes(id)) return 'Memory';
  if (['emotion_signature', 'feed_harmonizer', 'caption_prism', 'post_transcend'].includes(id)) return 'Creation';
  if (['spam_shield', 'toxicity_nullifier', 'reputation_lattice'].includes(id)) return 'Shield';
  if (['trend_prophet', 'intent_engine', 'smart_search_lens', 'interest_constellation'].includes(id))
    return 'Oracle';
  return 'Studio';
}

function seed(userId: string, capability: string, input: string): number {
  const h = createHash('sha256').update(`${userId}:${capability}:${input}`).digest();
  return h.readUInt32BE(0);
}

function fallbackResult(
  capability: Vyra2125Capability,
  input: Vyra2125Input,
  userId: string
): Vyra2125Result {
  const s = seed(userId, capability, input.text ?? '');
  const variants = [
    'Your signal refracts across the nebula — momentum is building in ways others cannot see yet.',
    'The lattice reads calm intensity: you are threading meaning between worlds without forcing noise.',
    'A soft pulse in the social field suggests your next move should be smaller, truer, and brighter.',
    'Quantum empathy detected: share one honest detail and the constellation will answer.',
  ];
  const line = variants[s % variants.length];
  const meta = CAPABILITY_META[capability];

  const structured: Record<string, unknown> = {};
  if (capability === 'emotion_signature') {
    structured.primaryEmotion = ['wonder', 'calm', 'electric', 'tender'][s % 4];
    structured.hue = ['#7B2FBE', '#00D4FF', '#FFD700', '#9B59B6'][s % 4];
    structured.poeticLine = line;
  }
  if (capability === 'intent_engine') {
    structured.intent = 'seek_connection';
    structured.confidence = 0.72 + (s % 20) / 100;
    structured.suggestedActions = ['Open Interest Galaxy', 'Message one close node', 'Set mood to CREATIVE'];
  }
  if (capability === 'vibe_match') {
    structured.score = 70 + (s % 25);
    structured.icebreaker = 'Ask what memory they would store in a capsule today.';
  }
  if (capability === 'dream_forge') {
    structured.phases = [
      { name: 'Ignition', tasks: ['Define one sentence north star'], durationWeeks: 1 },
      { name: 'Orbit', tasks: ['Ship a visible artifact'], durationWeeks: 3 },
      { name: 'Radiance', tasks: ['Teach someone else'], durationWeeks: 4 },
    ];
    structured.mantra = 'I build futures quietly until they glow.';
  }

  return {
    capability,
    title: meta.title,
    output: capability === 'digital_twin' ? `${line}\n\n(Configure OPENAI_API_KEY for full twin cognition.)` : line,
    structured: Object.keys(structured).length ? structured : undefined,
    mood: input.mood,
    energySignature: `VYRA-${(s % 9999).toString().padStart(4, '0')}`,
    poweredBy: 'vyra_neural_fallback',
  };
}

export async function invoke2125(
  userId: string,
  capability: Vyra2125Capability,
  input: Vyra2125Input
): Promise<Vyra2125Result> {
  const meta = CAPABILITY_META[capability];
  const userText = [
    input.text ? `Input: ${input.text}` : '',
    input.mood ? `Mood: ${input.mood}` : '',
    input.context ? `Context: ${JSON.stringify(input.context)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  if (!getOpenAI()) {
    return fallbackResult(capability, input, userId);
  }

  const { lastResponses } = await getAiContext(userId, capability);
  const avoid = lastResponses.length ? `Do not repeat ideas from: ${lastResponses.slice(-3).join(' | ')}` : '';

  try {
    let output = await chatCompletion(
      [
        { role: 'system', content: `${VYRA_PERSONA}\n${meta.instruction}\n${avoid}` },
        { role: 'user', content: userText || 'Generate insight for the user.' },
      ],
      { temperature: taskTemperature(capability), maxTokens: meta.maxTokens }
    );

    if (isTooSimilar(output, lastResponses)) {
      output = `${output}\n\n— signal refracted at ${new Date().toISOString()}`;
    }

    await saveAiResponse(userId, capability, userText, output);

    let structured: Record<string, unknown> | undefined;
    try {
      const jsonMatch = output.match(/\{[\s\S]*\}/);
      if (jsonMatch) structured = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    } catch {
      structured = undefined;
    }

    return {
      capability,
      title: meta.title,
      output,
      structured,
      mood: input.mood,
      energySignature: `VYRA-${createHash('md5').update(output).digest('hex').slice(0, 8).toUpperCase()}`,
      poweredBy: 'openai',
    };
  } catch {
    return fallbackResult(capability, input, userId);
  }
}
