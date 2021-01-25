import { Types } from '..';
import { Rectangle } from './rectangle';
export declare class Prop extends Rectangle {
    type: Types.PropType;
    active: boolean;
    constructor(propType: Types.PropType, x: number, y: number, width: number, height: number);
}
