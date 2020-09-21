import { monitor } from '@colyseus/monitor';
import { 
  Constants,
  Database,
  GameRoom,
  GlobalState
} from '@game3js/common';

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
const colyseusServer = new Server({
  server: createServer(app),
  express: app,
});

async function initializeDatabase() {
  GlobalState.ServerState.dbManager = new Database.OrbitDBManager();
  await GlobalState.ServerState.dbManager.start();
/*
  console.log(await GlobalState.ServerState.dbManager.node.bootstrap.list());
  console.log(await GlobalState.ServerState.dbManager.node.id());
  console.log(await GlobalState.ServerState.dbManager.node.swarm.peers());
*/
}

initializeDatabase();

// Game Rooms
colyseusServer.define(Constants.ROOM_NAME, GameRoom.ShooterGameRoom);

// If you don't want people accessing your server stats, comment this line.
app.use("/colyseus", basicAuthMiddleware, monitor());

// Serve static resources from the "public" folder
app.use(express.static(join(__dirname, 'public')));

// TODO: only organizer must be able to put info
app.get('/tournament/results', async (req: any, res: any) => {
  const tournamentId = req.query.tournamentId;

  const result = await GlobalState.ServerState.dbManager.getTournamentResult(tournamentId);
  res.json(result);
})

// ROUTES
app.use('/tournaments', require('./routes/tournaments/tournament.routes'));
app.use('/gameSession', require('./routes/game_sessions/gameSessions.routes'));
app.use('/gameSessionId', require('./routes/game_sessions/gameSessionIds.routes'));
app.use('/gameReplay', require('./routes/replay/replay.routes'));

// Serve the frontend client
app.get('*', (req: any, res: any) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

colyseusServer.onShutdown(() => {
  console.log(`Shutting down...`);
});

colyseusServer.listen(PORT);

console.log(`Listening on ws://localhost:${PORT}`);

// delete all data in db to reset
// GlobalState.ServerState.dbManager.deleteAllData()