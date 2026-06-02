"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.antiRepetitionEngine = exports.AntiRepetitionEngine = void 0;
exports.getAiContext = getAiContext;
exports.saveAiResponse = saveAiResponse;
exports.isTooSimilar = isTooSimilar;
exports.taskTemperature = taskTemperature;
const prisma_1 = require("../lib/prisma");
class AntiRepetitionEngine {
    history = new Map();
    maxHistory = 10;
    record(userId, response) {
        const entries = this.history.get(userId) ?? [];
        entries.push(this.normalize(response));
        if (entries.length > this.maxHistory)
            entries.shift();
        this.history.set(userId, entries);
    }
    isTooSimilar(userId, candidate) {
        const normalized = this.normalize(candidate);
        const entries = this.history.get(userId) ?? [];
        return entries.some((prev) => this.similarity(prev, normalized) > 0.85);
    }
    normalize(text) {
        return text.toLowerCase().replace(/\s+/g, ' ').trim();
    }
    similarity(a, b) {
        if (a === b)
            return 1;
        const setA = new Set(a.split(' '));
        const setB = new Set(b.split(' '));
        const intersection = [...setA].filter((w) => setB.has(w)).length;
        const union = new Set([...setA, ...setB]).size;
        return union === 0 ? 0 : intersection / union;
    }
}
exports.AntiRepetitionEngine = AntiRepetitionEngine;
exports.antiRepetitionEngine = new AntiRepetitionEngine();
const memoryCache = new Map();
function memoryKey(userId, feature) {
    return `${userId}:${feature}`;
}
async function getAiContext(userId, feature) {
    const cached = memoryCache.get(memoryKey(userId, feature)) ?? [];
    try {
        const row = await prisma_1.prisma.aiMemory.findUnique({
            where: { userId_feature: { userId, feature } },
        });
        if (row?.last10Responses) {
            const parsed = row.last10Responses;
            return { lastResponses: parsed, contextJson: row.contextJson ?? {} };
        }
    }
    catch {
        // ignore
    }
    return { lastResponses: cached, contextJson: {} };
}
async function saveAiResponse(userId, feature, prompt, response) {
    const key = memoryKey(userId, feature);
    const list = memoryCache.get(key) ?? [];
    list.push(response);
    if (list.length > 10)
        list.shift();
    memoryCache.set(key, list);
    exports.antiRepetitionEngine.record(userId, response);
    try {
        await prisma_1.prisma.aiMemory.upsert({
            where: { userId_feature: { userId, feature } },
            create: {
                userId,
                feature,
                contextJson: { lastPrompt: prompt },
                last10Responses: list,
            },
            update: {
                contextJson: { lastPrompt: prompt },
                last10Responses: list,
            },
        });
        await prisma_1.prisma.aiLog.create({
            data: {
                userId,
                prompt: `[${feature}] ${prompt}`,
                response,
                model: 'gpt-4o',
                metadata: { feature },
            },
        });
    }
    catch {
        // DB optional in dev
    }
}
function jaccardSimilarity(a, b) {
    const setA = new Set(a.toLowerCase().split(/\s+/));
    const setB = new Set(b.toLowerCase().split(/\s+/));
    const intersection = [...setA].filter((w) => setB.has(w)).length;
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : intersection / union;
}
function isTooSimilar(candidate, prior) {
    return prior.some((p) => jaccardSimilarity(candidate, p) > 0.85);
}
function taskTemperature(task) {
    const temps = {
        caption: 0.95,
        twin: 0.88,
        digital_twin: 0.88,
        moderation: 0.3,
        spam_detection: 0.2,
        toxic_detection: 0.2,
        feed: 0.75,
    };
    return temps[task] ?? 0.8 + Math.random() * 0.3;
}
//# sourceMappingURL=anti-repetition.engine.js.map