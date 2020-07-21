// Drizzle contracts
import CryptoPizza from "./contracts/CryptoPizza.json";

const drizzleOptions = {
  contracts: [CryptoPizza],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:7545"
    }
  }
};

export default drizzleOptions;
