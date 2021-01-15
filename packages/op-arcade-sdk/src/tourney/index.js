import CONSTANTS from '../constants.js'

import { writable } from 'svelte/store';
import { nakamaInitSdk } from './nakama.js'

export class Tourney {

    sdkState = CONSTANTS.SDK_STATES.INITIALIZING

    // provider depends on serverType
    tourneyProvider = null;

    constructor(options) {
        let serverType = options.type;

        switch (serverType) {
            case CONSTANTS.TOURNEY_SERVER_TYPES.NAKAMA:

                nakamaInitSdk(options).then(
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
    
}

export function getTourneyStore(options) {
    return writable(new Tourney(options))
}