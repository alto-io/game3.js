import { Circle } from './circle';
export declare class Bullet extends Circle {
    playerId: string;
    team: string;
    rotation: number;
    fromX: number;
    fromY: number;
    active: boolean;
    color: string;
    shotAt: number;
    constructor(playerId: string, team: string, x: number, y: number, radius: number, rotation: number, color: string, shotAt: number);
    move(speed: number): void;
    reset(playerId: string, team: string, x: number, y: number, radius: number, rotation: number, color: string, shotAt: number): void;
}
