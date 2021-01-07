import CONSTANTS from './constants.js'
import * as nakamajs from '@heroiclabs/nakama-js';

const DEFAULT_NAKAMA_CONFIG = {
	type: "nakama",
	url: "127.0.0.1",
	port: 7350,
	key: "defaultkey"
}

const TEST_ID = "test_id"

const NakamaConfig = (options) => {

    // TODO
    if (options === undefined)
        return DEFAULT_NAKAMA_CONFIG;
}

// return a login provider on success
const nakamaInitSdk = async (options) => {

    // initialize sdk    
     let client = new nakamajs.Client(
        options.key,
        options.url,
        options.port
    )

    // do a test authenticate
    let session = await client.authenticateCustom({
        id: TEST_ID,
        create: true
    });

    if (session != null) {

        let lp = new NakamaLoginProvider(client);

        console.log('%c%s',
        'color: blue; background: white;',
        "Nakama client SDK initialized: --- " 
        + options.url + ":" + options.port + " ---"
        )
        
        return lp;
    }

    return null;
}

class NakamaLoginProvider {

    client = null;
    session = null;
    
    constructor(client) {
        this.client = client;
    }

    login = async (loginObject) => {

        try {
            this.session = await this.client.authenticateEmail(
                {
                email: loginObject.username,
                password: loginObject.password,
                create: true   
                }
            )
        } catch (e) {
            console.error("Login failed [" + e.status + ":" + e.statusText + "]"); 
         }
    
        return this.session
    }    

    logout = () => {
        this.session = null;
    }
}

export {
    DEFAULT_NAKAMA_CONFIG,
    nakamaInitSdk,
    NakamaConfig,
    NakamaLoginProvider
};