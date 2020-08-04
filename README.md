# Game3.js (The Web 3.0 Game Framework)

[![Join the community on Gitter](https://img.shields.io/gitter/room/alto-io/game3-js?style=for-the-badge)](https://gitter.im/game3-js/community)

## 🚀 Getting Started

### 1. Install required software

 * [Node.js](https://nodejs.org/en/download/)
 * [Yarn](https://yarnpkg.com/getting-started/install)

### 2. Fork the repository

* [![Fork Game3.js](https://img.shields.io/github/forks/alto-io/game3.js.svg?style=social&label=Fork%20Game3.js&maxAge=2592000)](https://GitHub.com/alto-io/game3.js/fork)

### 3. Run the app

From inside project directory:
* Install dependencies with `yarn`.
* Start game with `yarn start`.
* The game is available at http://localhost:3000.

## 🕹 Playing A Game

 ![New Room Button](images/newroom.png?raw=true "New Room Button")

 * Press The `+ New Room` button
 * Specify the parameters, then press the `Create` button

## 📼 Watching A Replay

 ![Watch Replay](images/watchreplay.png?raw=true "Watch Replay")

 * Once a game session finishes, a replay is saved client-side via IPFS. To watch the video, press the `Watch` button

## Creating Your Own Game

Game3.js currently does not support more than one game yet, and requires you to fork the whole repo. Here are some general next steps for making a new game: 

  * Play around with the TOSIOS Example to understand how Colyseus and Pixi.js work. Most of the game-related code is in `packages/client` and `packages/common`. The vanilla [TOSIOS](https://github.com/halftheopposite/tosios) repo is also a great reference.
  * Future versions of Game3.js will integrate the Web 3 Login for player identity and the IPFS replays for smart contract leaderboards. For games to be more easily integrated, the following integration points should be done:
	  1. Once logged in, the game should use the saved player name
	  2. Once a game finishes, the game should successfully save a replay


## Special thanks

Based on [@halftheopposite](https://github.com/halftheopposite)'s [TOSIOS](https://github.com/halftheopposite/tosios).

## Licenses

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](https://github.com/alto-io/game3.js/blob/master/LICENSE)

The major libraries and assets used in this project and their licenses:

* Colyseus: [MIT](https://github.com/colyseus/colyseus/blob/master/LICENSE)
* PIXI.js: [MIT](https://github.com/pixijs/pixi.js/blob/dev/LICENSE)
* Font "Press Start 2P": [Creative Common Zero](http://www.zone38.net/font/)
