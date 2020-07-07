import { PlayerProfile } from './playerprofile'
import { GuestConfig } from './guestconfig'

export interface DBManager {
    start();
    getGuestConfig(callback?);
    saveGuestConfig(guestConfig: GuestConfig);
    getFileFromHash(hash: string);
    localSaveReplay(playerId: string, tournamentId: string, time: number, recordedBlobs: any);
    getPlayerProfile(walletid: string);
    savePlayerProfile(playerProfile: PlayerProfile);
}