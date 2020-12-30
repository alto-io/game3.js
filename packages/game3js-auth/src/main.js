export const SERVER_TYPE = {
	NAKAMA: "nakama"
}

export const SDK_STATE = {
	READY: "ready",
	INITIALIZED: "initialized"
}

const DEFAULT_CONFIG = {
	type: SERVER_TYPE.NAKAMA,
	url: "http://127.0.0.1",
	port: 7350,
	key: "defaultkey"
}

const G3JSAuth = (options) => {

	return {
		state: SDK_STATE.INITIALIZED,
		config: DEFAULT_CONFIG
	}
}

// attach to window
window.G3JSAuth = G3JSAuth;

export default G3JSAuth;