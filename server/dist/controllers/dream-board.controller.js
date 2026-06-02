"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dreamBoardController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
const vyra_ai_service_1 = require("../services/vyra-ai.service");
exports.dreamBoardController = {
    async list(req, res) {
        const boards = await prisma_1.prisma.dreamBoard.findMany({
            where: { userId: req.user.userId, deletedAt: null },
            orderBy: { updatedAt: 'desc' },
        });
        return (0, response_util_1.success)(res, boards);
    },
    async create(req, res) {
        const goalText = String(req.body.goalText ?? req.body.title ?? '');
        if (!goalText)
            return (0, response_util_1.fail)(res, 'goalText required');
        const journey = await vyra_ai_service_1.vyraAiService.lifeOrganizer(req.user.userId, goalText);
        const board = await prisma_1.prisma.dreamBoard.create({
            data: {
                userId: req.user.userId,
                title: String(req.body.title ?? goalText.slice(0, 80)),
                goalText,
                aiJourneyJson: { map: journey },
            },
        });
        return (0, response_util_1.success)(res, board, 201);
    },
    async updateProgress(req, res) {
        const id = String(req.params.id);
        const progress = Number(req.body.progress ?? 0);
        const board = await prisma_1.prisma.dreamBoard.update({
            where: { id, userId: req.user.userId },
            data: { progress },
        });
        return (0, response_util_1.success)(res, board);
    },
};
//# sourceMappingURL=dream-board.controller.js.map