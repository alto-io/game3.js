import { PlayerProfile } from './playerprofile';
import { GuestConfig } from './guestconfig';
import { DBManager } from './dbmanager';
import { TournamentData } from './tournamentdata';
export declare class OrbitDBManager implements DBManager {
    REPO: string;
    node: any;
    orbitdb: any;
    defaultOptions: any;
    guest: any;
    leaderboardEntries: any;
    user: any;
    tournaments: any;
    tournamentResults: any;
    gameSessions: any;
    gameSessionIds: any;
    defaultServerOptions: {
        relay: {
            enabled: boolean;
            hop: {
                enabled: boolean;
                active: boolean;
            };
        };
        EXPERIMENTAL: {
            pubsub: boolean;
        };
        repo: string;
        preload: {
            enabled: boolean;
        };
        config: {
            Addresses: {
                Swarm: string[];
            };
        };
    };
    start(ipfsNode?: any): Promise<void>;
    loadFixtureData(fixtureData: any): Promise<void>;
    initializeData(): Promise<void>;
    refreshClientData(): Promise<void>;
    refreshLeaderboard(): Promise<any>;
    initializeServerData(): Promise<void>;
    getPlayerProfile(walletid: any): Promise<any>;
    getLeaderboard(): Promise<any>;
    savePlayerProfile(playerProfile: PlayerProfile): Promise<any>;
    getTournamentData(tournamentId: any): Promise<any>;
    putTournamentData(tournamentData: TournamentData): Promise<any>;
    getGuestConfig(callback?: any): Promise<void>;
    saveGuestConfig(guestConfig: GuestConfig): Promise<void>;
    localSaveReplay(playerId: string, tournamentId: string, time: number, file: File): Promise<void>;
    getFileFromHash(hash: string): Promise<any>;
    clientSaveTournamentReplay(file: File): Promise<any>;
    serverPutGameReplay(requestBody: any): Promise<{
        result: any;
    }>;
    serverPutGameSession(sessionId: any, sessionData: any): Promise<{
        result: any;
    }>;
    serverUpdateScore(sessionId: any, playerAddress: any, tournamentId: any, gamePayload: any): Promise<false | {
        result: any;
        newHighScore: boolean;
    } | {
        result: string;
    }>;
    updateGameNumber(sessionId: any, playerAddress: any, tournamentId: any): Promise<false | {
        result: any;
    }>;
    makeNewGameSession(gameName: any, sessionId: any, tournamentId: any, gamePayload: any): Promise<boolean>;
    serverGetGameSession(sessionId: any, playerAddress: any, tournamentId: any): Promise<any>;
    getGameNo(gameSessionId: any, playerAddress: any, tournamentId: any): Promise<any>;
    serverCreateSessionId(playerAddress: any, tournamentId: any): Promise<any>;
    getGameSessionId(playerAddress: any, tournamentId: any): Promise<any>;
    getTournamentResult(tournamentId: any): Promise<any>;
    deleteSessionId(sessionId: any): Promise<void>;
    deleteAllData(): Promise<void>;
    newTournament(tournament: any): Promise<void>;
    updateTournament(tournamentId: any, updatedData: any): Promise<boolean>;
    getTournaments(): Promise<any>;
    getTournament(tournamentId: any): Promise<any>;
    getTourneyWinners(tournamentId: any): Promise<any[]>;
    private handleCreatePlayerDataScoreType;
    private handleCreatePlayerDataTOSIOS;
    private tosiosHighScoreHandler;
    private fpHighScoreHandler;
    private womHighScoreHandler;
}
