"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter = null;
function getTransporter() {
    if (transporter)
        return transporter;
    const host = process.env.SMTP_HOST;
    if (!host)
        return null;
    transporter = nodemailer_1.default.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT ?? '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? '' }
            : undefined,
    });
    return transporter;
}
async function sendEmail(to, subject, text) {
    const from = process.env.SMTP_FROM ?? 'noreply@vyra.app';
    const transport = getTransporter();
    if (!transport) {
        console.info(`[VYRA Email — dev]\nTo: ${to}\nSubject: ${subject}\n\n${text}\n`);
        return;
    }
    await transport.sendMail({ from, to, subject, text });
}
//# sourceMappingURL=email.util.js.map