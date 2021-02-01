import CONSTANTS from '../constants.js'

import { writable } from 'svelte/store';
import { getTourneyProvider } from './nakama.js'

export class Tourney {

    sdkState = CONSTANTS.SDK_STATES.INITIALIZING

    // provider depends on serverType
    tourneyProvider = null;

    constructor(options) {
      if (options != null)
        this.useServer(options)
    }

    useServer = async (options, auth_provider = null) => {
      let serverType = options.type;

      switch (serverType) {
          case CONSTANTS.TOURNEY_SERVER_TYPES.NAKAMA:

              // nakama requires the authProvider
              if (auth_provider == null)
              {
                console.error("no auth provider given. Nakama requires an auth provider.");
              }

              else {

                let tourneyProvider = await getTourneyProvider(options, auth_provider);
                
                if (tourneyProvider != null) {
                    this.tourneyProvider = tourneyProvider;
                    this.sdkState = CONSTANTS.SDK_STATES.READY;
                  }
                else {
                    console.error("unable to initialize nakama tourney provider.");
                }

              }
              
              break;
        
              default:
                console.error("server type not found. Must be one of : " + Object.keys(CONSTANTS.TOURNEY_SERVER_TYPES));
              break;
      }

      return this.tourneyProvider;
    }

    getTourney = async (tournament_id) => {

        let result = await this.tourneyProvider.getTourney(tournament_id)
        return result

    }

    attemptTourney = async (tournament_id) => {
      let result = await this.tourneyProvider.attemptTourney(tournament_id)
      return result
    }

    postScore = async (options) => {
      let result = await this.tourneyProvider.postScore(options)
      return result
    }

    joinTourney = async (options) => {
      let result = await this.tourneyProvider.joinTourney(options)
      return result
    }

    
}

export function getTourneyStore(options) {
    return writable(new Tourney(options))
}