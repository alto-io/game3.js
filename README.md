# Game3.js (The Web 3.0 Game Framework)

👋 Thank you for checking out Game3.js!

### **Heads up! ⚠** 

Please take note that this project is still under heavy development.

Don't hesitate to file a Github issue or reach out to us on <a href="../../discussions">Github Discussions</a> if you have any questions. 

## 🚀 Quickstart

### 1. Install required software

 * [Node.js](https://nodejs.org/en/download/)

### 2. Fork the repository

* [![Fork Game3.js](https://img.shields.io/github/forks/alto-io/game3.js.svg?style=social&label=Fork%20Game3.js&maxAge=2592000)](https://GitHub.com/alto-io/game3.js/fork)

### 3. Run the example game

The repo includes the example Breakout game from [Phaser 3.0](http://phaser.io/).

From inside project directory:

* `npm install`
* `npm start`

## 4. Deploy on IPFS

To deploy on IPFS we need to do the following steps:

* Retrieve API keys from [Pinata](https://pinata.cloud/)

  * PINATA_API_KEY
  * PINATA_API_SECRET_KEY

* Input these keys as <a href="../../settings/secrets/actions">Repository Secrets</a>

* Go to the <a href="../../actions/workflows/release.yaml">Release Workflow</a> on Github Actions and click `Run Workflow`

* The game is now deployed and can be accessed using the IPFS gateways listed on the <a href="../../releases">Release Notes</a>

## Licenses

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](https://github.com/alto-io/game3.js/blob/master/LICENSE)