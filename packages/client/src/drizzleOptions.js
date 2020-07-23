// Drizzle contracts
import CryptoPizza from "./contracts/CryptoPizza.json";
import Token from "./contracts/Token.json";
import Tournaments from "./contracts/Tournaments.json";

const drizzleOptions = {
  contracts: [CryptoPizza, Token, Tournaments],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:7545"
    }
  }
};

export default drizzleOptions;
