import { Schema } from '@colyseus/schema';
import { Geometry } from '..';
export declare class Circle extends Schema {
    x: number;
    y: number;
    radius: number;
    constructor(x: number, y: number, radius: number);
    readonly body: Geometry.CircleBody;
}
