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
    this.db.addCollection("tournaments");

    // this.user = await this.orbitdb.kvstore('user', this.defaultOptions)
    // await this.user.load()

    // this.leaderboardEntries = await this.orbitdb.docstore('leaderboardEntries', docStoreOptions); 
    // await this.leaderboardEntries.load()

    // this.tournaments = await this.orbitdb.kvstore('tournaments', this.defaultOptions);
    // await this.tournaments.load()

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

  serverPutGameReplay(reqBody: any) {}

}