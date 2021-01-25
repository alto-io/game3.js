"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const geometry_1 = require("../geometry");
class Map {
    // Init
    constructor(width, height) {
        this.isRectangleOutside = (rectangle) => {
            return rectangle.x < 0 || rectangle.right > this.width || rectangle.y < 0 || rectangle.bottom > this.height;
        };
        this.isCircleOutside = (circle) => {
            return circle.left < 0 || circle.right > this.width || circle.top < 0 || circle.bottom > this.height;
        };
        this.width = width;
        this.height = height;
    }
    // Methods
    isVectorOutside(x, y) {
        return x < 0 || x > this.width || y < 0 || y < this.height;
    }
    clampRectangle(rectangle) {
        return new geometry_1.Vector(__1.Maths.clamp(rectangle.x, 0, this.width - rectangle.width), __1.Maths.clamp(rectangle.y, 0, this.height - rectangle.height));
    }
    clampCircle(circle) {
        return new geometry_1.Vector(__1.Maths.clamp(circle.x, 0, this.width - (circle.radius * 2)), __1.Maths.clamp(circle.y, 0, this.height - (circle.radius * 2)));
    }
    // Setters
    setDimensions(width, height) {
        this.width = width;
        this.height = height;
    }
}
exports.Map = Map;
//# sourceMappingURL=map.js.map