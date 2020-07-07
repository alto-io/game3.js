const ThreadsPlugin = require("threads-plugin")

/**
 * React App Rewired Config
 */
module.exports = {
    webpack: (config) => {
        config.plugins = (config.plugins || [])
            .concat(new ThreadsPlugin())
        return config;
    },
};
