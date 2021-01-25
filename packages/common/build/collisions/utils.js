"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maths_1 = require("../maths");
/**
 * Return which side of the second Rectangle the first collides with
 */
exports.rectangleToRectangleSide = (r1, r2) => {
    const dx = (r1.x + r1.width / 2) - (r2.x + r2.width / 2);
    const dy = (r1.y + r1.height / 2) - (r2.y + r2.height / 2);
    const width = (r1.width + r2.width) / 2;
    const height = (r1.height + r2.height) / 2;
    const crossWidth = width * dy;
    const crossHeight = height * dx;
    let collision = 'none';
    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
        if (crossWidth > crossHeight) {
            collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
        }
        else {
            collision = (crossWidth > -(crossHeight)) ? 'right' : 'top';
        }
    }
    return (collision);
};
/**
 * Return which side of the Rectangle is the Circle colliding with
 */
exports.circleToRectangleSide = (c, r) => {
    return exports.rectangleToRectangleSide(c.box, r);
};
/**
 * Rectangle to Rectangle
 */
exports.rectangleToRectangle = (r1, r2) => {
    return r1.left < r2.right &&
        r1.right > r2.left &&
        r1.top < r2.bottom &&
        r1.bottom > r2.top;
};
/**
 * Circle to Circle
 */
exports.circleToCircle = (c1, c2) => {
    const distance = Math.abs(maths_1.getDistance(c1.x, c1.y, c2.x, c2.y));
    return (distance < (c1.radius + c2.radius));
};
/**
 * Circle to Rectangle
 */
exports.circleToRectangle = (c, r) => {
    let testX = c.x;
    let testY = c.y;
    if (c.x < r.x) {
        testX = r.x;
    }
    else if (c.x > r.right) {
        testX = r.right;
    }
    if (c.y < r.y) {
        testY = r.y;
    }
    else if (c.y > r.bottom) {
        testY = r.bottom;
    }
    const distX = c.x - testX;
    const distY = c.y - testY;
    const distance = Math.sqrt((distX * distX) + (distY * distY));
    return (distance <= c.radius);
};
exports.correctedPositionFromSide = (from, to, side) => {
    const corrected = from.copy();
    switch (side) {
        // Collides with the "left" of [to]
        case 'left':
            {
                corrected.right = to.left;
            }
            break;
        // Collides with the "top" of [to]
        case 'top':
            {
                corrected.bottom = to.top;
            }
            break;
        // Collides with the "right" of [to]
        case 'right':
            {
                corrected.left = to.right;
            }
            break;
        // Collides with the "bottom" of [to]
        case 'bottom':
            {
                corrected.top = to.bottom;
            }
            break;
    }
    return corrected;
};
/**
 * Check a Rectangle collisions against a list of Rectangles
 * @returns a corrected position RectangleBody
 */
exports.rectangleToRectangles = (rectangle, rectangles) => {
    const corrected = rectangle.copy();
    let colliding = false;
    for (const item of rectangles) {
        if (exports.rectangleToRectangle(corrected, item)) {
            colliding = true;
            switch (exports.rectangleToRectangleSide(corrected, item)) {
                case 'left':
                    {
                        corrected.right = item.x;
                    }
                    break;
                case 'top':
                    {
                        corrected.bottom = item.top;
                    }
                    break;
                case 'right':
                    {
                        corrected.left = item.right;
                    }
                    break;
                case 'bottom':
                    {
                        corrected.top = item.bottom;
                    }
                    break;
            }
        }
    }
    return colliding ? corrected : null;
};
/**
 * Check a Circle collisions against a list of Rectangles
 * @returns a corrected position RectangleBody
 */
exports.circleToRectangles = (circle, rectangles) => {
    const corrected = circle.copy();
    let colliding = false;
    for (const item of rectangles) {
        if (exports.circleToRectangle(corrected, item)) {
            colliding = true;
            switch (exports.circleToRectangleSide(corrected, item)) {
                case 'left':
                    {
                        corrected.right = item.x;
                    }
                    break;
                case 'top':
                    {
                        corrected.bottom = item.top;
                    }
                    break;
                case 'right':
                    {
                        corrected.left = item.right;
                    }
                    break;
                case 'bottom':
                    {
                        corrected.top = item.bottom;
                    }
                    break;
            }
        }
    }
    return colliding ? corrected : null;
};
//# sourceMappingURL=utils.js.map