import CONSTANTS from './constants.js'
import { readable, writable, get } from 'svelte/store';
import { getTourneyStore } from './tourney';
import { getAuthStore } from './auth';

export const DEFAULT_CONFIG = {
    tourney_server: {
        type: CONSTANTS.TOURNEY_SERVER_TYPES.NAKAMA,
        url: "localhost",
        port: "7350",
        key: "defaultkey"
    },
    auth_server: {
        type: CONSTANTS.TOURNEY_SERVER_TYPES.NAKAMA,
        url: "localhost",
        port: "7350",
        key: "defaultkey"
    }
}

export const username = writable("");
export const password = writable("");
export const loginState = writable(CONSTANTS.LOGIN_STATES.LOGGED_OUT);

export const apiKey = writable("");
export const config = writable(DEFAULT_CONFIG);
export const url = readable(window.location.href);

export const tourneyStore = getTourneyStore(DEFAULT_CONFIG.tourney_server);
export const authStore = getAuthStore(DEFAULT_CONFIG.auth_server);

export const SDK_STATES = {
    NOT_CONNECTED: "not connected",
    CONNECTING: "connecting",
    CONNECTED: "connected"
}

function createSdk() {
    const { subscribe, set } = writable({
        state: SDK_STATES.NOT_CONNECTED
    });

    return {
        subscribe,
        connect: () => {
            console.log(get(apiKey))
            set(SDK_STATES.CONNECTING);
        }

    }
}

export const opSdk = createSdk();

