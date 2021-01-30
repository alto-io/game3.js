import CONSTANTS from './constants.js'
import { readable, writable, get } from 'svelte/store';
import { getTourneyStore } from './tourney';
import { getAuthStore } from './auth';

export const username = writable("");
export const password = writable("");
export const loginState = writable(CONSTANTS.LOGIN_STATES.LOGGED_OUT);
export const passedSessionToken = writable(null);

export const apiKey = writable("");
export const url = readable(document.referrer);

export const onOpArcade = writable(false);

export const tourneyStore = getTourneyStore();
export const authStore = getAuthStore();

export async function useServers(options) {    
    return {
        auth_provider:  await get(authStore).useServer(options.auth_server),
        tourney_provider: await get(tourneyStore).useServer(options.tourney_server)
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

