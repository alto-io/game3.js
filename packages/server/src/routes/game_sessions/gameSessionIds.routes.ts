const express = require('express');
const route = express.Router();
import { GlobalState } from '@game3js/common';


/*
* method: GET
* access: PUBLIC 
* desc: retrieves gameSessionId
*/
route.get('/get', async (req: any, res: any) => {
  const playerAddress = req.query.playerAddress
  const tournamentId = req.query.tournamentId

  const result = await GlobalState.ServerState.dbManager
    .getGameSessionId(playerAddress, tournamentId);
  res.json(result);
});


/*
* method: POST
* access: LOGGED IN ONLY 
* desc: creates new gameSessionId
*/
route.post('/new', async (req: any, res: any) => {
  const playerAddress = req.body.playerAddress;
  const tournamentId = req.body.tournamentId;

  console.log("SERVER: player_add", playerAddress)
  console.log("SERVER: tournamentId", tournamentId)

  const result = await GlobalState.ServerState.dbManager
    .serverCreateSessionId(playerAddress, tournamentId);
  res.json(result);
});


/*
* method: POST
* access: LOGGED IN ONLY 
* desc: deletes gameSessionId
* note: this is not yet used and tested
*/
route.delete('/delete', async (req: any, res: any) => {
  const gameSessionId = req.query.gameSessionId

  const result = await GlobalState.ServerState.dbManager
    .deleteSessionId(gameSessionId);
  res.json(result);
});

module.exports = route;