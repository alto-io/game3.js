import { readable, writable } from 'svelte/store';

export const SDK_STATES = {
    NOT_CONNECTED: 1,
    CONNECTING: 2,
    CONNECTED: 3
}

function createApiKey() {
    const { subscribe, set, update } = writable("");
    
    return {
        subscribe,
        connect: () => {
            update(key =>
                {
                    sdkState.connect(key);
                    return key;
                }
            );
        },

        disconnect: () => {
            update(key =>
                console.log(key + " disconnect")
            );
        },

        set
    }
}

function createSdkState() {
    const { subscribe } = readable(SDK_STATES.NOT_CONNECTED,
        set => {
            console.log(set);
        }

        );

    return {
        subscribe,
        connect: (key) => {
            console.log(key)
            set(key);
            return SDK_STATES.CONNECTING;
        }

    }
}

export const apiKey = createApiKey();
export const sdkState = createSdkState();

export const url = readable(window.location.href);

