
import * as React from "react";
import Web3 from "web3";

import { convertUtf8ToHex } from "@walletconnect/utils";
import { Router } from '@reach/router';
import { v4 as uuidv4 } from 'uuid';

// Drizzle for state and contract interactions
import { DrizzleContext } from "@drizzle/react-plugin";

// WalletConnect
import WalletConnect from "@walletconnect/browser";
import Web3Modal from "web3modal";

// Rimble
import RimbleWeb3 from "./rimble/RimbleWeb3";


// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider";

import { Database } from '@game3js/common';

import { View } from './components';

import Header from "./components/Header";

import PrimaryCard from "./components/PrimaryCard";
import WalletBlock from './components/WalletBlock';
import HeaderNav from "./components/HeaderNav";

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
import Game from './scenes/Game';
import GameUnity from './scenes/GameUnity';
import Recorder from './scenes/Recorder';
import Tournaments from './scenes/Tournaments'
import Replay from './scenes/Replay';

import { Slide, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import WorkerProxy from './utils/worker-proxy'

require('dotenv').config()

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
  provider: any;
  networkId: number;
}

const DEFAULT_ACCOUNTS = CREATE_WALLET_ON_GUEST_ACCOUNT
  ? getAccounts() : [];
const DEFAULT_ADDRESS = CREATE_WALLET_ON_GUEST_ACCOUNT
  ? DEFAULT_ACCOUNTS[DEFAULT_ACTIVE_INDEX] : "";


