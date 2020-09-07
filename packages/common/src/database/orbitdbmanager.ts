import * as IPFS from 'ipfs'
const OrbitDB = require('orbit-db')
import { PlayerProfile } from './playerprofile'
import { GuestConfig } from './guestconfig'
import { DBManager } from './dbmanager'
import { LeaderboardEntry } from './leaderboardentry'
import { TournamentData } from './tournamentdata'
import { v4 as uuidv4 } from 'uuid'

const all = require('it-all')
const { Buffer } = IPFS

export class OrbitDBManager implements DBManager {

  REPO = './ipfs'

  node: any = null
  orbitdb: any = null
  defaultOptions: any = null;

  //db tables
  guest: any = null;
  leaderboardEntries: any = null;
  user: any = null
  tournaments: any = null
  tournamentResults: any = null
  gameSessions: any = null
  gameSessionIds: any = null

  defaultServerOptions = {
    relay: { enabled: true, hop: { enabled: true, active: true } },
    EXPERIMENTAL: { pubsub: true },
    repo: this.REPO,
    preload: { enabled: false },
    config: {
      Addresses: {
        Swarm: [
          '/ip4/0.0.0.0/tcp/4002',
          // '/ip4/127.0.0.1/tcp/4003/ws',
          // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
          // '/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star'
          '/dns4/opg-signal.herokuapp.com/tcp/443/wss/p2p-webrtc-star'
        ]
      }
    }
  }

  // we have to pass in the IPFS node differently from client or server
  // due to how web workers work. might revisit when there's a more
  // isomorphic solution
  async start(ipfsNode?) {

    this.node = ipfsNode;
    if (!this.node) {
      this.node = await IPFS.create(this.defaultServerOptions)
    }

    this.orbitdb = await OrbitDB.createInstance(this.node)
    this.defaultOptions = { accessController: { write: [this.orbitdb.identity.id] } }

    await this.initializeData();

  }

  async loadFixtureData(fixtureData: any) {
    const fixtureKeys = Object.keys(fixtureData)
    for (let i in fixtureKeys) {
      let key = fixtureKeys[i]
      if (!this.user.get(key))
        await this.user.set(key, fixtureData[key]);
    }
  }

  async initializeData() {

    const docStoreOptions = {
      ...this.defaultOptions,
      indexBy: 'id',
    }

    this.guest = await this.orbitdb.kvstore('guest', this.defaultOptions)
    await this.guest.load()

    this.user = await this.orbitdb.kvstore('user', this.defaultOptions)
    await this.user.load()

    this.leaderboardEntries = await this.orbitdb.docstore('leaderboardEntries', docStoreOptions);
    await this.leaderboardEntries.load()

    this.tournaments = await this.orbitdb.docstore('tournaments', docStoreOptions);
    await this.tournaments.load()

    this.gameSessions = await this.orbitdb.docstore('gameSessions', docStoreOptions);
    await this.gameSessions.load()

    this.gameSessionIds = await this.orbitdb.docstore('gameSessionIds', docStoreOptions);
    await this.gameSessionIds.load();
  }

  async refreshClientData() {
    await this.leaderboardEntries.load()
  }

  async refreshLeaderboard() {
    if (this.leaderboardEntries) {
      return await this.leaderboardEntries.query((doc) => doc.id != null);
    }
    else return null;
  }

  async initializeServerData() {
    const docStoreOptions = {
      ...this.defaultOptions,
      indexBy: 'id',
    }
    this.user = await this.orbitdb.kvstore('user', this.defaultOptions)
    this.tournaments = await this.orbitdb.docstore('tournaments', docStoreOptions)
    this.tournamentResults = await this.orbitdb.docstore('tournamentResults', docStoreOptions)
    this.gameSessions = await this.orbitdb.docstore('gameSessions', docStoreOptions)
    this.gameSessionIds = await this.orbitdb.docstore('gameSessionIds', docStoreOptions)
    await this.user.load()
  }

  async getPlayerProfile(walletid) {
    const playerProfile = await this.user.get(walletid)
    return playerProfile
  }

  async getLeaderboard() {

    const lb = await this.user.all

    return lb
  }

  async savePlayerProfile(playerProfile: PlayerProfile) {

    const id = playerProfile.walletid;
    delete playerProfile.walletid;

    const result = await this.user.set(id, playerProfile)
    const savedUser = await this.user.get(id)

    return savedUser
  }

  async getTournamentData(tournamentId: any) {
    const data = await this.user.get(tournamentId)
    return data
  }

  async putTournamentData(tournamentData: TournamentData) {
    const id = tournamentData.id
    const result = await this.user.set(id, tournamentData)
    return result
  }

