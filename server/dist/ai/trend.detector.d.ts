export declare function detectTrendingGalaxies(): Promise<{
    galaxies: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        memberCount: number;
        trendingScore: number;
    }[];
    recentPostCount: number;
    topics: string[];
}>;
//# sourceMappingURL=trend.detector.d.ts.map