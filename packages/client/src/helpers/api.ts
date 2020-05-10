import axios, { AxiosInstance } from "axios";
import { IJsonRpcRequest } from "@walletconnect/types";
import { IAssetData, IGasPrices, IParsedTx } from "./types";
import { payloadId, getChainData } from "./utilities";

const api: AxiosInstance = axios.create({
  baseURL: "https://ethereum-api.xyz",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const apiSendTransaction = async (txParams: any, chainId: number): Promise<number> => {
  const rpcUrl = getChainData(chainId).rpc_url;

  if (!rpcUrl && typeof rpcUrl !== "string") {
    throw new Error("Invalid or missing rpc url");
  }

  const response = await axios.post(rpcUrl, {
    jsonrpc: "2.0",
    id: payloadId(),
    method: "eth_sendTransaction",
    params: [txParams],
  });

  const result = response.data.result;
  return result;
};

export async function apiGetAccountAssets(address: string, chainId: number): Promise<IAssetData[]> {
  const response = await api.get(`/account-assets?address=${address}&chainId=${chainId}`);
  const { result } = response.data;
  return result;
}

export async function apiGetAccountTransactions(
  address: string,
  chainId: number,
): Promise<IParsedTx[]> {
  const response = await api.get(`/account-transactions?address=${address}&chainId=${chainId}`);
  const { result } = response.data;
  return result;
}

export const apiGetAccountNonce = async (address: string, chainId: number): Promise<string> => {
  const response = await api.get(`/account-nonce?address=${address}&chainId=${chainId}`);
  const { result } = response.data;
  return result;
};

export const apiGetGasPrices = async (): Promise<IGasPrices> => {
  const response = await api.get(`/gas-prices`);
  const { result } = response.data;
  return result;
};

export const apiGetBlockNumber = async (chainId: number): Promise<IGasPrices> => {
  const response = await api.get(`/block-number?chainId=${chainId}`);
  const { result } = response.data;
  return result;
};

export const apiGetCustomRequest = async (
  chainId: number,
  customRpc: Partial<IJsonRpcRequest>,
): Promise<any> => {
  const response = await api.post(`config-request?chainId=${chainId}`, customRpc);
  const { result } = response.data;
  return result;
};
