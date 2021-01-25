import { CircleBody, RectangleBody, Vector } from '../geometry';
export declare class Map {
    width: number;
    height: number;
    constructor(width: number, height: number);
    isVectorOutside(x: number, y: number): boolean;
    isRectangleOutside: (rectangle: RectangleBody) => boolean;
    isCircleOutside: (circle: CircleBody) => boolean;
    clampRectangle(rectangle: RectangleBody): Vector;
    clampCircle(circle: CircleBody): Vector;
    setDimensions(width: number, height: number): void;
}
