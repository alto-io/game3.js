// Drizzle contracts
//import CryptoPizza from "./contracts/CryptoPizza.json";
//import Token from "./contracts/Token.json";
import Tournaments from "./contracts/Tournaments.json";
//import Counter from './contracts/Counter.json';

const drizzleOptions = {
  //contracts: [Counter, CryptoPizza, Token, Tournaments],
  contracts: [Tournaments],
  /*
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:7545"
    }
  }
  */
};

export default drizzleOptions;
