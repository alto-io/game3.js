import { CircleBody, RectangleBody } from '../geometry';
/**
 * Return which side of the second Rectangle the first collides with
 */
export declare const rectangleToRectangleSide: (r1: RectangleBody, r2: RectangleBody) => string;
/**
 * Return which side of the Rectangle is the Circle colliding with
 */
export declare const circleToRectangleSide: (c: CircleBody, r: RectangleBody) => string;
/**
 * Rectangle to Rectangle
 */
export declare const rectangleToRectangle: (r1: RectangleBody, r2: RectangleBody) => boolean;
/**
 * Circle to Circle
 */
export declare const circleToCircle: (c1: CircleBody, c2: CircleBody) => boolean;
/**
 * Circle to Rectangle
 */
export declare const circleToRectangle: (c: CircleBody, r: RectangleBody) => boolean;
export declare const correctedPositionFromSide: (from: RectangleBody, to: RectangleBody, side: string) => RectangleBody;
/**
 * Check a Rectangle collisions against a list of Rectangles
 * @returns a corrected position RectangleBody
 */
export declare const rectangleToRectangles: (rectangle: RectangleBody, rectangles: RectangleBody[]) => RectangleBody;
/**
 * Check a Circle collisions against a list of Rectangles
 * @returns a corrected position RectangleBody
 */
export declare const circleToRectangles: (circle: CircleBody, rectangles: RectangleBody[]) => CircleBody;
