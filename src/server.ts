import http from 'http';
import { config } from 'dotenv';
import userRouter from './modules/user.router.js';

config();

const requestListener: http.RequestListener = (req, res) => {
  userRouter(req, res);
};

const server = http.createServer(requestListener);

const port = Number(process.env.PORT) ?? 3000;
const host = process.env.HOST || 'localhost';
const backlog = Number(process.env.BACKLOG) || 100;

server.listen(port, host, backlog, () => {
  console.log(`Server running on ${host}:${port}`);
});
