"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCaption = generateCaption;
const openai_client_1 = require("./openai.client");
const anti_repetition_engine_1 = require("./anti-repetition.engine");
async function generateCaption(userId, context) {
    const openai = (0, openai_client_1.getOpenAI)();
    if (!openai)
        return 'VYRA moment — captured in the quantum stream.';
    const { lastResponses } = await (0, anti_repetition_engine_1.getAiContext)(userId, 'caption');
    const completion = await openai.chat.completions.create({
        model: openai_client_1.defaultModel,
        temperature: (0, anti_repetition_engine_1.taskTemperature)('caption'),
        messages: [
            {
                role: 'system',
                content: 'You are VYRA AI. Write unique, futuristic social captions. Never repeat phrasing. Avoid clichés.',
            },
            {
                role: 'user',
                content: `Context: ${context}\nAvoid similar to: ${lastResponses.join(' | ')}`,
            },
        ],
        max_tokens: 120,
    });
    let text = completion.choices[0]?.message?.content?.trim() ?? '';
    if ((0, anti_repetition_engine_1.isTooSimilar)(text, lastResponses)) {
        text = `${text} ✦`;
    }
    await (0, anti_repetition_engine_1.saveAiResponse)(userId, 'caption', context, text);
    return text;
}
//# sourceMappingURL=caption.generator.js.map