// Optional parameters to pass into RimbleWeb3
const RIMBLE_CONFIG = {
  // accountBalanceMinimum: 0.001,
  requiredNetwork: 5777 // ganache
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
  networkId: 1
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
      providerOptions: this.getProviderOptions(),
      theme: "dark"
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
    // await this.getAccountAssets();

    // set the walletid to the loggedin Address
    const { playerProfile } = this.state;
    playerProfile.walletid = address;
    await this.setState( { playerProfile });
    this.getLoggedInPlayerProfile();
  };

  public subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await this.setState({ address: accounts[0] });
      await this.getAccountAssets();
    });
    provider.on("chainChanged", async (chainId: number) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });

    provider.on("networkChanged", async (networkId: number) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
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

  public getAccountAssets = async () => {
    const { address, chainId } = this.state;
    this.setState({ fetching: true });
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);

      await this.setState({ fetching: false, assets });
    } catch (error) {
      console.error(error); // tslint:disable-line
      await this.setState({ fetching: false });
    }
  };

  public toggleModal = () =>
    this.setState({ showModal: !this.state.showModal });

  public testSendTransaction = async () => {
    const { web3, address, chainId } = this.state;

    if (!web3) {
      return;
    }

    const tx = await formatTestTransaction(address, chainId);

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // @ts-ignore
      function sendTransaction(_tx: any) {
        return new Promise((resolve, reject) => {
          web3.eth
            .sendTransaction(_tx)
            .once("transactionHash", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
        });
      }

      // send transaction
      const result = await sendTransaction(tx);

      // format displayed result
      const formattedResult = {
        action: ETH_SEND_TRANSACTION,
        txHash: result,
        from: address,
        to: address,
        value: "0 ETH"
      };

      // display result
      this.setState({
        web3,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null });
    }
  };

  public testSignMessage = async () => {
    const { web3, address } = this.state;

    if (!web3) {
      return;
    }

    // test message
    const message = "My email is john@doe.com - 1537836206101";

    // hash message
    const hash = hashPersonalMessage(message);

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // send message
      const result = await web3.eth.sign(hash, address);

      // verify signature
      const signer = recoverPublicKey(result, hash);
      const verified = signer.toLowerCase() === address.toLowerCase();

      // format displayed result
      const formattedResult = {
        action: ETH_SIGN,
        address,
        signer,
        verified,
        result
      };

      // display result
      this.setState({
        web3,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null });
    }
  };

  public testSignPersonalMessage = async () => {
    const { web3, address } = this.state;

    if (!web3) {
      return;
    }

    // test message
    const message = "My email is john@doe.com - 1537836206101";

    // encode message (hex)
    const hexMsg = convertUtf8ToHex(message);

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // send message
      const result = await web3.eth.personal.sign(hexMsg, address);

      // verify signature
      const signer = recoverPersonalSignature(result, message);
      const verified = signer.toLowerCase() === address.toLowerCase();

      // format displayed result
      const formattedResult = {
        action: PERSONAL_SIGN,
        address,
        signer,
        verified,
        result
      };

      // display result
      this.setState({
        web3,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null });
    }
  };

  public testContractCall = async (functionSig: string) => {
    let contractCall = null;
    switch (functionSig) {
      case DAI_BALANCE_OF:
        contractCall = callBalanceOf;
        break;
      case DAI_TRANSFER:
        contractCall = callTransfer;
        break;

      default:
        break;
    }

    if (!contractCall) {
      throw new Error(
        `No matching contract calls for functionSig=${functionSig}`
      );
    }

    const { web3, address, chainId } = this.state;
    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // send transaction
      const result = await contractCall(address, chainId, web3);

      // format displayed result
      const formattedResult = {
        action: functionSig,
        result
      };

      // display result
      this.setState({
        web3,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null });
    }
  };

  public testOpenBox = async () => {
    function getBoxProfile(
      address: string,
      provider: any
    ): Promise<IBoxProfile> {
      return new Promise(async (resolve, reject) => {
        try {
          await openBox(address, provider, async () => {
            const profile = await getProfile(address);
            resolve(profile);
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    const { address, provider } = this.state;

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // send transaction
      const profile = await getBoxProfile(address, provider);

      let result = null;
      if (profile) {
        result = {
          name: profile.name,
          description: profile.description,
          job: profile.job,
          employer: profile.employer,
          location: profile.location,
          website: profile.website,
          github: profile.github
        };
      }

      // format displayed result
      const formattedResult = {
        action: BOX_GET_PROFILE,
        result
      };

      // display result
      this.setState({
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ pendingRequest: false, result: null });
    }
  };

  public resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
    await this.dbManager.getGuestConfig(this.getGuestConfigCallback);
  };

  public render = () => {
    const {
      playerProfile,
      assets,
      address,
      connected,
      chainId,
      fetching,
      showModal,
      pendingRequest,
      result,
      web3
    } = this.state;

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
                  {/*
                    <HeaderNav
                      drizzle={this.props.drizzle}
                      drizzleState={drizzleState}
                      preflightCheck={preflightCheck}/>
                  */}
                  
                    <View flex={true} center={true} column={true}>
                        <Header
                          drizzle={this.props.drizzle}
                          drizzleState={drizzleState}
                          playerProfile={playerProfile}
                          connected={connected}
                          address={address}
                          chainId={chainId}
                          killSession={this.resetApp}
                          connectSession={this.onConnect}/>
                    </View>

                  {
                    <View flex={true} center={true} column={true}>

                    <WalletBlock
                        account={account}
                        accountBalance={accountBalance}
                        accountBalanceLow={accountBalanceLow}
                        accountValidated={accountValidated}
                        connectAndValidateAccount={connectAndValidateAccount}
                      />

                    </View>
                  }


                  <PrimaryCard />


                    <Router>
                      <Home
                        default={true}
                        playerProfile={playerProfile}
                        connected={connected}
                        path="/"
                      />
                      <GameUnity
                        path="/wom"
                      />
                      <Game
                        path="/:roomId"
                      />
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


// <SLayout>
//   <Column maxWidth={1000} spanHeight>
//     <Web3ModalHeader
//       connected={connected}
//       address={address}
//       chainId={chainId}
//       killSession={this.resetApp}
//     />
//     <SContent>
//       {fetching ? (
//         <Column center>
//           <SContainer>
//             <Loader />
//           </SContainer>
//         </Column>
//       ) : !!assets && !!assets.length ? (
//         <SBalances>
//           <h3>Actions</h3>
//           <Column center>
//             <STestButtonContainer>
//               <STestButton left onClick={this.testSendTransaction}>
//                 {ETH_SEND_TRANSACTION}
//               </STestButton>
//
//               <STestButton left onClick={this.testSignMessage}>
//                 {ETH_SIGN}
//               </STestButton>
//
//               <STestButton left onClick={this.testSignPersonalMessage}>
//                 {PERSONAL_SIGN}
//               </STestButton>
//               <STestButton
//                 left
//                 onClick={() => this.testContractCall(DAI_BALANCE_OF)}
//               >
//                 {DAI_BALANCE_OF}
//               </STestButton>
//
//               <STestButton
//                 left
//                 onClick={() => this.testContractCall(DAI_TRANSFER)}
//               >
//                 {DAI_TRANSFER}
//               </STestButton>
//
//               <STestButton left onClick={this.testOpenBox}>
//                 {BOX_GET_PROFILE}
//               </STestButton>
//             </STestButtonContainer>
//           </Column>
//           <h3>Balances</h3>
//           <AccountAssets chainId={chainId} assets={assets} />{" "}
//         </SBalances>
//       ) : (
//         <SLanding center>
//           <h3>{`Test Web3Modal`}</h3>
//           <ConnectButton onClick={this.onConnect} />
//         </SLanding>
//       )}
//     </SContent>
//   </Column>
//   <Modal show={showModal} toggleModal={this.toggleModal}>
//     {pendingRequest ? (
//       <SModalContainer>
//         <SModalTitle>{"Pending Call Request"}</SModalTitle>
//         <SContainer>
//           <Loader />
//           <SModalParagraph>
//             {"Approve or reject request using your wallet"}
//           </SModalParagraph>
//         </SContainer>
//       </SModalContainer>
//     ) : result ? (
//       <SModalContainer>
//         <SModalTitle>{"Call Request Approved"}</SModalTitle>
//         <ModalResult>{result}</ModalResult>
//       </SModalContainer>
//     ) : (
//       <SModalContainer>
//         <SModalTitle>{"Call Request Rejected"}</SModalTitle>
//       </SModalContainer>
//     )}
//   </Modal>
// </SLayout>
