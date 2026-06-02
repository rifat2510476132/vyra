"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVoiceNebula = processVoiceNebula;
const openai_client_1 = require("./openai.client");
const vyra_2125_engine_1 = require("./vyra-2125.engine");
const env_1 = require("../config/env");
function toSpeechLines(text) {
    return text
        .replace(/\n+/g, ' … ')
        .replace(/\s+/g, ' ')
        .trim();
}
async function processVoiceNebula(userId, transcript, options) {
    const clean = transcript.trim();
    if (!clean) {
        return {
            transcript: '',
            reply: 'I am listening across the nebula. Speak when you are ready.',
            replyForSpeech: 'I am listening across the nebula. Speak when you are ready.',
            poweredBy: 'vyra_neural_fallback',
        };
    }
    const result = await (0, vyra_2125_engine_1.invoke2125)(userId, 'voice_nebula', {
        text: clean,
        mood: options?.mood,
        context: { channel: 'voice_nebula' },
    });
    const replyForSpeech = toSpeechLines(result.output);
    let audioBase64;
    let poweredBy = result.poweredBy;
    if (env_1.env.openai.apiKey) {
        try {
            const openai = (0, openai_client_1.getOpenAIClient)();
            const speech = await openai.audio.speech.create({
                model: 'tts-1',
                voice: options?.voice ?? 'nova',
                input: replyForSpeech.slice(0, 4096),
                response_format: 'mp3',
            });
            const buf = Buffer.from(await speech.arrayBuffer());
            audioBase64 = buf.toString('base64');
            poweredBy = 'openai_voice';
        }
        catch {
            // Client will use flutter_tts fallback
        }
    }
    return {
        transcript: clean,
        reply: result.output,
        replyForSpeech,
        mood: options?.mood,
        energySignature: result.energySignature,
        poweredBy,
        audioBase64,
        audioMimeType: audioBase64 ? 'audio/mpeg' : undefined,
    };
}
//# sourceMappingURL=voice-nebula.service.js.map