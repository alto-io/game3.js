export declare class Vector {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    /**
     * Set the x and y coordinates
     */
    set(x: number, y: number): void;
    /**
     * Return wether this vector is at (0,0) or not
     */
    readonly empty: boolean;
}
/**
 * An object to represent a Rectangle shape
 */
export declare class RectangleBody {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    /**
     * Return a copy of this object
     */
    copy(): RectangleBody;
    left: number;
    top: number;
    right: number;
    bottom: number;
    position: Vector;
    readonly center: Vector;
}
/**
 * An object to represent a Circle shape
 */
export declare class CircleBody {
    x: number;
    y: number;
    radius: number;
    constructor(x: number, y: number, radius: number);
    /**
     * Return a copy of this object
     */
    copy(): CircleBody;
    left: number;
    top: number;
    right: number;
    bottom: number;
    readonly width: number;
    readonly height: number;
    readonly box: RectangleBody;
}
