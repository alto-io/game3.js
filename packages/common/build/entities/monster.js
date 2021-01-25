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
const circle_1 = require("./circle");
class Monster extends circle_1.Circle {
    // Init
    constructor(x, y, radius, mapWidth, mapHeight, lives) {
        super(x, y, radius);
        this.rotation = 0;
        this.lives = 0;
        this.state = 'idle';
        this.lastActionAt = Date.now();
        this.lastAttackAt = Date.now();
        this.idleDuration = 0;
        this.patrolDuration = 0;
        this.targetPlayerId = null;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.lives = lives;
    }
    // Update
    update(players) {
        switch (this.state) {
            case 'idle':
                this.updateIdle(players);
                break;
            case 'patrol':
                this.updatePatrol(players);
                break;
            case 'chase':
                this.updateChase(players);
                break;
        }
    }
    updateIdle(players) {
        // Look for a player to chase
        if (this.lookForPlayer(players)) {
            return;
        }
        // Is state over?
        const delta = Date.now() - this.lastActionAt;
        if (delta > this.idleDuration) {
            this.startPatrol();
        }
    }
    updatePatrol(players) {
        // Look for a player to chase
        if (this.lookForPlayer(players)) {
            return;
        }
        // Is state over?
        const delta = Date.now() - this.lastActionAt;
        if (delta > this.patrolDuration) {
            this.startIdle();
            return;
        }
        // Move monster
        this.move(__1.Constants.MONSTER_SPEED_PATROL, this.rotation);
        // Is the monster out of bounds?
        if (this.x < __1.Constants.TILE_SIZE ||
            this.x > this.mapWidth - __1.Constants.TILE_SIZE ||
            this.y < __1.Constants.TILE_SIZE ||
            this.y > this.mapHeight - __1.Constants.TILE_SIZE) {
            this.x = __1.Maths.clamp(this.x, 0, this.mapWidth);
            this.y = __1.Maths.clamp(this.y, 0, this.mapHeight);
            this.rotation = __1.Maths.getRandomInt(-3, 3);
        }
    }
    updateChase(players) {
        // Did player disconnect or die?
        const player = getPlayerFromId(this.targetPlayerId, players);
        if (!player || !player.isAlive) {
            this.startIdle();
            return;
        }
        // Did player run away?
        const distance = __1.Maths.getDistance(this.x, this.y, player.x, player.y);
        if (distance > __1.Constants.MONSTER_SIGHT) {
            this.startIdle();
            return;
        }
        // Move toward player
        this.rotation = __1.Maths.calculateAngle(player.x, player.y, this.x, this.y);
        this.move(__1.Constants.MONSTER_SPEED_CHASE, this.rotation);
    }
    // States
    startIdle() {
        this.state = 'idle';
        this.rotation = 0;
        this.targetPlayerId = null;
        this.idleDuration = __1.Maths.getRandomInt(__1.Constants.MONSTER_IDLE_DURATION_MIN, __1.Constants.MONSTER_IDLE_DURATION_MAX);
        this.lastActionAt = Date.now();
    }
    startPatrol() {
        this.state = 'patrol';
        this.targetPlayerId = null;
        this.patrolDuration = __1.Maths.getRandomInt(__1.Constants.MONSTER_PATROL_DURATION_MIN, __1.Constants.MONSTER_PATROL_DURATION_MAX);
        this.rotation = __1.Maths.getRandomInt(-3, 3);
        this.lastActionAt = Date.now();
    }
    startChase(playerId) {
        this.state = 'chase';
        this.targetPlayerId = playerId;
        this.lastActionAt = Date.now();
    }
    // Methods
    lookForPlayer(players) {
        if (!this.targetPlayerId) {
            const playerId = getClosestPlayerId(this.x, this.y, players);
            if (playerId) {
                this.startChase(playerId);
                return true;
            }
        }
        return false;
    }
    hurt() {
        this.lives -= 1;
    }
    move(speed, rotation) {
        this.x = this.x + Math.cos(rotation) * speed;
        this.y = this.y + Math.sin(rotation) * speed;
    }
    attack() {
        this.lastAttackAt = Date.now();
    }
    // Getters
    get isAlive() {
        return this.lives > 0;
    }
    get canAttack() {
        const delta = Math.abs(this.lastAttackAt - Date.now());
        return this.state === 'chase' && delta > __1.Constants.MONSTER_ATTACK_BACKOFF;
    }
}
__decorate([
    schema_1.type('number')
], Monster.prototype, "rotation", void 0);
exports.Monster = Monster;
function getPlayerFromId(id, players) {
    for (const playerId in players) {
        if (id === playerId) {
            return players[playerId];
        }
    }
    return null;
}
function getClosestPlayerId(x, y, players) {
    for (const playerId in players) {
        const player = players[playerId];
        if (player.isAlive) {
            const distance = __1.Maths.getDistance(x, y, player.x, player.y);
            if (distance <= __1.Constants.MONSTER_SIGHT) {
                return playerId;
            }
        }
    }
    return null;
}
//# sourceMappingURL=monster.js.map