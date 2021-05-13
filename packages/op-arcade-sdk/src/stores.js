import CONSTANTS from './constants.js'
import { readable, writable, get } from 'svelte/store';
import { getTourneyStore } from './tourney';
import { getAuthStore } from './auth';

export const username = writable("");
export const password = writable("");
export const loginState = writable(CONSTANTS.LOGIN_STATES.LOGGED_OUT);
export const passedSessionToken = writable(null);
export const tournamentId = writable(null);
export const apiUrl = writable(null);

export const apiKey = writable("");
export const url = readable(document.referrer);

export const onOpArcade = writable(false);
export const isTournament = writable(false);

export const tourneyStore = getTourneyStore();
export const authStore = getAuthStore();

export const NODE_API_URL = writable({
    dev: "http://127.0.0.1:3001/oparcade/api",
    prod: "http://op-arcade-dev.herokuapp.com/oparcade/api"
})

export async function useServers(options) {
    let auth_provider = await get(authStore).useServer(options.auth_server);
    let tourney_provider = await get(tourneyStore).useServer(options.tourney_server, auth_provider);

    return {
        auth_provider,
        tourney_provider
    }
}

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

