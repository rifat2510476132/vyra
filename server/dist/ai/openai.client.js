"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultModel = void 0;
exports.getOpenAIClient = getOpenAIClient;
exports.chatCompletion = chatCompletion;
exports.getOpenAI = getOpenAI;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../config/env");
let client = null;
exports.defaultModel = process.env.OPENAI_MODEL ?? 'gpt-4o';
function getOpenAIClient() {
    if (!client) {
        if (!env_1.env.openai.apiKey) {
            throw new Error('OPENAI_API_KEY is not configured');
        }
        client = new openai_1.default({ apiKey: env_1.env.openai.apiKey });
    }
    return client;
}
async function chatCompletion(messages, options) {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
        model: options?.model ?? 'gpt-4o-mini',
        messages,
        max_tokens: options?.maxTokens ?? 1024,
        temperature: options?.temperature ?? 0.7,
    });
    return response.choices[0]?.message?.content ?? '';
}
/** Nullable client when API key is not configured (dev fallback). */
function getOpenAI() {
    try {
        return getOpenAIClient();
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=openai.client.js.map