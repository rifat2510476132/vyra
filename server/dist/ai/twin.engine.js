"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twinRespond = twinRespond;
const openai_client_1 = require("./openai.client");
const anti_repetition_engine_1 = require("./anti-repetition.engine");
async function twinRespond(userId, userMessage, personalityHint) {
    const openai = (0, openai_client_1.getOpenAI)();
    if (!openai) {
        return 'Your VYRA Twin is calibrating. I sense curiosity in your signal — tell me more.';
    }
    const { lastResponses, contextJson } = await (0, anti_repetition_engine_1.getAiContext)(userId, 'digital_twin');
    const completion = await openai.chat.completions.create({
        model: openai_client_1.defaultModel,
        temperature: (0, anti_repetition_engine_1.taskTemperature)('twin'),
        messages: [
            {
                role: 'system',
                content: `You are the user's VYRA Digital Twin in year 2125. Personality: ${personalityHint ?? 'warm, insightful'}. Memory: ${JSON.stringify(contextJson)}. Vary wording every reply.`,
            },
            { role: 'user', content: userMessage },
            ...lastResponses.slice(0, 3).map((r) => ({ role: 'assistant', content: r })),
        ],
        max_tokens: 300,
    });
    const text = completion.choices[0]?.message?.content?.trim() ??
        'Signal received. Your twin is weaving a response across the nebula.';
    await (0, anti_repetition_engine_1.saveAiResponse)(userId, 'digital_twin', userMessage, text);
    return text;
}
//# sourceMappingURL=twin.engine.js.map