import { Client, Room } from 'colyseus';
import { Types } from '..';
import { GameState } from '../states/GameState';
export declare class ShooterGameRoom extends Room<GameState> {
    onCreate(options: Types.IRoomOptions): void;
    onJoin(client: Client, options: Types.IPlayerOptions): void;
    onLeave(client: Client): void;
    onDispose(): void;
    handleTick: () => void;
    handleMessage: (message: any) => void;
}
