import http from 'http';
import app from './app';
import { createSocketServer } from './socket/socket.server';
import { setIo } from './socket/io-holder';

const port = parseInt(process.env.PORT ?? '5000', 10);

const httpServer = http.createServer(app);
const io = createSocketServer(httpServer);
setIo(io);

httpServer.listen(port, () => {
  console.log(`VYRA server listening on port ${port}`);
});
