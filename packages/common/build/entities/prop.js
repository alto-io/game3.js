"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const rectangle_1 = require("./rectangle");
class Prop extends rectangle_1.Rectangle {
    // Init
    constructor(propType, x, y, width, height) {
        super(x, y, width, height);
        this.type = propType;
        this.active = true;
    }
}
__decorate([
    schema_1.type('string')
], Prop.prototype, "type", void 0);
__decorate([
    schema_1.type('boolean')
], Prop.prototype, "active", void 0);
exports.Prop = Prop;
//# sourceMappingURL=prop.js.map