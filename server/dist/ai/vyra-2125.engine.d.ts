export type Vyra2125Capability = 'digital_twin' | 'neural_bookmark' | 'emotion_signature' | 'temporal_echo' | 'vibe_match' | 'intent_engine' | 'reputation_lattice' | 'mood_oracle' | 'twin_digest' | 'interest_constellation' | 'creator_nebula' | 'memory_weaver' | 'dream_forge' | 'spam_shield' | 'toxicity_nullifier' | 'trend_prophet' | 'caption_prism' | 'post_transcend' | 'comment_wave' | 'reply_echo' | 'community_architect' | 'growth_coach' | 'voice_nebula' | 'feed_harmonizer' | 'smart_search_lens';
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
export declare function list2125Capabilities(): {
    id: Vyra2125Capability;
    title: string;
    era: string;
    category: string;
}[];
export declare function invoke2125(userId: string, capability: Vyra2125Capability, input: Vyra2125Input): Promise<Vyra2125Result>;
//# sourceMappingURL=vyra-2125.engine.d.ts.map