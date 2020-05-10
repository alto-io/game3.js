# Game3.js (The Web 3.0 Game Framework)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/alto-io/game3.js/blob/master/LICENSE) [![](https://github.com/alto-io/game3.js/workflows/Docker%20Publish/badge.svg)](https://hub.docker.com/r/alto-io/game3.js)

## 🚀 Running

To run the project in development:

1. Install dependencies with `yarn`.
2. Start game with `yarn start`.
3. The game is available at http://localhost:3001.

If you encounter a **white screen** the first time you try to load the game in the browser, that's normal, just refresh the page. This is due to the order in which things are built the first time at launch.

In development, the `front` application is NOT served by the `server`, thus requiring you to access it through port `3000` instead of `3001` as seen before.

In development changes made to `client` and `server` are live, except for the `common` module.

## Project architecture

This project is a monorepo (with the help of Yarn workspaces). It contains the following packages:

* `client` - The frontend application using `Create React App`, `PIXI.js` and `Colyseus.js`.
* `server` - The authoritarive server running on `NodeJS`, `Express` and `Colyseus`.
* `common` - A collection of constants and methods shared amongst `client` and `server`.

## Special thanks

Based on [@halftheopposite](https://github.com/halftheopposite)'s [TOSIOS](https://github.com/halftheopposite/tosios).

## Licenses

This project is under the [MIT](https://github.com/alto-io/game3.js/blob/master/LICENSE) license.

The major libraries and assets used in this project and their licenses:

* Colyseus: [MIT](https://github.com/colyseus/colyseus/blob/master/LICENSE)
* PIXI.js: [MIT](https://github.com/pixijs/pixi.js/blob/dev/LICENSE)
* Font "Press Start 2P": [Creative Common Zero](http://www.zone38.net/font/)
