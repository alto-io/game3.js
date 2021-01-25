import { MapSchema, Schema } from '@colyseus/schema';
import { Types } from '..';
import { Message } from '.';
import { Player } from './player';
import { Monster } from './monster';
export interface IGame {
    mapName: string;
    maxPlayers: number;
    mode: Types.GameMode;
    onWaitingStart: (message?: Message) => void;
    onLobbyStart: (message?: Message) => void;
    onGameStart: (message?: Message) => void;
    onGameEnd: (message?: Message) => void;
}
export declare class Game extends Schema {
    state: Types.GameState;
    mapName: string;
    lobbyEndsAt: number;
    gameEndsAt: number;
    maxPlayers: number;
    mode: Types.GameMode;
    private onWaitingStart;
    private onLobbyStart;
    private onGameStart;
    private onGameEnd;
    constructor(attributes: IGame);
    update(players: MapSchema<Player>, monsters: MapSchema<Monster>): void;
    updateWaiting(players: MapSchema<Player>): void;
    updateLobby(players: MapSchema<Player>): void;
    updateGame(players: MapSchema<Player>, monsters: MapSchema<Monster>): void;
    startWaiting(): void;
    startLobby(): void;
    startGame(): void;
}
