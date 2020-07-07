import * as minimongo from 'minimongo'

import { PlayerProfile } from './playerprofile'
import { GuestConfig } from './guestconfig'
import { DBManager } from './dbmanager'
import { LeaderboardEntry } from './leaderboardentry'
import { TournamentData } from './tournamentdata'

const all = require('it-all')

export class MinimongoDBManager implements DBManager {

    db:any = null
    
    REPO = './ipfs'

    node:any = null
    orbitdb:any = null
    defaultOptions:any = null;
  
    //client
    config: any = null;
    leaderboardEntries: any = null;
  
    // server
    user:any = null
    tournaments:any = null

  async start() {
    var LocalDB = minimongo.LocalStorageDb;

    // @ts-ignore
    this.db = await new LocalDB({namespace: "opg"});

    await this.initializeData();
  }

  async initializeData() {

    this.db.addCollection("guest");
    this.db.addCollection("user");
    this.db.addCollection("leaderboardEntries");
    this.db.addCollection("tournaments");

    // this.user = await this.orbitdb.kvstore('user', this.defaultOptions)
    // await this.user.load()

    // this.leaderboardEntries = await this.orbitdb.docstore('leaderboardEntries', docStoreOptions); 
    // await this.leaderboardEntries.load()

    // this.tournaments = await this.orbitdb.kvstore('tournaments', this.defaultOptions);
    // await this.tournaments.load()

  }

  async refreshLeaderboard() {

    // this.db.leaderboardEntries.find()


    // if (this.leaderboardEntries)
    // { 
    //   return await this.leaderboardEntries.query( (doc) => doc.id != null);
    // }
    // else return null;
  }

  async getPlayerProfile(walletid: any) {
    
    await this.db.user.find().fetch(
    (result) => { // on success
        console.log(result)
        if (result.length > 0)
            return result[0];
        else return null;
    },
    (error) => {
        console.log(error)
        return null;
    }
    )
  }

  async getLeaderboard() {

    const lb = await this.user.all

    return lb
  }

  async savePlayerProfile(playerProfile: PlayerProfile) {
    await this.db.user.upsert(playerProfile, playerProfile, 
        (result) => { // on success
                return result;
        },
        (error) => {
            console.log(error)
            return null;
        }
        )
  }

  async getTournamentData(tournamentId: any) {
    
    await this.db.tournaments.find({ tournamentId }).fetch(
        (result) => { // on success
            if (result.length > 0)
                return result[0];
            else return null;
        },
        (error) => {
            console.log(error)
            return null;
        }
        )
  }

  // TODO: update for minimongodb, still uses orbit code
  async putTournamentData(tournamentData: TournamentData) {
    const id = tournamentData.id
    const result = await this.user.set(id, tournamentData)
    return result
  }

  async getGuestConfig(callback?) {

    this.db.guest.find().fetch(callback,
      (error) => {
          return null;
      }
    )
  }

  async saveGuestConfig(guestConfig: GuestConfig) {
    this.db.guest.upsert(guestConfig, null, 
      (r) => { console.log(r) },
      (e) => { console.log(e) }
    )
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

}