import { CircleBody, RectangleBody } from '../geometry';
import { CollisionType } from './types';
declare const RBush: any;
/**
 * A R-Tree implementation handling Rectangle and Circle bodies
 */
export declare class TreeCollider extends RBush {
    collidesWithRectangle(body: RectangleBody, type?: CollisionType): boolean;
    collidesWithCircle(body: CircleBody, type?: CollisionType): boolean;
    searchWithRectangle(body: RectangleBody): any;
    searchWithCircle(body: CircleBody): any;
    correctWithRectangle(body: RectangleBody): RectangleBody;
    correctWithCircle(body: CircleBody): CircleBody;
    getAllByType(type: number): RectangleBody[];
}
export {};
