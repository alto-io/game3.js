import axios, { AxiosInstance } from "axios";
import { Constants, Database } from '@game3js/common';
import { spawn, Thread, Worker } from 'threads'

const host = window.document.location.host.replace(/:.*/, '');
const port = process.env.NODE_ENV !== 'production' ? Constants.WS_PORT : window.location.port;
const url = window.location.protocol + "//" + host + (port ? ':' + port : '');

const api: AxiosInstance = axios.create({
  baseURL: url,
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const DATABASE_TYPES = ['main_thread_orbitdb', 'worker_orbitdb', 'minimongodb'];
export type DatabaseType = 'main_thread_orbitdb' | 'worker_orbitdb' | 'minimongodb';


const dbType: DatabaseType = 'main_thread_orbitdb';

let dbManager;

export async function getLocalDatabaseManager(): Promise<Database.DBManager> {


  switch (dbType)
  {
    case 'minimongodb':
        dbManager = new Database.MinimongoDBManager();
        dbManager.start();
      break;

    case 'main_thread_orbitdb':
        dbManager = new Database.OrbitDBManager();
        await dbManager.start();
      break;

      case 'worker_orbitdb':
        dbManager = new Database.OrbitDBManager();

        const thread = await spawn(new Worker("../workers/db.worker"))
        const ipfsNode = await thread.getIPFSNode();
        await dbManager.start(ipfsNode);
      break;
    default:
      break;
  }

  return dbManager;
}


// Database API calls
export async function getServerPlayerProfile(playerProfile: Database.PlayerProfile): Promise<any> {
  const response = await api.get('/profile?walletid=' + playerProfile.walletid);
  return response.data;
}

export async function updateServerPlayerProfile(playerProfile: Database.PlayerProfile): Promise<any> {
  const response = await api.post('/profile', playerProfile);
  const { result } = response.data;
  return result;
}

export async function getTournamentData(tournamentData: Database.TournamentData): Promise<any> {
  const response = await api.get('/tournament?tournamentId=' + tournamentData.id);
  return response.data;
}

export async function getTournamentResult(tournamentId: number): Promise<any> {
  const params = {
    tournamentId
  }
  const response = await api.get('/tournament/results', {params});
  return response.data;
}

export async function putTournamentData(tournamentData: Database.TournamentData): Promise<any> {
  const response = await api.post('/tournament', tournamentData);
  const { result } = response.data;
  return result;
}

export async function clientSaveTournamentReplay(file: File) {
  const result = await dbManager.clientSaveTournamentReplay(file)
  return result
}

export async function putGameReplay(sessionId, playerAddress, fileHash): Promise<any> {
  const body = {
    sessionId, playerAddress, fileHash
  }
  const response = await api.post('/gameReplay', body);
  console.log(response)
  const { result } = response.data;
  return result;
}

export async function getGameSession(gameSessionId, playerAddress, tournamentId): Promise<any> {
  const params = {
    sessionId: gameSessionId,
    playerAddress,
    tournamentId
  }
  const response = await api.get('/gameSession', { params })
  return response.data
}

export async function getGameNo(gameSessionId, playerAddress, tournamentId): Promise<any> {
  const params = {
    sessionId: gameSessionId,
    playerAddress,
    tournamentId
  }
  const response = await api.get('/gameSession/gameNo', { params })
  return response.data
}

export async function createSessionId(playerAddress, tournamentId): Promise<any> {
  const params = {
    playerAddress,
    tournamentId
  }

  const response = await api.post('/gameSessionId/create', { params })
  return response.data
}

export async function getGameSessionId(playerAddress, tournamentId): Promise<any> {
  const params = {
    playerAddress,
    tournamentId
  }

  const response = await api.get('/gameSessionId', { params })
  return response.data
}

export async function deleteGameSessionId(gameSessionId): Promise<any> {
  const params = {
    gameSessionId
  }

  const response = await api.delete('/gameSessionId/delete', { params })
  return response.data
}

export async function updateSessionScore(gameSessionId, playerAddress, tournamentId): Promise<any> {
  const params = {
    sessionId: gameSessionId,
    playerAddress,
    tournamentId
  }

  const res = await api.post('/gameSession/score', params);
  return res.data;
}

export async function updateGameNo(sessionId, playerAddress, tournamentId) {
  const params = {
    sessionId,
    playerAddress,
    tournamentId
  }

  const res = await api.post('/gameSession/gameNo', params);
  return res.data;
}

export async function makeNewGameSession(playerAddress, tournamentId, players, endsAt): Promise<any> {
  let timeLeft = endsAt - Date.now()
  const params = {
    playerAddress,
    tournamentId, 
    timeLeft, 
    players
  }

  const res = await api.post('/gameSession/new', params);
  return res.data
}

// Local Database Calls
export async function localSaveReplay(playerId: string, tournamentId: string, time: number, file: File) {
  const result = await dbManager.localSaveReplay(playerId, tournamentId, time, file);
  return result;
}

export async function refreshLeaderboard() : Promise<Array<Database.LeaderboardEntry>> {
 const result = await dbManager.refreshLeaderboard();
 return result;
}

export async function getFileFromHash(hash: string) {
  const result = await dbManager.getFileFromHash(hash);
  return result;
}

export async function getPlayerProfile(playerProfile: Database.PlayerProfile): Promise<any> {
  const response = await dbManager.getPlayerProfile(playerProfile.walletid);
  return response;
}

export async function updatePlayerProfile(playerProfile: Database.PlayerProfile): Promise<any> {
  const response = await dbManager.savePlayerProfile(playerProfile);
  return response;
}

export async function saveTournamentReplay(playerId: string, tournamentId: string, time: number, file: File) {
  console.log(`saveTournamentReplay: tournamentId: ${tournamentId}`)
  const result = await dbManager.saveTournamentReplay(playerId, tournamentId, time, file);
  console.log('result:')
  console.log(result)
  console.log('------')
  return result;
}

export async function resetData(): Promise<any> {
  await api.delete('/deleteDBS');
}