import Auth from './Auth.svelte'
import { NakamaConfig, DEFAULT_NAKAMA_CONFIG } from './nakama.js'

const init = (options) => {

	if (options === undefined)
		options = DEFAULT_NAKAMA_CONFIG;

	return new Auth({
		target: document.body,
		props: {
			options
		}
	});
}

export {
	NakamaConfig,
	init
};