"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * Set the x and y coordinates
     */
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Return wether this vector is at (0,0) or not
     */
    get empty() {
        return this.x === 0 && this.y === 0;
    }
}
exports.Vector = Vector;
/**
 * An object to represent a Rectangle shape
 */
class RectangleBody {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * Return a copy of this object
     */
    copy() {
        return new RectangleBody(this.x, this.y, this.width, this.height);
    }
    // Getters
    get left() {
        return this.x;
    }
    get top() {
        return this.y;
    }
    get right() {
        return this.x + this.width;
    }
    get bottom() {
        return this.y + this.height;
    }
    get position() {
        return new Vector(this.x + (this.width / 2), this.y + (this.height / 2));
    }
    get center() {
        return new Vector(this.x + (this.width / 2), this.y + (this.height / 2));
    }
    // Setters
    set left(left) {
        this.x = left;
    }
    set top(top) {
        this.y = top;
    }
    set right(right) {
        this.x = right - this.width;
    }
    set bottom(bottom) {
        this.y = bottom - this.height;
    }
    set position(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }
}
exports.RectangleBody = RectangleBody;
/**
 * An object to represent a Circle shape
 */
class CircleBody {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    /**
     * Return a copy of this object
     */
    copy() {
        return new CircleBody(this.x, this.y, this.radius);
    }
    // Getters
    get left() {
        return this.x - this.radius;
    }
    get top() {
        return this.y - this.radius;
    }
    get right() {
        return this.x + this.radius;
    }
    get bottom() {
        return this.y + this.radius;
    }
    get width() {
        return this.radius * 2;
    }
    get height() {
        return this.radius * 2;
    }
    get box() {
        return new RectangleBody(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
    // Setters
    set left(left) {
        this.x = left + this.radius;
    }
    set top(top) {
        this.y = top + this.radius;
    }
    set right(right) {
        this.x = right - this.radius;
    }
    set bottom(bottom) {
        this.y = bottom - this.radius;
    }
}
exports.CircleBody = CircleBody;
//# sourceMappingURL=geometry.js.map