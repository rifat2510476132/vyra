import OpenAI from 'openai';
export declare const defaultModel: string;
export declare function getOpenAIClient(): OpenAI;
export declare function chatCompletion(messages: OpenAI.Chat.ChatCompletionMessageParam[], options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
}): Promise<string>;
/** Nullable client when API key is not configured (dev fallback). */
export declare function getOpenAI(): OpenAI | null;
//# sourceMappingURL=openai.client.d.ts.map