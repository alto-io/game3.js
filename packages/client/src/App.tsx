
import * as React from "react";
import Web3 from "web3";

import { convertUtf8ToHex } from "@walletconnect/utils";
import { Router } from '@reach/router';
import { v4 as uuidv4 } from 'uuid';

// Drizzle for state and contract interactions
import { DrizzleContext } from "@drizzle/react-plugin";

// WalletConnect
import WalletConnect from "@walletconnect/browser";
import Web3Modal, { providers } from "web3modal";

// Rimble
import RimbleWeb3 from "./rimble/RimbleWeb3";


// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider";

import { Database } from '@game3js/common';

import RimbleContainer from './components/RimbleContainer';

import {
  formatTestTransaction,
  getChainData,
  hashPersonalMessage,
  recoverPersonalSignature,
  recoverPublicKey,
} from "./helpers/utilities";

import { apiGetAccountAssets } from "./helpers/api";
import { getProfile, openBox } from "./helpers/box";
import { IAssetData, IBoxProfile } from "./helpers/types";


import {
  BOX_GET_PROFILE,
  DAI_BALANCE_OF,
  DAI_TRANSFER,
  ETH_SEND_TRANSACTION,
  ETH_SIGN,
  PERSONAL_SIGN
} from "./constants";

import { DEFAULT_ACTIVE_INDEX, DEFAULT_CHAIN_ID } from "./helpers/constants";
import appConfig from "./config";

import { callBalanceOf, callTransfer } from "./helpers/web3";
import { getAccounts, initWallet, updateWallet } from "./helpers/wallet";
import { getLocalDatabaseManager, getPlayerProfile } from "./helpers/database";

import Home from './scenes/Home';
import GameContainer from './scenes/GameContainer';
import Recorder from './scenes/Recorder';
import Tournaments from './scenes/Tournaments'
import Replay from './scenes/Replay';

