"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiHubController = void 0;
const response_util_1 = require("../utils/response.util");
const vyra_2125_engine_1 = require("../ai/vyra-2125.engine");
const CAPABILITY_IDS = new Set((0, vyra_2125_engine_1.list2125Capabilities)().map((c) => c.id));
exports.aiHubController = {
    manifest(_req, res) {
        return (0, response_util_1.success)(res, {
            name: 'VYRA Neural Hub',
            era: 2125,
            antiRepetition: true,
            capabilities: (0, vyra_2125_engine_1.list2125Capabilities)(),
        });
    },
    async invoke(req, res) {
        const capability = String(req.body.capability ?? '');
        if (!CAPABILITY_IDS.has(capability)) {
            return (0, response_util_1.fail)(res, `Unknown capability: ${capability}`, 400);
        }
        const result = await (0, vyra_2125_engine_1.invoke2125)(req.user.userId, capability, {
            text: req.body.text ? String(req.body.text) : undefined,
            mood: req.body.mood ? String(req.body.mood) : undefined,
            context: req.body.context,
        });
        return (0, response_util_1.success)(res, result);
    },
    async bundle(req, res) {
        const text = String(req.body.text ?? '');
        const mood = req.body.mood ? String(req.body.mood) : undefined;
        const userId = req.user.userId;
        const [digest, moodOracle, intent] = await Promise.all([
            (0, vyra_2125_engine_1.invoke2125)(userId, 'twin_digest', { text, mood }),
            (0, vyra_2125_engine_1.invoke2125)(userId, 'mood_oracle', { text, mood }),
            (0, vyra_2125_engine_1.invoke2125)(userId, 'intent_engine', { text, mood }),
        ]);
        return (0, response_util_1.success)(res, { digest, moodOracle, intent });
    },
};
//# sourceMappingURL=ai-hub.controller.js.map