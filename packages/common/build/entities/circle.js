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
class Circle extends schema_1.Schema {
    // Init
    constructor(x, y, radius) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    // Getters
    get body() {
        return new __1.Geometry.CircleBody(this.x, this.y, this.radius);
    }
}
__decorate([
    schema_1.type('number')
], Circle.prototype, "x", void 0);
__decorate([
    schema_1.type('number')
], Circle.prototype, "y", void 0);
__decorate([
    schema_1.type('number')
], Circle.prototype, "radius", void 0);
exports.Circle = Circle;
//# sourceMappingURL=circle.js.map