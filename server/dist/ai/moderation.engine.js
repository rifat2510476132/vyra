"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderateContent = moderateContent;
const openai_client_1 = require("./openai.client");
async function moderateContent(text) {
    const openai = (0, openai_client_1.getOpenAI)();
    if (!openai)
        return { safe: true };
    const completion = await openai.chat.completions.create({
        model: openai_client_1.defaultModel,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: 'Return JSON: {"safe":boolean,"reason":string}. Detect spam, harassment, misinformation.',
            },
            { role: 'user', content: text },
        ],
        max_tokens: 100,
    });
    try {
        const raw = completion.choices[0]?.message?.content ?? '{"safe":true}';
        return JSON.parse(raw);
    }
    catch {
        return { safe: true };
    }
}
//# sourceMappingURL=moderation.engine.js.map