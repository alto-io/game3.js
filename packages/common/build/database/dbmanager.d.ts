import { PlayerProfile } from './playerprofile';
import { GuestConfig } from './guestconfig';
export interface DBManager {
    start(): any;
    getGuestConfig(callback?: any): any;
    saveGuestConfig(guestConfig: GuestConfig): any;
    getFileFromHash(hash: string): any;
    localSaveReplay(playerId: string, tournamentId: string, time: number, recordedBlobs: any): any;
    getPlayerProfile(walletid: string): any;
    savePlayerProfile(playerProfile: PlayerProfile): any;
    getLeaderboard(): any;
    putTournamentData(reqBody: any): any;
    getTournamentData(tournamentId: string): any;
    serverPutGameReplay(reqBody: any): any;
}
