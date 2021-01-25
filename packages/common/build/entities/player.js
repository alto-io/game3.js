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
const validateName = (name) => name.trim().slice(0, 16);
const getTeamColor = (team) => team === 'Blue' ? '#0000FF' : '#FF0000';
class Player extends circle_1.Circle {
    // Init
    constructor(playerId, x, y, radius, lives, maxLives, name, address, team) {
        super(x, y, radius);
        this.playerId = playerId;
        this.lives = lives;
        this.maxLives = maxLives;
        this.name = validateName(name);
        this.address = address;
        this.team = team;
        this.color = team ? getTeamColor(team) : '#FFFFFF';
        this.kills = 0;
        this.rotation = 0;
        this.lastShootAt = undefined;
    }
    // Methods
    move(dirX, dirY, speed) {
        const magnitude = __1.Maths.normalize2D(dirX, dirY);
        const speedX = Math.round(__1.Maths.round2Digits(dirX * (speed / magnitude)));
        const speedY = Math.round(__1.Maths.round2Digits(dirY * (speed / magnitude)));
        this.x = this.x + speedX;
        this.y = this.y + speedY;
    }
    hurt() {
        this.lives -= 1;
    }
    heal() {
        this.lives += 1;
    }
    canBulletHurt(otherPlayerId, team) {
        if (!this.isAlive) {
            return false;
        }
        if (this.playerId === otherPlayerId) {
            return false;
        }
        if (!!team && team === this.team) {
            return false;
        }
        return true;
    }
    // Getters
    get isAlive() {
        return this.lives > 0;
    }
    get isFullLives() {
        return this.lives === this.maxLives;
    }
    // Setters
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    setRotation(rotation) {
        this.rotation = rotation;
    }
    setLives(lives) {
        if (lives) {
            this.lives = lives;
            this.kills = 0;
        }
        else {
            this.lives = 0;
        }
    }
    setName(name) {
        this.name = validateName(name);
    }
    setTeam(team) {
        this.team = team;
        this.color = getTeamColor(team);
    }
    setKills(kills) {
        this.kills = kills;
    }
}
__decorate([
    schema_1.type('string')
], Player.prototype, "playerId", void 0);
__decorate([
    schema_1.type('string')
], Player.prototype, "name", void 0);
__decorate([
    schema_1.type('number')
], Player.prototype, "lives", void 0);
__decorate([
    schema_1.type('number')
], Player.prototype, "maxLives", void 0);
__decorate([
    schema_1.type('string')
], Player.prototype, "team", void 0);
__decorate([
    schema_1.type('string')
], Player.prototype, "color", void 0);
__decorate([
    schema_1.type('number')
], Player.prototype, "kills", void 0);
__decorate([
    schema_1.type('number')
], Player.prototype, "rotation", void 0);
__decorate([
    schema_1.type('string')
], Player.prototype, "address", void 0);
exports.Player = Player;
//# sourceMappingURL=player.js.map