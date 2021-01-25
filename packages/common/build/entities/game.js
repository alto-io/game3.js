"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const __1 = require("..");
const _1 = require(".");
class Game extends schema_1.Schema {
    // Init
    constructor(attributes) {
        super();
        this.state = 'lobby';
        this.mapName = attributes.mapName;
        this.maxPlayers = attributes.maxPlayers;
        this.mode = attributes.mode;
        this.onWaitingStart = attributes.onWaitingStart;
        this.onLobbyStart = attributes.onLobbyStart;
        this.onGameStart = attributes.onGameStart;
        this.onGameEnd = attributes.onGameEnd;
    }
    // Update
    update(players, monsters) {
        switch (this.state) {
            case 'waiting':
                this.updateWaiting(players);
                break;
            case 'lobby':
                this.updateLobby(players);
                break;
            case 'game':
                this.updateGame(players, monsters);
                break;
        }
    }
    updateWaiting(players) {
        // If there are two players, the game starts.
        if (countPlayers(players) === 1) {
            this.startLobby();
            return;
        }
    }
    updateLobby(players) {
        // If a player is alone, the game stops.
        if (countPlayers(players) === 0) {
            this.startWaiting();
            return;
        }
        // If the lobby is over, the game starts.
        if (this.lobbyEndsAt < Date.now()) {
            this.startGame();
            return;
        }
    }
    updateGame(players, monsters) {
        // If a player is alone, the game stops.
        // if (countPlayers(players) === 1) {
        //   this.onGameEnd();
        //   this.startWaiting();
        //   return;
        // }
        // If the time is out, the game stops.
        if (this.gameEndsAt < Date.now()) {
            const message = new _1.Message('timeout');
            this.onGameEnd(message);
            this.startLobby();
            return;
        }
        // Death Match
        if (this.mode === 'deathmatch' && countActivePlayers(players) === 1) {
            // Check to see if only one player is alive
            const player = getWinningPlayer(players);
            if (player) {
                const message = new _1.Message('won', {
                    name: player.name,
                });
                this.onGameEnd(message);
                this.startLobby();
                return;
            }
        }
        // Team Death Match
        if (this.mode === 'team deathmatch') {
            // Check to see if only one team is alive
            const team = getWinningTeam(players);
            if (team) {
                const message = new _1.Message('won', {
                    name: team === 'Red' ? 'Red team' : 'Blue team',
                });
                this.onGameEnd(message);
                this.startLobby();
                return;
            }
        }
        // Score Attack
        if (this.mode === 'score attack' && countActiveMonsters(monsters) === 0) {
            // Check to see if only one player is alive
            const player = getWinningPlayer(players);
            if (player) {
                const message = new _1.Message('won', {
                    name: player.name,
                });
                this.onGameEnd(message);
                this.startLobby();
                return;
            }
        }
    }
    // Start
    startWaiting() {
        this.lobbyEndsAt = undefined;
        this.gameEndsAt = undefined;
        this.state = 'waiting';
        this.onWaitingStart();
    }
    startLobby() {
        this.lobbyEndsAt = Date.now() + __1.Constants.LOBBY_DURATION;
        this.gameEndsAt = undefined;
        this.state = 'lobby';
        this.onLobbyStart();
    }
    startGame() {
        this.lobbyEndsAt = undefined;
        this.gameEndsAt = Date.now() + __1.Constants.GAME_DURATION;
        this.state = 'game';
        this.onGameStart();
    }
}
__decorate([
    schema_1.type('string')
], Game.prototype, "state", void 0);
__decorate([
    schema_1.type('string')
], Game.prototype, "mapName", void 0);
__decorate([
    schema_1.type('number')
], Game.prototype, "lobbyEndsAt", void 0);
__decorate([
    schema_1.type('number')
], Game.prototype, "gameEndsAt", void 0);
__decorate([
    schema_1.type('number')
], Game.prototype, "maxPlayers", void 0);
__decorate([
    schema_1.type('string')
], Game.prototype, "mode", void 0);
exports.Game = Game;
function countPlayers(players) {
    let count = 0;
    for (const playerId in players) {
        count++;
    }
    return count;
}
function countActivePlayers(players) {
    let count = 0;
    for (const playerId in players) {
        if (players[playerId].isAlive) {
            count++;
        }
    }
    return count;
}
function countActiveMonsters(monsters) {
    let count = 0;
    for (const monsterid in monsters) {
        if (monsters[monsterid].isAlive) {
            count++;
        }
    }
    return count;
}
function getWinningPlayer(players) {
    for (const playerId in players) {
        if (players[playerId].isAlive) {
            return players[playerId];
        }
    }
    return null;
}
function getWinningTeam(players) {
    let redAlive = false;
    let blueAlive = false;
    for (const playerId in players) {
        const player = players[playerId];
        if (player.isAlive) {
            if (player.team === 'Red') {
                redAlive = true;
            }
            else {
                blueAlive = true;
            }
        }
    }
    if (redAlive && blueAlive) {
        return null;
    }
    return redAlive ? 'Red' : 'Blue';
}
//# sourceMappingURL=game.js.map