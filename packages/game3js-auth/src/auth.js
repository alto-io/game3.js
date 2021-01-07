import CONSTANTS from './constants.js'
import { nakamaInitSdk, nakamaLogin } from './nakama.js'

export class Auth {

  sdkState = CONSTANTS.SDK_STATES.INITIALIZING
  sdkClient = null
  userContext = null;
  
  // functions replaced depending on serverType
  connect = null;

  constructor(options) {
    let serverType = options.type;

    switch (serverType) {
      case CONSTANTS.SERVER_TYPES.NAKAMA:
        nakamaInitSdk(options).then(
          sdkContext => {
            this.sdkState = sdkContext.sdkState;
            this.sdkClient = sdkContext.sdkClient;
          }
        ); 
        this.connect = nakamaLogin;
        break;

      default:
        console.error("options.type not found. Must be one of : " + Object.keys(CONSTANTS.SERVER_TYPES));
        break;
    }      

  }

}