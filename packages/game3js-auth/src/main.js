import Auth from './Auth.svelte';

const DEFAULT_CONFIG = {
	type: "nakama",
	url: "http://127.0.0.1",
	port: 7350,
	key: "defaultkey"
}


const G3JSAuth = (options) => {

	return new Auth({
		target: document.body,
		props: {
			options: DEFAULT_CONFIG
		}
	});
}

// attach to window
window.G3JSAuth = G3JSAuth;

export default G3JSAuth;