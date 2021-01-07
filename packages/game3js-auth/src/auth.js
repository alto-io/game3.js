import CONSTANTS from './constants.js'
import { nakamaInitSdk, nakamaLogin } from './nakama.js'

export class Auth {

  sdkState = CONSTANTS.SDK_STATES.INITIALIZING
  loginState = CONSTANTS.SDK_STATES.NOT_READY
  sdkClient = null
  userContext = null;
  
  // functions replaced depending on serverType
  loginProvider = null;

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

        this.loginProvider = nakamaLogin;

        break;

      default:
        console.error("options.type not found. Must be one of : " + Object.keys(CONSTANTS.SERVER_TYPES));
        break;
    }      

  }

  connect(loginObject) {
    this.loginState = CONSTANTS.LOGIN_STATES.LOGIN_IN_PROGRESS;
    console.log(loginObject);
  }

}