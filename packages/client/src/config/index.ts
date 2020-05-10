import walletconnectLogo from "./assets/walletconnect-logo.png";
import { MAINNET_CHAIN_ID, ETH_STANDARD_PATH } from "../helpers/constants";
import supportedChains from "../helpers/chains";
import { IAppConfig } from "../helpers/types";
import RpcEngine from "./rpcEngine";
import ethereum from "./rpcEngine/ethereum";

const appConfig: IAppConfig = {
  name: "WalletConnect",
  logo: walletconnectLogo,
  chainId: MAINNET_CHAIN_ID,
  derivationPath: ETH_STANDARD_PATH,
  numberOfAccounts: 3,
  colors: {
    defaultColor: "12, 12, 13",
    backgroundColor: "40, 44, 52",
  },
  chains: supportedChains,
  styleOpts: {
    showPasteUri: true,
    showVersion: true,
  },
  rpcEngine: new RpcEngine([ethereum]),
  events: {
    init: (state, setState) => Promise.resolve(),
    update: (state, setState) => Promise.resolve(),
  },
};

export default appConfig;
