const DEFAULT_NAKAMA_CONFIG = {
	type: "nakama",
	url: "http://127.0.0.1",
	port: 7350,
	key: "defaultkey"
}


const NakamaConfig = (options) => {

    // TODO
    if (options === undefined)
        return DEFAULT_NAKAMA_CONFIG;
}

export {
    DEFAULT_NAKAMA_CONFIG,
    NakamaConfig
};