  async getGuestConfig(callback?) {
    const guestAccount = await this.guest.all;

    if (Object.keys(guestAccount).length === 0 && guestAccount.constructor === Object)
      callback(null)
    else
      callback(guestAccount)
  }

  async saveGuestConfig(guestConfig: GuestConfig) {
    this.guest.set("id", guestConfig.id)
  }

  async localSaveReplay(playerId: string, tournamentId: string, time: number, file: File) {

    console.log(file);

    for await (const saveResult of this.node.add({
      path: file.name,
      content: file
    })) {
      const hash = saveResult.cid.string;
      const entry: LeaderboardEntry = {
        id: file.name,
        tournamentId,
        time,
        hash,
      }
      await this.leaderboardEntries.put(entry);
    }
  }

  async getFileFromHash(hash: string) {

    let result;

    result = null;

    for await (const file of this.node.get(hash)) {

      console.log(file)

      if (file.content) {
        const content = Buffer.concat(await all(file.content))
        result = new File([content], hash + ".webm", { type: 'video/webm' })
      }
    }

    console.log(result);

    return result;
  }

  async clientSaveTournamentReplay(file: File) {
    console.log(file);
    for await (const saveResult of this.node.add({
      path: file.name,
      content: file
    })) {
      return saveResult.cid.string
    }
  }

  async serverPutGameReplay(requestBody) {
    console.log('serverPutGameReplay')
    const { sessionId, playerAddress, fileHash } = requestBody

    const entries = await this.gameSessions.get(sessionId)
    if (entries.length === 0) {
      return
    }
    const entry = entries[0]
    const playerData = entries[0].sessionData.playerData[playerAddress]
    if (!playerData) {
      return
    }
    playerData.replayHash = fileHash
    console.log(entry)
    await this.gameSessions.put(entry)
    return { result: sessionId }
  }

  async serverPutGameSession(sessionId, sessionData) {
    console.log("PUT_GSESSION: Function Invoked...");
    const entry = {
      id: sessionId,
      sessionData,
    }
    console.log("PUT_GSESSION: The new data...");
    console.log(entry)
    await this.gameSessions.put(entry)
    console.log("PUT_GSESSION: Data inserted!...");
    console.log("PUT_GSESSION: Returning...");
    return { result: sessionId }
  }

  async serverUpdateScore(didWin, sessionId, playerAddress, tournamentId, timeFinished) {

    // As of now, the scoring mechanism depends on the shortest time you win the game.
    // Sooner, we'll support several scoring mechanism.

    if (tournamentId !== undefined) {
      console.log("UPDATE_SCORE: Function Invoked...");

      const data = await this.gameSessions.query(data =>
        data.id === sessionId && data.sessionData.tournamentId === tournamentId
      );
      console.log("UPDATE_SCORE: Fetched data", data);
      let playerData = null
      if (data.length > 0) {
        console.log("UPDATE_SCORE: Session Exist!");
        playerData = data[0].sessionData.playerData[playerAddress.toLowerCase()]
        console.log("UPDATE_SCORE: Session id", sessionId);
        console.log("UPDATE_SCORE: Session", data[0]);
        console.log("UPDATE_SCORE: Session data", data[0].sessionData);
        console.log("UPDATE_SCORE: Player data", playerData);
        console.log("UPDATE_SCORE: Update score...", playerData);
        let playerScore = Math.abs(playerData.timeLeft - timeFinished);
        console.log("UPDATE_SCORE: Current High Score (shortest time)", playerData.currentHighestNumber);
        console.log("UPDATE_SCORE: Current Score", playerScore);
        console.log("UPDATE_SCORE: Did win?", didWin);

        if (!didWin) {
          console.log("UPDATE_SCORE: Player did not win");
          console.log("UPDATE_SCORE: Player score reverts to 0");
        } else {
          console.log("UPDATE_SCORE: Player did win");

          playerData.timeLeft = playerScore;

          if (playerScore < (playerData.currentHighestNumber === 0 ? playerScore + 1 : playerData.currentHighestNumber)) {
            playerData.currentHighestNumber = playerScore;
            console.log("UPDATE_SCORE: Thew new data", playerData);
            data[0].sessionData.playerData[playerAddress.toLowerCase()] = playerData;
            await this.gameSessions.put(data[0]);
            console.log("UPDATE_SCORE: Updated!");
            console.log("UPDATE_SCORE: Returning...");
            return { result: playerData }
          } else {
            console.log("UPDATE_SCORE: Current score is lower than highscore, no need to update!");
            console.log("UPDATE_SCORE: Returning...");
            return { result: playerData }
          }
        }
      } else {
        console.log("UPDATE_SCORE: No Data...");
        console.log("UPDATE_SCORE: Returning...");
        return { result: 'none' }
      }
    } else {
      console.log("UPDATE_SCORE: You're not in a tournament");
      console.log("UPDATE_SCORE: Returning...");
      return false;
    }
  }

