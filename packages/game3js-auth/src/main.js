import CONSTANTS from './constants.js'

import { Auth } from './auth.js'
import { NakamaConfig, DEFAULT_NAKAMA_CONFIG } from './nakama.js'

const init = async (options) => {

	if (options === undefined)
		options = DEFAULT_NAKAMA_CONFIG;

	let auth = new Auth(options);

	return auth;
}

export {
	CONSTANTS,
	NakamaConfig,
	init
};