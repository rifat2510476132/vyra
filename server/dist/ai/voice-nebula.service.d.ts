export type VoiceNebulaVoice = 'nova' | 'shimmer' | 'echo' | 'alloy';
export interface VoiceNebulaResponse {
    transcript: string;
    reply: string;
    replyForSpeech: string;
    mood?: string;
    energySignature?: string;
    poweredBy: 'openai' | 'openai_voice' | 'vyra_neural_fallback';
    audioBase64?: string;
    audioMimeType?: string;
}
export declare function processVoiceNebula(userId: string, transcript: string, options?: {
    mood?: string;
    voice?: VoiceNebulaVoice;
}): Promise<VoiceNebulaResponse>;
//# sourceMappingURL=voice-nebula.service.d.ts.map