  async updateGameNumber(sessionId, playerAddress, tournamentId) {
    console.log("UPDATE_GNUMBER: Initializing...");
    if (tournamentId !== undefined) {

      // Get session first
      const data = await this.gameSessions.query(data =>
        data.id === sessionId && data.sessionData.tournamentId === tournamentId
      );
      if (data.length > 0) {
        let playerData = data[0].sessionData.playerData[playerAddress.toLowerCase()]
        console.log("UPDATE_GNUMBER: Updating...");
        console.log("UPDATE_GNUMBER: Playerdata", playerData);
        playerData.gameNo += 1;
        data[0].sessionData.playerData[playerAddress.toLowerCase()] = playerData;
        await this.gameSessions.put(data[0]);
        console.log("UPDATE_GNUMBER: Updated!!");
        console.log("UPDATE_GNUMBER: Returning...");
        return { result: playerData }
      } else {
        console.log("UPDATE_GNUMBER: No data");
        console.log("UPDATE_GNUMBER: Returning...");
        return { result: 'none' }
      }
    } else {
      console.log("UPDATE_GNUMBER: You're not in a tournament");
      console.log("UPDATE_GNUMBER: Returning...");
      return false;
    }
  }

  // called from colyseus game state
  async makeNewGameSession(sessionId, tournamentId, timeLeft, players) {
    if (tournamentId !== undefined) {
      console.log("NEW: Function Invoked...");
      const sessionData = {
        sessionId,
        tournamentId,
        playerData: {}
      }

      // Check if this user already have a session available
      const data = await this.gameSessions.query(data =>
        data.id === sessionId && data.sessionData.tournamentId === tournamentId
      );
      console.log("NEW: fetched session data", data);
      if (data.length <= 0) {
        // No data create new
        console.log("NEW: NO SESSION DATA EXIST");
        console.log("NEW: Adding player in session...");

        for (const playerId in players) {
          const player = players[playerId]

          console.log("NEW: Player name", player.name)

          const playerData = {
            name: player.name,
            kills: player.kills,
            timeLeft: timeLeft,
            gameNo: 0,
            currentHighestNumber: 0
          }

          console.log("NEW: Player address", player.address)
          console.log("NEW: Player", player)

          sessionData.playerData[player.address.toLowerCase()] = playerData;
        }

        console.log("NEW: Players added!!");

        console.log("NEW: Adding new session data to db...", sessionData);
        await this.serverPutGameSession(sessionId, sessionData);
        console.log("NEW: Session Data created!!!");
        console.log("NEW: Function Finished...");
      } else {
        console.log("NEW: Session Exist!!");
        console.log("NEW: Updating playerData...")

        // if (tournamentId !== data[0].tournamentId) {
        //   console.log("NEW: No tournament record");
        //   console.log("NEW: Making new one...");
        // }

        for (const playerId in players) {
          const player = players[playerId]
          console.log("NEW: Before", data[0].sessionData.playerData[player.address.toLowerCase()])
          data[0].sessionData.playerData[player.address.toLowerCase()].name = player.name;
          data[0].sessionData.playerData[player.address.toLowerCase()].kills = player.kills;
          data[0].sessionData.playerData[player.address.toLowerCase()].timeLeft = timeLeft;
          console.log("NEW: After", data[0].sessionData.playerData[player.address.toLowerCase()])
        }
        await this.gameSessions.put(data[0]);
        console.log("NEW: Updated!");
        console.log("NEW: Finished...");
      }
    } else {
      console.log("NEW: You're not in a tournament");
      console.log("NEW: Returning...");
      return false;
    }
  }

