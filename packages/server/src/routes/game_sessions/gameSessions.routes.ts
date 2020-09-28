const express = require('express');
const route = express.Router();
import { GlobalState } from '@game3js/common';

/*
* method: GET
* access: PUBLIC 
* desc: retrieves gameSession
*/
route.get('/get', async (req, res) => {
  const sessionId = req.query.sessionId
  const playerAddress = req.query.playerAddress
  const tournamentId = req.query.tournamentId

  console.log("Server GET tournamentId: " + tournamentId +" : -- sessionId is", sessionId);

  const result = await GlobalState.ServerState.dbManager
    .serverGetGameSession(sessionId, playerAddress, tournamentId);
  res.json(result);
});


/*
* method: GET
* access: PUBLIC 
* desc: retrieves current gameNo for the specific gameSession
*/
route.get('/gameno', async (req, res) => {
  const sessionId = req.query.sessionId
  const playerAddress = req.query.playerAddress
  const tournamentId = req.query.tournamentId

  console.log("Server GET tournamentId: " + tournamentId +" : -- sessionId is", sessionId);

  const result = await GlobalState.ServerState.dbManager
    .getGameNo(sessionId, playerAddress, tournamentId);
  
  res.json(result);
});


/*
* method: POST
* access: LOGGED IN ONLY 
* desc: updates score from the specific gameSession
*/
route.post('/updatescore', async (req, res) => {
  const {sessionId, playerAddress, tournamentId, gamePayload} = req.body;

  console.log("Server POST sessionId is", sessionId);
  console.log("Server POST tournamentId is", tournamentId);
  console.log("Server POST playerAddress is", playerAddress);
  console.log("Server POST gamePayload is", gamePayload);

  let result;

  result = await GlobalState.ServerState.dbManager
      .serverUpdateScore(sessionId, playerAddress, tournamentId, gamePayload);
  res.json(result);
});


/*
* method: POST
* access: LOGGED IN ONLY 
* desc: updates gameNo from the specific gameSession
*/
route.post('/updategameno', async (req, res) => {
  const sessionId = req.body.sessionId;
  const playerAddress = req.body.playerAddress;
  const tournamentId = req.body.tournamentId;

  console.log("Server POST sessionId is", sessionId);
  console.log("Server POST playerAddress is", playerAddress);
  console.log("Server POST tournamentId is", tournamentId);

  const result = await GlobalState.ServerState.dbManager
    .updateGameNumber(sessionId, playerAddress, tournamentId);
  
  res.json(result);
});


/*
* method: POST
* access: LOGGED IN ONLY 
* desc: creates new gameSession
*/
route.post('/new', async (req, res) => {
  const {gameName, sessionId, tournamentId, gamePayload} = req.body;

  const result = await GlobalState.ServerState.dbManager
    .makeNewGameSession(gameName, sessionId, tournamentId, gamePayload);
  
  res.json(result);
});


module.exports = route;