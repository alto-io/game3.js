/**
 * Get the angle in radiant between two points
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
export declare function calculateAngle(x1: number, y1: number, x2: number, y2: number): number;
/**
 * Lerp between two values
 * @param a
 * @param b
 * @param n
 */
export declare function lerp(a: number, b: number, n: number): number;
/**
 * Get the distance between two points
 * @param x
 * @param y
 * @param toX
 * @param toY
 */
export declare function getDistance(x: number, y: number, toX: number, toY: number): number;
/**
 * Get a random integer between min and max.
 * @param {number} min - min number
 * @param {number} max - max number
 */
export declare function getRandomInt(min: number, max: number): number;
/**
 * Clamp a value
 * @param value
 * @param min
 * @param max
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Round a floating number to 2 digits
 * @param value
 */
export declare function round2Digits(value: number): number;
/**
 * Normalize a vector
 * @param ax
 * @param ay
 */
export declare function normalize2D(ax: number, ay: number): number;
/**
 * Transform an angle in degrees to the nearest cardinal point.
 */
declare type Cardinal = 'E' | 'NE' | 'N' | 'NW' | 'W' | 'SW' | 'S' | 'SE';
export declare function degreeToCardinal(degree: number): Cardinal;
/**
 * Reverse a number between a range
 * @example
 * reverseNumber(1.2, 0, 3) // returns 1.8
 */
export declare function reverseNumber(num: number, min: number, max: number): number;
/**
 * Snap a position on a grid with TILE_SIZE cells
 * @param pos The position to snap
 * @param tileSize The tile size to snap to
 */
export declare function snapPosition(pos: number, tileSize: number): number;
/**
 * Shuffles an array
 */
export declare function shuffleArray(array: any[]): any[];
export {};
