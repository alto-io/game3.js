import { IJsonRpcRequest } from "@walletconnect/types";
import { IAppState } from "../App";

export interface IAssetData {
  symbol: string;
  name: string;
  decimals: string;
  contractAddress: string;
  balance?: string;
}

export interface IChainData {
  name: string;
  short_name: string;
  chain: string;
  network: string;
  chain_id: number;
  network_id: number;
  rpc_url: string;
  native_currency: IAssetData;
}

export interface ITxData {
  from: string;
  to: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  value: string;
  data: string;
}

export interface IBlockScoutTx {
  value: string;
  txreceipt_status: string;
  transactionIndex: string;
  to: string;
  timeStamp: string;
  nonce: string;
  isError: string;
  input: string;
  hash: string;
  gasUsed: string;
  gasPrice: string;
  gas: string;
  from: string;
  cumulativeGasUsed: string;
  contractAddress: string;
  confirmations: string;
  blockNumber: string;
  blockHash: string;
}

export interface IBlockScoutTokenTx {
  value: string;
  transactionIndex: string;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimal: string;
  to: string;
  timeStamp: string;
  nonce: string;
  input: string;
  hash: string;
  gasUsed: string;
  gasPrice: string;
  gas: string;
  from: string;
  cumulativeGasUsed: string;
  contractAddress: string;
  confirmations: string;
  blockNumber: string;
  blockHash: string;
}

export interface IParsedTx {
  timestamp: string;
  hash: string;
  from: string;
  to: string;
  nonce: string;
  gasPrice: string;
  gasUsed: string;
  fee: string;
  value: string;
  input: string;
  error: boolean;
  asset: IAssetData;
  operations: ITxOperation[];
}

export interface ITxOperation {
  asset: IAssetData;
  value: string;
  from: string;
  to: string;
  functionName: string;
}

export interface IGasPricesResponse {
  fastWait: number;
  avgWait: number;
  blockNum: number;
  fast: number;
  fastest: number;
  fastestWait: number;
  safeLow: number;
  safeLowWait: number;
  speed: number;
  block_time: number;
  average: number;
}

export interface IGasPrice {
  time: number;
  price: number;
}

export interface IGasPrices {
  timestamp: number;
  slow: IGasPrice;
  average: IGasPrice;
  fast: IGasPrice;
}

export interface IMethodArgument {
  type: string;
}

export interface IMethod {
  signature: string;
  name: string;
  args: IMethodArgument[];
}

export interface IRequestRenderParams {
  label: string;
  value: string;
}

export interface IRpcEngine {
  filter: (payload: IJsonRpcRequest) => boolean;
  router: (payload: IJsonRpcRequest, state: IAppState, setState: any) => Promise<void>;
  render: (payload: IJsonRpcRequest) => IRequestRenderParams[];
  signer: (payload: IJsonRpcRequest, state: IAppState, setState: any) => Promise<void>;
}

export interface IAppEvents {
  init: (state: IAppState, setState: any) => Promise<void>;
  update: (state: IAppState, setState: any) => Promise<void>;
}

export interface IAppConfig {
  name: string;
  logo: string;
  chainId: number;
  derivationPath: string;
  numberOfAccounts: number;
  colors: {
    defaultColor: string;
    backgroundColor: string;
  };
  chains: IChainData[];
  styleOpts: {
    showPasteUri: boolean;
    showVersion: boolean;
  };
  rpcEngine: IRpcEngine;
  events: IAppEvents;
}
