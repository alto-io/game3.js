import CONSTANTS from './constants.js'

export class Auth {

  sdkState = CONSTANTS.SDK_STATES.UNINITIALIZED;
  authOptions = null;

  constructor(options) {
    this.authOptions = options;
    this.sdkState = CONSTANTS.SDK_STATES.INITIALIZED;
  }

  getSdkState() {
    return this.sdkState
  }

  connect() {
    return CONSTANTS.LOGIN_STATES.LOGGED_IN
  }


}