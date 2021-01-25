import { Types } from '..';
import { Circle } from './circle';
export declare class Player extends Circle {
    playerId: string;
    name: string;
    lives: number;
    maxLives: number;
    team: Types.Teams;
    color: string;
    kills: number;
    rotation: number;
    address: string;
    lastShootAt: number;
    constructor(playerId: string, x: number, y: number, radius: number, lives: number, maxLives: number, name: string, address: string, team?: Types.Teams);
    move(dirX: number, dirY: number, speed: number): void;
    hurt(): void;
    heal(): void;
    canBulletHurt(otherPlayerId: string, team?: string): boolean;
    readonly isAlive: boolean;
    readonly isFullLives: boolean;
    setPosition(x: number, y: number): void;
    setRotation(rotation: number): void;
    setLives(lives: number): void;
    setName(name: string): void;
    setTeam(team: Types.Teams): void;
    setKills(kills: number): void;
}