import { Slide, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// app settings
const CREATE_WALLET_ON_GUEST_ACCOUNT = false;

export interface IAppState {
  playerProfile: Database.PlayerProfile;
  loading: boolean;
  scanner: boolean;
  connector: WalletConnect | null;
  uri: string;
  peerMeta: {
    description: string;
    url: string;
    icons: string[];
    name: string;
    ssl: boolean;
  };
  connected: boolean;
  chainId: number;
  accounts: string[];
  activeIndex: number;
  address: string;
  requests: any[];
  results: any[];
  payload: any;

  fetching: boolean;
  showModal: boolean;
  pendingRequest: boolean;
  result: any | null;
  assets: IAssetData[];
  web3: any;
  balance: any;
  provider: any;
  networkId: number;
  route: string;
}

const DEFAULT_ACCOUNTS = CREATE_WALLET_ON_GUEST_ACCOUNT
  ? getAccounts() : [];
const DEFAULT_ADDRESS = CREATE_WALLET_ON_GUEST_ACCOUNT
  ? DEFAULT_ACCOUNTS[DEFAULT_ACTIVE_INDEX] : "";


// Optional parameters to pass into RimbleWeb3
const RIMBLE_CONFIG = {
  // accountBalanceMinimum: 0.001,
  requiredNetwork: parseInt(process.env.REACT_APP_NETWORK_ID),
};

const INITIAL_STATE: IAppState = {
  playerProfile: {
    walletid: null,
    username: null,
    dbid: null
  },
  loading: false,
  scanner: false,
  connector: null,
  uri: "",
  peerMeta: {
    description: "",
    url: "",
    icons: [],
    name: "",
    ssl: false,
  },
  connected: false,
  chainId: appConfig.chainId || DEFAULT_CHAIN_ID,
  accounts: DEFAULT_ACCOUNTS,
  address: DEFAULT_ADDRESS,
  activeIndex: DEFAULT_ACTIVE_INDEX,
  requests: [],
  results: [],
  payload: null,

  fetching: false,
  showModal: false,
  pendingRequest: false,
  result: null,
  assets: [],
  web3: null,
  provider: null,
  balance: null,
  networkId: 1,
  route: 'Play'
};


function initWeb3(provider: any) {
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}

const preflightCheck = () => {
  if (window.ethereum) {
    window.ethereum.enable();
  }
};

class App extends React.Component<any, any> {
  // @ts-ignore
  public web3Modal: Web3Modal;
  public state: IAppState;
  public dbManager: Database.DBManager;
  public workerProxy: any;

  private getGuestConfigCallback = async (result) => {
 
    let id = "";

    console.log(result)

    if (result)
    {
        if (result.length > 0)
        {
          id = result[0].id
        }

        else 
        {
          id = result.id;
        }
        console.log("previous guest account found: " + id);
    }

    else 
    {
        const guestConfig: Database.GuestConfig = {
            id: uuidv4()
        }

        await this.dbManager.saveGuestConfig(guestConfig)

        console.log("created account: " + guestConfig.id)
        id = guestConfig.id
    }
  
  
    const playerProfile = {
      username: id && `Guest-${id.substr(id.length - 4)}`,
      dbid: id
    }

    await this.setState({
      playerProfile
    })  
  }

  public initDatabase = async () => {
    this.dbManager = await getLocalDatabaseManager();
    await this.dbManager.getGuestConfig(this.getGuestConfigCallback);

    // this.dbManager.node.bootstrap.add(undefined, { default: true });
    // console.log(await this.dbManager.node.bootstrap.list());
    // console.log(await this.dbManager.node.id());
    // console.log(await this.dbManager.node.swarm.peers());
    // this.getGuestProfile();

    // this.workerProxy = new WorkerProxy(this);    
  }

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "b71d4cce6c0c4f2ebaecc118a35dfaf5"
          }
        }
      }
    });

    // DEBUG INFO
    console.log(props);
    console.log(process.env);
  }

  public componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }

    this.initDatabase();
  }

  public getLoggedInPlayerProfile = async () => {
    const { playerProfile } = this.state;
    const walletid = playerProfile.walletid

    await this.setState({ fetching: true });
    try {
      var serverPlayerProfile = await getPlayerProfile(playerProfile);

      if (serverPlayerProfile)
      {
        serverPlayerProfile.walletid = walletid
        await this.setState({ playerProfile: serverPlayerProfile });

        toast.info('🤗 Welcome back, ' + serverPlayerProfile.username + '!');

      }
    } catch (error) {
      console.error(error);
    }
    await this.setState({ fetching: false });
  }


  public onConnect = async () => {
    const provider = await this.web3Modal.connect();

    await this.subscribeProvider(provider);

    const web3: any = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId
    });

    await this.getBalance();

    // set the walletid to the loggedin Address
    // const { playerProfile } = this.state;
    // playerProfile.walletid = address;
    // await this.setState( { playerProfile });
    // this.getLoggedInPlayerProfile();
  };

  public subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await this.setState({ address: accounts[0] });
      await this.getBalance();
    });
    provider.on("chainChanged", async (chainId: number) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      await this.setState({ chainId, networkId });
      await this.getBalance();
    });

    provider.on("networkChanged", async (networkId: number) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
      await this.getBalance();
    });
  };

  public getNetwork = () => getChainData(this.state.chainId).network;

  public getProviderOptions = () => {
    const infuraId = (process.env.NODE_ENV === "production" ? "b71d4cce6c0c4f2ebaecc118a35dfaf5" : process.env.REACT_APP_INFURA_ID)
        
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId
        }
      }
    };
    return providerOptions;
  };

  public getBalance = async () => {
    const { address, web3, balance } = this.state;
    let newBalance;

    if (address && web3) {
      newBalance = await web3.eth.getBalance(address);
    }

    if (newBalance !== balance) {
      this.setState({ balance : newBalance })
    }
  }

  public resetApp = async () => {
    const { web3, address, connected, balance } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
    console.log(web3, address, connected, balance);
    await this.dbManager.getGuestConfig(this.getGuestConfigCallback);
  };

  public setRoute = (inputRoute) => {
    this.setState({ route: inputRoute })
  }

  public render = () => {
    const {
      playerProfile,
      address,
      connected,
      chainId,
      fetching,
      showModal,
      pendingRequest,
      result,
      web3,
      balance
    } = this.state;

    console.log(address, balance);
    return (
    <RimbleWeb3 config={RIMBLE_CONFIG}>
      <RimbleWeb3.Consumer>
          {({
            needsPreflight,
            validBrowser,
            userAgent,
            web3,
            account,
            accountBalance,
            accountBalanceLow,
            initAccount,
            rejectAccountConnect,
            userRejectedConnect,
            accountValidated,
            accountValidationPending,
            rejectValidation,
            userRejectedValidation,
            validateAccount,
            connectAndValidateAccount,
            contractMethodSendWrapper,            
            modals,
            network,
            transaction,
            web3Fallback
          }) => ( 
        <DrizzleContext.Provider drizzle={this.props.drizzle}>
            <ToastContainer
              position="bottom-right"
              transition={ Slide }
              pauseOnHover={ false } />
            <DrizzleContext.Consumer>
            {({ drizzleState }) => {
                return (
                  <>


                  <RimbleContainer
                        drizzle={this.props.drizzle}
                        drizzleState={drizzleState}
                        account={account}
                        accountBalance={accountBalance}
                        accountBalanceLow={accountBalanceLow}
                        accountValidated={accountValidated}
                        connectAndValidateAccount={connectAndValidateAccount}    
                        onConnect={this.onConnect}
                        killSession={this.resetApp}  
                        address={address}
                        connected={connected}
                        balance={balance}
                  />

                    <Router>
                      <Home
                        default={true}
                        playerProfile={playerProfile}
                        connected={connected}
                        path="/"
                        drizzle={this.props.drizzle}
                        drizzleState={drizzleState}
                        contractMethodSendWrapper={contractMethodSendWrapper}
                        account={account}
                        accountValidated={accountValidated}
                        connectAndValidateAccount={connectAndValidateAccount}
                        route={this.state.route}
                        setRoute={this.setRoute}
                      />

                      <GameContainer
                        path="game/*"
                        address={account}
                        accountValidated={accountValidated}
                        connectAndValidateAccount={connectAndValidateAccount}
                        drizzle={this.props.drizzle}
                        drizzleState={drizzleState}
                        contractMethodSendWrapper={contractMethodSendWrapper}
                        setRoute={this.setRoute}
                        >
                      </GameContainer>

                      <Replay
                        path="/replay"
                        playerProfile={ playerProfile }
                      />
                      <Recorder
                        path="/recorder"
                        propVar={ connected }
                      />
                      <Tournaments
                        path="/tournaments"
                        web3={web3}
                        address={address}
                        playerProfile={playerProfile}
                      />
                    </Router>
                  </>
                  );
              }}
              </DrizzleContext.Consumer>
          </DrizzleContext.Provider>
            )}
        </RimbleWeb3.Consumer>       
    </RimbleWeb3>
    );
  };
}

export default App;