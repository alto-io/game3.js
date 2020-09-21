const express = require('express');
const route = express.Router();
import { GlobalState } from '@game3js/common';


/*
* method: POST
* access: LOGGED IN ONLY 
* desc: retrieves gameSessionId
*/
route.post('/put', async (req: any, res: any) => {
  const result = await GlobalState.ServerState.dbManager.serverPutGameReplay(req.body);
  res.json(result);
});

module.exports = route;