  async serverGetGameSession(sessionId, playerAddress, tournamentId) {
    if (tournamentId !== undefined) {
      console.log("GET_GSESSION: Function Invoked...");
      console.log(`GET_GSESSION: sessionId: ${sessionId}`)
      console.log(`GET_GSESSION: playerAddress: ${playerAddress}`)

      if (!sessionId || !playerAddress) {
        console.log("GET_GSESSION: NO sessionId or playerAddress...");
        console.log("GET_GSESSION: Returning...");
        return null
      }

      const data = await this.gameSessions.query(data =>
        data.id === sessionId && data.sessionData.tournamentId === tournamentId
      );
      let playerData = null
      if (data.length > 0) {
        console.log("GET_GSESSION: Data exist!!");

        playerData = data[0].sessionData.playerData[playerAddress.toLowerCase()]
        console.log("GET: PLAYER DATA", playerData);
        if (!('currentHighestNumber' in playerData) && !('gameNo' in playerData)) {
          playerData.currentHighestNumber = 0;
          playerData.gameNo = 0;
        }

        console.log(playerData);
        console.log("GET_GSESSION: Returning...");
        return playerData
      } else {
        console.log("GET_GSESSION: No Data");
        console.log("GET_GSESSION: Returning...");
        return { result: 'none' }
      }
    } else {
      console.log("GET_GSESSION: You're not in a tournament");
      console.log("GET_GSESSION: Returning...");
      return false;
    }
  }

  async getGameNo(gameSessionId, playerAddress, tournamentId) {
    if (tournamentId !== undefined) {
      // get game session first

      const data = await this.gameSessions.query(data =>
        data.id === gameSessionId && data.sessionData.tournamentId === tournamentId
      );
      if (data.length > 0) {
        let playerData = data[0].sessionData.playerData[playerAddress.toLowerCase()];
        return playerData.gameNo;
      } else {
        return { result: 'none' }
      }
    } else {
      console.log("GET_GAMENO: You're not in a tournament");
      console.log("GET_GAMENO: Returning...");
      return false;
    }
  }

  async serverCreateSessionId(playerAddress, tournamentId) {
    console.log("SID: Tournament ID", tournamentId);
    if (tournamentId !== undefined) {
      console.log("CREATE_SID: Initializing...")
      console.log(`CREATE_SID: Params playerAddress: ${playerAddress}, tournamentId: ${tournamentId}`)
      // Check if this player already have a sessionId
      let data = await this.gameSessionIds.query(sessionId =>
        sessionId.playerAddress === playerAddress.toLowerCase() && sessionId.tournamentId === tournamentId)
      if (data.length > 0) {
        console.log("SID: DATA FOUND!", data);
        console.log("SID: Returning...", data[0].id);
        return data[0].id;
      } else {
        console.log("SID: DATA NOT FOUND!", data);
        console.log("SID: Creating new one...");
        let sessionId = uuidv4();
        let sessionIdData = {
          id: sessionId,
          tournamentId,
          playerAddress: playerAddress.toLowerCase()
        }
        console.log("SID: Created!!", sessionIdData);
        console.log("SID: Saving to database...");
        await this.gameSessionIds.put(sessionIdData);
        console.log("SID: Saved!");
        console.log("SID: Returning...");
        return sessionId;
      }
    } else {
      console.log("SID: You're not in a tournament");
      console.log("SID: Returning...");
      return false;
    }
  }

  async getGameSessionId(playerAddress, tournamentId) {
    if (tournamentId !== undefined) {
      let data = await this.gameSessionIds.query(sessionId =>
        sessionId.playerAddress === playerAddress.toLowerCase() && sessionId.tournamentId === tournamentId)
      if (data.length > 0) {
        return data[0].id
      } else {
        return null
      }
    } else {
      console.log("GET_SID: You're not in a tournament");
      console.log("GET_SID: Returning...");
      return false;
    }
  }

  async getTournamentResult(tournamentId) {
    console.log("GET_TOURNEYRESULT: Initialize...");
    console.log("GET_TOURNEYRESULT: Fetching sessions...");
    let sessions = this.gameSessions.query(g_session =>
      g_session.sessionData.tournamentId === tournamentId
    )
    if (sessions.length > 0) {
      console.log("GET_TOURNEYRESULT: Sample playerData", sessions[0].sessionData.playerData);
      console.log("GET_TOURNEYRESULT: Sessions fetched!", sessions);
      console.log("GET_TOURNEYRESULT: Returning...", sessions);
      return sessions;
    } else {
      console.log("GET_TOURNEYRESULT: No data");
      console.log("GET_TOURNEYRESULT: Returning...", sessions);
      return sessions;
    }
  }

  async deleteSessionId(sessionId) {
    await this.gameSessionIds.del(sessionId);
  }

  async deleteAllData() {
    // await this.orbitdb.drop('')
  }

