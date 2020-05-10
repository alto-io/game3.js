import axios, { AxiosInstance } from "axios";
import { Constants, Database } from "@game3js/common";


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


export async function getLocalDatabaseManager(): Promise<Database.OrbitDBManager> {

 const dbManager = new Database.OrbitDBManager();
 await dbManager.start();

 return dbManager;
}

export async function getPlayerProfile(playerProfile: Database.PlayerProfile): Promise<any> {
  const response = await api.get('/profile?walletid=' + playerProfile.walletid);
  return response.data;
}

export async function updatePlayerProfile(playerProfile: Database.PlayerProfile): Promise<any> {
  const response = await api.post('/profile', playerProfile);
  const { result } = response.data;
  return result;
}
