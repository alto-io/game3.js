import CONSTANTS from '../constants.js';

import { writable } from 'svelte/store';
import { getAuthProvider } from './nakama.js';

export class Auth {

    sdkState = CONSTANTS.SDK_STATES.INITIALIZING
    loginState = CONSTANTS.LOGIN_STATES.LOGGED_OUT

    // provider depends on serverType
    authProvider = null;

    constructor(options) {
      if (options != null)
        this.useServer(options);
    }

    useServer = async (options) => {
      let serverType = options.type;

      switch (serverType) {
          case CONSTANTS.AUTH_SERVER_TYPES.NAKAMA:

              let authProvider = await getAuthProvider(options);

              if (authProvider != null)
                  {
                    this.authProvider = authProvider;
                    this.sdkState = CONSTANTS.SDK_STATES.READY;
                  }
        
              break;
        
              default:
                console.error("server type not found. Must be one of : " + Object.keys(CONSTANTS.AUTH_SERVER_TYPES));
              break;
      }
      
      return this.authProvider;
    }


    login = async (loginCreds) => {
        this.loginState = CONSTANTS.LOGIN_STATES.LOGIN_IN_PROGRESS;
    
        let token = await this.authProvider.login(loginCreds);
        if (token != null)
        {
          this.loginState = CONSTANTS.LOGIN_STATES.LOGGED_IN;
        }

        else {
          this.loginState = CONSTANTS.LOGIN_STATES.LOGGED_OUT;
        }

        return this.loginState;

      }
    
      logout = () => {
        this.authProvider.logout();
        this.loginState = CONSTANTS.LOGIN_STATES.LOGGED_OUT;

        return this.loginState;
      }

      getSessionToken = () => {
        return this.authProvider.getSessionToken();
      }

      saveSessionToken = (options) => {
        return this.authProvider.saveSessionToken(options);
      }
    
}

export function getAuthStore(options) {
    return writable(new Auth(options))
}