  async newTournament(tournament) {
    // TOURNAMENT FORMAT
    // const tournament = {
    //   id: string
    //   endTime: string,
    //   state: string,
    //   pool: number,
    //   data: string,
    //   shares: string[]
    // }

    console.log("CREATE_TOURNEY: Initiating...");
    let ids = await this.tournaments.query(tournament =>
      tournament.id > -1);

    console.log("CREATE_TOURNEY: The ids", ids);

    if (ids.length > 0) {
      if (tournament !== ids[ids.length - 1].id) {
        console.log("CREATE_TOURNEY: Creating new one...");
        await this.tournaments.put(tournament)
        console.log("CREATE_TOURNEY: Added");
      } else {
        console.log("CREATE_TOURNEY: Id already exist");
      }
    } else {
      console.log("CREATE_TOURNEY: No tournaments");
      console.log("CREATE_TOURNEY: Creating new one...");
      await this.tournaments.put(tournament)
      console.log("CREATE_TOURNEY: Added");
      console.log("CREATE_TOURNEY: Returning...");
    }

  }

  async updateTournament(tournamentId, updatedData) {
    console.log("UPDATE_TOURNEY: Intiating...");
    console.log("UPDATE_TOURNEY: Finding data...");

    let data = await this.tournaments.query(tournament =>
      tournament.id === tournamentId
    );

    if (data.length > 0) {
      console.log("UPDATE_TOURNEY: Data found!:", data[0]);

      let keys = Object.keys(updatedData);

      keys.forEach(key => {
        if (data[0].hasOwnProperty(key)) {
          data[0][`${key}`] = updatedData[`${key}`]
        }
      });

      console.log("UPDATE_TOURNEY: Updating...");
      await this.tournaments.put(data[0]);
      console.log("UPDATE_TOURNEY: Updated!:", data[0]);
      console.log("UPDATE_TOURNEY: Returning...");
      return true
    } else {
      console.log("UPDATE_TOURNEY: No data found with id:", tournamentId);
      console.log("UPDATE_TOURNEY: Returning...");
      return false
    }
  }

  async getTournaments() {
    console.log("GET_TOURNEYS: Initiating...");
    console.log("GET_TOURNEYS: Fetching all tourneys");
    let tournaments = await this.tournaments.query(tournament =>
      tournament.id > -1
    )
    console.log("GET_TOURNEYS: Fetched!", tournaments);
    console.log("GET_TOURNEYS: Returning...");
    return tournaments
  }

  async getTournament(tournamentId) {
    console.log("GET_TOURNEY: Initiating...");
    console.log("GET_TOURNEY: Fetching tourney with id:", tournamentId);
    let tournament = await this.tournaments.query(tournament =>
      tournament.id === tournamentId
    )
    console.log("GET_TOURNEY: Fetched!", tournament);
    console.log("GET_TOURNEY: Returning...");
    return tournament
  }

  async getTourneyWinners(tournamentId) {
    console.log("GET_TOURNEY_WINNERS: Initiating...");
    console.log("GET_TOURNEY_WINNERS: Fetching tourney");

    let tourney = await this.tournaments.query(tournament =>
      tournament.id === tournamentId
    )

    if (tourney.length > 0) {
      console.log("GET_TOURNEY_WINNERS: Tourney fetched!!", tourney);

      let winnersLength = tourney.shares.length;

      console.log("GET_TOURNEY_WINNERS: Fetching tourney session data");
      let tourneySession = await this.getTournamentResult(tournamentId);

      if (tourneySession.length > 0) {
        console.log("GET_TOURNEY_WINNERS: Tourney session fetched!!", tourneySession);

        let players = tourneySession.map(session => {
          let playerAddress = Object.keys(session.sessionData.playerData);
          return {
            address: playerAddress[0],
            score: session.sessionData.playerData[playerAddress[0]].currentHighestNumber
          }
        });

        console.log("GET_TOURNEY_WINNERS: Player data mapped!!", players);

        console.log("GET_TOURNEY_WINNERS: Sorting player scores");
        // sort in ascending order since shortest time is the winner
        players.sort((el1, el2) => el1.score - el2.score);
        console.log("GET_TOURNEY_WINNERS: Sorted!!", players);

        console.log("GET_TOURNEY_WINNERS: Mapping winners...");
        let winners = players.map((player, idx) => {
          if (idx < winnersLength) {
            return player.address
          }
        });
        console.log("GET_TOURNEY_WINNERS: Winners Mapped!!", winners);
        console.log("GET_TOURNEY_WINNERS: Returning...");

        return winners;

      } else {
        console.log("GET_TOURNEY_WINNERS: No tourney session fetched with id: ", tournamentId);
        console.log("GET_TOURNEY_WINNERS: Returning...");
        return []
      }
    } else {
      console.log("GET_TOURNEY_WINNERS: No tourney fetched with id: ", tournamentId);
      console.log("GET_TOURNEY_WINNERS: Returning...");
      return []
    }
  }
}