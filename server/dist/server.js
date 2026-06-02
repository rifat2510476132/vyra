"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const socket_server_1 = require("./socket/socket.server");
const io_holder_1 = require("./socket/io-holder");
const port = parseInt(process.env.PORT ?? '5000', 10);
const httpServer = http_1.default.createServer(app_1.default);
const io = (0, socket_server_1.createSocketServer)(httpServer);
(0, io_holder_1.setIo)(io);
httpServer.listen(port, () => {
    console.log(`VYRA server listening on port ${port}`);
});
//# sourceMappingURL=server.js.map