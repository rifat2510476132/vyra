"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIo = setIo;
exports.getIo = getIo;
let io = null;
function setIo(server) {
    io = server;
}
function getIo() {
    return io;
}
//# sourceMappingURL=io-holder.js.map