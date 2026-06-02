export declare const vyraAiService: {
    caption: (userId: string, context: string) => Promise<string>;
    improvePost: (userId: string, content: string) => Promise<string>;
    commentSuggestions: (userId: string, post: string) => Promise<string>;
    replySuggestions: (userId: string, thread: string) => Promise<string>;
    personalizeFeed: (userId: string, interests: string) => Promise<string>;
    moderateCommunity: (userId: string, text: string) => Promise<string>;
    detectSpam: (userId: string, text: string) => Promise<string>;
    detectToxic: (userId: string, text: string) => Promise<string>;
    detectTrends: (userId: string, corpus: string) => Promise<string>;
    creatorAssistant: (userId: string, brief: string) => Promise<string>;
    friendRecommendations: (userId: string, profile: string) => Promise<string>;
    communityRecommendations: (userId: string, interests: string) => Promise<string>;
    interestAnalysis: (userId: string, activity: string) => Promise<string>;
    smartSearch: (userId: string, query: string) => Promise<string>;
    digitalTwin: (userId: string, message: string) => Promise<string>;
    memoryAssistant: (userId: string, context: string) => Promise<string>;
    lifeOrganizer: (userId: string, goals: string) => Promise<string>;
    digitalIdentity: (userId: string, bio: string) => Promise<string>;
    reputationEngine: (userId: string, actions: string) => Promise<string>;
    growthCoach: (userId: string, metrics: string) => Promise<string>;
    intentEngine: (userId: string, signals: string) => Promise<string>;
    communityArchitect: (userId: string, topic: string) => Promise<string>;
    knowledgeCompanion: (userId: string, question: string) => Promise<string>;
    creativityAssistant: (userId: string, seed: string) => Promise<string>;
    voiceAssistant: (userId: string, transcript: string) => Promise<string>;
};
//# sourceMappingURL=vyra-ai.service.d.ts.map