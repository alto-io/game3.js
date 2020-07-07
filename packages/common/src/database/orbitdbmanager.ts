import * as IPFS from 'ipfs'
const OrbitDB = require('orbit-db')
import { PlayerProfile } from './playerprofile'
import { GuestConfig } from './guestconfig'
import { DBManager } from './dbmanager'
import { LeaderboardEntry } from './leaderboardentry'
import { TournamentData } from './tournamentdata'

const all = require('it-all')
const { Buffer } = IPFS

export class OrbitDBManager implements DBManager {

  REPO = './ipfs'

  node:any = null
  orbitdb:any = null
  defaultOptions:any = null;

  //db tables
  guest: any = null;
  leaderboardEntries: any = null;
  user:any = null
  tournaments:any = null
  tournamentResults:any = null

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
    this.defaultOptions = { accessController: { write: [this.orbitdb.identity.id] }}

    await this.initializeData();

  }

  async loadFixtureData (fixtureData: any) {
    const fixtureKeys = Object.keys(fixtureData)
    for (let i in fixtureKeys) {
      let key = fixtureKeys[i]
      if(!this.user.get(key))
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

  }

  async refreshClientData() {
    await this.leaderboardEntries.load()
  }

  async refreshLeaderboard() {
    if (this.leaderboardEntries)
    { 
      return await this.leaderboardEntries.query( (doc) => doc.id != null);
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
      }))
      {
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
        result = new File([content], hash + ".webm", {type:'video/webm' })
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
      }))
      {
        return saveResult.cid.string
      }
  }

  async serverPutResult(requestBody) {
    console.log('serverPutResult')
    const { tournamentId, resultId, fileHash } = requestBody
    const id = `${tournamentId}-${resultId}`
    const entry = {
      id,
      tournamentId,
      fileHash,
    }
    console.log(entry)
    const result = await this.tournamentResults.put(entry);
    return { result }
  }

}