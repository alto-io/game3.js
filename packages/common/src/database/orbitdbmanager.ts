import * as IPFS from 'ipfs'
const OrbitDB = require('orbit-db')
import { PlayerProfile } from './playerprofile'

export class OrbitDBManager {

  REPO = './ipfs'

  node:any = null
  orbitdb:any = null
  defaultOptions:any = null;

  user:any = null

  async start() {

    if (!this.node) {
      this.node = await IPFS.create({
        relay: { enabled: true, hop: { enabled: true, active: true } },
        EXPERIMENTAL: { pubsub: true },
        repo: this.REPO,
      })

      this.orbitdb = await OrbitDB.createInstance(this.node)
      this.defaultOptions = { accessController: { write: [this.orbitdb.identity.id] }}
    }

  }

  async loadFixtureData (fixtureData: any) {
    const fixtureKeys = Object.keys(fixtureData)
    for (let i in fixtureKeys) {
      let key = fixtureKeys[i]
      if(!this.user.get(key))
        await this.user.set(key, fixtureData[key]);
    }
  }

  async initializeServerData() {
    this.user = await this.orbitdb.kvstore('user', this.defaultOptions)
    await this.user.load()
  }

  async getDBPlayerProfile(walletid: any) {

    const dbPlayerProfile = await this.user.get(walletid)

    return dbPlayerProfile
  }

  async getLeaderboard() {

    const lb = await this.user.all

    return lb
  }

  async savePlayerProfile(playerProfile: PlayerProfile) {

    const id = playerProfile.walletid;
    delete playerProfile.walletid;

    const result = await this.user.set(id, playerProfile)

    return result
  }

  async getId() {
    try {
      const id = (await this.node.id()).id
      return id
    }

    catch (e) {
      return null
    }
  }


}
