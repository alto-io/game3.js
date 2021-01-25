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
class Rectangle extends schema_1.Schema {
    // Init
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    // Getters
    get body() {
        return new __1.Geometry.RectangleBody(this.x, this.y, this.width, this.height);
    }
}
__decorate([
    schema_1.type('number')
], Rectangle.prototype, "x", void 0);
__decorate([
    schema_1.type('number')
], Rectangle.prototype, "y", void 0);
__decorate([
    schema_1.type('number')
], Rectangle.prototype, "width", void 0);
__decorate([
    schema_1.type('number')
], Rectangle.prototype, "height", void 0);
exports.Rectangle = Rectangle;
//# sourceMappingURL=rectangle.js.map