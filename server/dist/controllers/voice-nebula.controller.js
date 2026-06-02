"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceNebulaController = void 0;
const response_util_1 = require("../utils/response.util");
const voice_nebula_service_1 = require("../ai/voice-nebula.service");
exports.voiceNebulaController = {
    async converse(req, res) {
        const transcript = String(req.body.transcript ?? req.body.text ?? '').trim();
        if (!transcript)
            return (0, response_util_1.fail)(res, 'transcript required');
        const voice = req.body.voice ?? 'nova';
        const mood = req.body.mood ? String(req.body.mood) : undefined;
        const result = await (0, voice_nebula_service_1.processVoiceNebula)(req.user.userId, transcript, { mood, voice });
        return (0, response_util_1.success)(res, result);
    },
    async status(_req, res) {
        return (0, response_util_1.success)(res, {
            name: 'Voice Nebula',
            stt: 'device', // Flutter speech_to_text
            tts: 'device_or_openai',
            voices: ['nova', 'shimmer', 'echo', 'alloy'],
            era: 2125,
        });
    },
};
//# sourceMappingURL=voice-nebula.controller.js.map