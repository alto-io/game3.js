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

    useServer = (options) => {
      let serverType = options.type;

      switch (serverType) {
          case CONSTANTS.TOURNEY_SERVER_TYPES.NAKAMA:

              getTourneyProvider(options).then(
                  tourneyProvider => {
                    if (tourneyProvider != null)
                    {
                      this.tourneyProvider = tourneyProvider;
                      this.sdkState = CONSTANTS.SDK_STATES.READY;
                    }
                  }
                );           
        
              break;
        
              default:
                console.error("server type not found. Must be one of : " + Object.keys(CONSTANTS.TOURNEY_SERVER_TYPES));
              break;
      }
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

    urlGameDetails = async (options) => {
      let result = await this.tourneyProvider.urlGameDetails(options)
      return result
    }
    
}

export function getTourneyStore(options) {
    return writable(new Tourney(options))
}