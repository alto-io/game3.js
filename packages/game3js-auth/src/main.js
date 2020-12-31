import CONSTANTS from './constants.js'

import { Auth } from './auth.js'
import { NakamaConfig, DEFAULT_NAKAMA_CONFIG } from './nakama.js'

const init = (options) => {

	if (options === undefined)
		options = DEFAULT_NAKAMA_CONFIG;

	return new Auth(options);
}

export {
	CONSTANTS,
	NakamaConfig,
	init
};