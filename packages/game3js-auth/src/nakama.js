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
        sdkState: CONSTANTS.SDK_STATES.UNINITIALIZED
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
        sdkContext.sdkClient = client;
        sdkContext.sdkState = CONSTANTS.SDK_STATES.INITIALIZED;
    }

    return sdkContext;
}


const nakamaLogin = (options) => {

    return {
        user: "hello"
    }
}


export {
    DEFAULT_NAKAMA_CONFIG,
    nakamaInitSdk,
    nakamaLogin,
    NakamaConfig
};