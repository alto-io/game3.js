# Game3.js (The Web 3.0 Game Framework)

👋 Thank you for checking out Game3.js!

### **Heads up! ⚠** 

Please take note that this project is still under heavy development, and we're currently refactoring it to be an NPM package.


Don't hesitate to file a Github issue or reach out to us on Gitter 👇 if you have any questions. 

 

[![Join the community on Gitter](https://img.shields.io/gitter/room/alto-io/game3-js?style=for-the-badge)](https://gitter.im/game3-js/community)

## 🚀 Quickstart

### 1. Install required software

 * [Node.js](https://nodejs.org/en/download/)
 * [Yarn](https://yarnpkg.com/getting-started/install)

### 2. Fork the repository

* [![Fork Game3.js](https://img.shields.io/github/forks/alto-io/game3.js.svg?style=social&label=Fork%20Game3.js&maxAge=2592000)](https://GitHub.com/alto-io/game3.js/fork)

### 3. Run the app

From inside project directory:

* Switch to the **develop** branch, which is the last branch where this Readme is applicable
* Install dependencies with `yarn`.
* Start game with `yarn start`.
* The game is available at http://localhost:3000.

## 🕹 Playing A Game

 ![World of Mines](images/wom.gif?raw=true "World of Mines")

 * Once the app is running, the homepage will contain a list of all integrated games
 * Press the `Play` button to start!

 ## Game Engine Support

Game3.js currently has demo integrations of the following engines:

#### Game Engines
* Javascript Game Engines (Pixi.js, Phaser, Babylon, etc)
* [Unity 3D](https://github.com/alto-io/game3js-unity-sdk)

#### Multiplayer Servers
* [Colyseus](https://colyseus.io/)

### Javascript Game Engines

We've included an integrated demo of TOSIOS with Game3.js. The best place to start is to look at the following files:
* [GameJavascript.tsx](packages/client/src/scenes/GameJavascript.tsx)
* [Game.tsx](packages/client/src/scenes/Game.tsx)

### Unity 3D

Integrating Unity 3D games requires the use of [react-unity-webgl](https://www.npmjs.com/package/react-unity-webgl) and building Unity games into HTML5 with the Game3.js [Unity 3D SDK](https://github.com/alto-io/game3js-unity-sdk). The [GameUnity.tsx](packages/client/src/scenes/GameUnity.tsx) file would provide more info on how the Unity + Javascript communication is done.

### Multiplayer Servers

Currently an authoritative multiplayer game server is required if you want stronger security for game resolution. The demo app makes use of [Colyseus](https://colyseus.io/), which resolves gameplay server-side, and sends the results to the Game3.js web app.

## 📼 Game Replays using MediaRecorder and OrbitDB / IPFS

 ![Watch Replay](images/watchreplay.png?raw=true "Watch Replay")

Game3.js currently has a functionality to save game replays, which can be used as additional verification for gameplay results.

More info on how this is done:

* Game3.js uses the [MediaRecorder Web API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) to save a replay of a game session on client-side IPFS.
* A [canvas object](packages/client/src/scenes/GameContainer.tsx) which shows the game client is saved by the API
* Once a game starts [startRecording()](packages/client/src/scenes/Game.tsx) is called in Game.tsx
* Once the game is finished [stopRecording()](packages/client/src/scenes/Game.tsx) is called, which saves the stream onto a webm file stored in IPFS (see localSaveReplay()).
* For games that don't use Colyseus, the MediaRecorder API can be used directly to store a stream of the gameplay which can be the parameter for localSaveReplay().


## Creating Your Own Game

Game3.js currently does not have a web dashboard for integrating games yet, and requires you to fork the whole repo. In the meantime, here are some general next steps for making a new game: 

  * Play around with the TOSIOS Example to understand how Colyseus and Pixi.js work. Most of the game-related code is in `packages/client` and `packages/common`. The vanilla [TOSIOS](https://github.com/halftheopposite/tosios) repo is also a great reference.
  * Explore the [Game3.js Unity SDK](https://github.com/alto-io/game3js-unity-sdk) if you're building using Unity 3D. The SDK includes the Flappy Bird Example integrated with game3.js.

 ![Flappy Bird](images/flappybird.gif?raw=true "Flappy Bird")


Do [reach out to us](https://gitter.im/game3-js/community) if you want to integrate your games with OP Arcade, the upcoming live version of Game3.js!


## Game3.js Overview

![Game3.js Overview](http://www.plantuml.com/plantuml/proxy?src=https://raw.github.com/alto-io/game3.js/main/plantuml/overview.txt)

## 🎭 Live Demo

-- This is bleeding edge: here be dragons! 🐲🐉 --

The `master` branch is deployed every commit on [http://game3js-staging.herokuapp.com/](http://game3js-staging.herokuapp.com/). 


## Special thanks

### Demo Games:
* [@halftheopposite](https://github.com/halftheopposite)'s [TOSIOS](https://github.com/halftheopposite/tosios).
 * [@dgkanatsios](https://github.com/dgkanatsios)'s [Open-Source Flappy Bird Style Game](https://github.com/dgkanatsios/FlappyBirdStyleGame)

## Licenses

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](https://github.com/alto-io/game3.js/blob/master/LICENSE)