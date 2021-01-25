import { PlayerProfile } from './playerprofile';
import { GuestConfig } from './guestconfig';
import { DBManager } from './dbmanager';
import { TournamentData } from './tournamentdata';
export declare class MinimongoDBManager implements DBManager {
    db: any;
    REPO: string;
    node: any;
    orbitdb: any;
    defaultOptions: any;
    config: any;
    leaderboardEntries: any;
    user: any;
    tournaments: any;
    start(): Promise<void>;
    initializeData(): Promise<void>;
    refreshLeaderboard(): Promise<void>;
    getPlayerProfile(walletid: any): Promise<void>;
    getLeaderboard(): Promise<any>;
    savePlayerProfile(playerProfile: PlayerProfile): Promise<void>;
    getTournamentData(tournamentId: any): Promise<void>;
    putTournamentData(tournamentData: TournamentData): Promise<any>;
    getGuestConfig(callback?: any): Promise<void>;
    saveGuestConfig(guestConfig: GuestConfig): Promise<void>;
    localSaveReplay(playerId: string, tournamentId: string, time: number, file: File): Promise<void>;
    getFileFromHash(hash: string): Promise<any>;
    serverPutGameReplay(reqBody: any): void;
}
