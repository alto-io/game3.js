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

    this.tournaments = await this.orbitdb.kvstore('tournaments', this.defaultOptions);
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

  async serverUpdateScore(sessionId, playerAddress, tournamentId) {
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

        console.log("UPDATE_SCORE: Current High Score", playerData.currentHighestNumber);
        console.log("UPDATE_SCORE: Current Score", playerData.timeLeft);

        if (playerData.timeLeft > playerData.currentHighestNumber) {
          playerData.currentHighestNumber = playerData.timeLeft;
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
}