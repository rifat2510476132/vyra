export declare class AntiRepetitionEngine {
    private readonly history;
    private readonly maxHistory;
    record(userId: string, response: string): void;
    isTooSimilar(userId: string, candidate: string): boolean;
    private normalize;
    private similarity;
}
export declare const antiRepetitionEngine: AntiRepetitionEngine;
export declare function getAiContext(userId: string, feature: string): Promise<{
    lastResponses: string[];
    contextJson: Record<string, unknown>;
}>;
export declare function saveAiResponse(userId: string, feature: string, prompt: string, response: string): Promise<void>;
export declare function isTooSimilar(candidate: string, prior: string[]): boolean;
export declare function taskTemperature(task: string): number;
//# sourceMappingURL=anti-repetition.engine.d.ts.map