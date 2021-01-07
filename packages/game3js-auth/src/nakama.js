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

const nakamaInitSdk = async (options) => {

    let session = null;

    let sdkContext = {
        sdkState: CONSTANTS.SDK_STATES.NOT_READY
    }

    // initialize sdk    
    let client = new nakamajs.Client(
        options.key,
        options.url,
        options.port
    )

    // do a test authenticate
    session = await client.authenticateCustom({
        id: TEST_ID,
        create: true
    });

    if (session != null) {

        console.log('%c%s',
        'color: blue; background: white;',
        "Nakama client SDK initialized: --- " 
        + options.url + ":" + options.port + " ---"
        )

        sdkContext.sdkClient = client;
        sdkContext.sdkState = CONSTANTS.SDK_STATES.READY;
    }

    return sdkContext;
}


const nakamaLogin = async (loginObject) => {

    let session = null;

    return loginObject
}


export {
    DEFAULT_NAKAMA_CONFIG,
    nakamaInitSdk,
    nakamaLogin,
    NakamaConfig
};