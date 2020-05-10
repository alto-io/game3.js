import { monitor } from '@colyseus/monitor';
import { Constants , Database, GameRoom } from '@game3js/common';
import { Server } from 'colyseus';
import * as cors from 'cors';
import * as express from 'express';
import { createServer } from 'http';
import * as basicAuth from "express-basic-auth";

import { join } from 'path';

const basicAuthMiddleware = basicAuth({
    // list of users and passwords
    users: {
        "admin": "admin",
    },
    // sends WWW-Authenticate header, which will prompt the user to fill
    // credentials in
    challenge: true
});

const PORT = Number(process.env.PORT || Constants.WS_PORT);

const app = express();
app.use(cors());
app.use(express.json());

// Game server
const server = new Server({
  server: createServer(app),
  express: app,
});

let dbManager = null

async function initializeDatabase() {
  dbManager = new Database.OrbitDBManager();
  await dbManager.start();
  await dbManager.initializeServerData();
}

initializeDatabase();

// Game Rooms
server.define(Constants.ROOM_NAME, GameRoom.ShooterGameRoom);

// Serve static resources from the "public" folder
app.use(express.static(join(__dirname, 'public')));

// If you don't want people accessing your server stats, comment this line.
app.use("/colyseus", basicAuthMiddleware, monitor());

app.post('/profile', async (req: any, res: any) => {
  const result = await dbManager.savePlayerProfile(req.body);
  res.json(result);
});

app.get('/profile', async (req: any, res: any) => {
  const result = await dbManager.getDBPlayerProfile(req.query.walletid);
  res.json(result);
});

app.get('/leaderboard', async (req: any, res: any) => {
  const result = await dbManager.getLeaderboard();
  res.json(result);
});

// Serve the frontend client
app.get('*', (req: any, res: any) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

server.onShutdown(() => {
  console.log(`Shutting down...`);
});

server.listen(PORT);
console.log(`Listening on ws://localhost:${PORT}`);
