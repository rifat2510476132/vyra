"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.realityBoardController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.realityBoardController = {
    async list(req, res) {
        const boards = await prisma_1.prisma.realityBoard.findMany({
            where: {
                deletedAt: null,
                OR: [{ userId: req.user.userId }, { isPublic: true }],
            },
            orderBy: { updatedAt: 'desc' },
        });
        return (0, response_util_1.success)(res, boards);
    },
    async create(req, res) {
        const title = String(req.body.title ?? '').trim();
        const visionText = String(req.body.visionText ?? req.body.vision ?? '').trim();
        if (!title || !visionText)
            return (0, response_util_1.fail)(res, 'title and visionText required', 400);
        const board = await prisma_1.prisma.realityBoard.create({
            data: {
                userId: req.user.userId,
                title,
                visionText,
                pillarsJson: req.body.pillars ?? req.body.pillarsJson ?? [],
                isPublic: Boolean(req.body.isPublic),
            },
        });
        return (0, response_util_1.success)(res, board, 201);
    },
    async update(req, res) {
        const id = String(req.params.id);
        const board = await prisma_1.prisma.realityBoard.updateMany({
            where: { id, userId: req.user.userId },
            data: {
                title: req.body.title,
                visionText: req.body.visionText,
                pillarsJson: req.body.pillars ?? req.body.pillarsJson,
                isPublic: req.body.isPublic,
            },
        });
        return (0, response_util_1.success)(res, { updated: board.count });
    },
};
//# sourceMappingURL=reality-board.controller.js.map