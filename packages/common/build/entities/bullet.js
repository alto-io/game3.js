"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const circle_1 = require("./circle");
class Bullet extends circle_1.Circle {
    // Init
    constructor(playerId, team, x, y, radius, rotation, color, shotAt) {
        super(x, y, radius);
        this.playerId = playerId;
        this.team = team;
        this.rotation = rotation;
        this.fromX = x;
        this.fromY = y;
        this.active = true;
        this.color = color;
        this.shotAt = shotAt;
    }
    // Methods
    move(speed) {
        this.x = this.x + Math.cos(this.rotation) * speed;
        this.y = this.y + Math.sin(this.rotation) * speed;
    }
    reset(playerId, team, x, y, radius, rotation, color, shotAt) {
        this.playerId = playerId;
        this.team = team;
        this.fromX = x;
        this.fromY = y;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.rotation = rotation;
        this.active = true;
        this.color = color;
        this.shotAt = shotAt;
    }
}
__decorate([
    schema_1.type('string')
], Bullet.prototype, "playerId", void 0);
__decorate([
    schema_1.type('string')
], Bullet.prototype, "team", void 0);
__decorate([
    schema_1.type('number')
], Bullet.prototype, "rotation", void 0);
__decorate([
    schema_1.type('number')
], Bullet.prototype, "fromX", void 0);
__decorate([
    schema_1.type('number')
], Bullet.prototype, "fromY", void 0);
__decorate([
    schema_1.type('boolean')
], Bullet.prototype, "active", void 0);
__decorate([
    schema_1.type('string')
], Bullet.prototype, "color", void 0);
__decorate([
    schema_1.type('number')
], Bullet.prototype, "shotAt", void 0);
exports.Bullet = Bullet;
//# sourceMappingURL=bullet.js.map