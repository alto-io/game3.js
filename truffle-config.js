require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "packages/client/src/contracts"),
  networks: {
    develop: {
      provider() {
        return new HDWalletProvider(
          process.env.GANACHE_MNEMONIC,
          "http://localhost:7545/"
        );
      },
      host: "localhost",
      port: 7545,
      network_id: 5777,
      gas: 6721975,
      gasPrice: 1000000000
    },    
    test: {
        provider() {
            return new HDWalletProvider(
            process.env.GANACHE_MNEMONIC,
            "http://localhost:7545/"
            );
        },
        host: "localhost",
        port: 7545,
        network_id: 5777,
        gas: 6721975,
        gasPrice: 1000000000
    },    
    mainnet: {
      provider() {
        // using wallet at index 1 ----------------------------------------------------------------------------------------v
        return new HDWalletProvider(
          process.env.TESTNET_MNEMONIC,
          "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY,
          1
        );
      },
      network_id: 1
      // gas: 5561260
    },
    kovan: {
      provider() {
        // using wallet at index 1 ----------------------------------------------------------------------------------------v
        return new HDWalletProvider(
          process.env.TESTNET_MNEMONIC,
          "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY,
          1
        );
      },
      network_id: 42
      // gas: 5561260
    },
    rinkeby: {
      provider() {
        console.log(process.env);
        return new HDWalletProvider(
          process.env.TESTNET_MNEMONIC,
          "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY
        );
      },
      network_id: 4,
      // gas: 4700000,
      gasPrice: 200000000000 // 200 GWEI
    },
    ropsten: {
      provider() {
        return new HDWalletProvider(
          process.env.TESTNET_MNEMONIC,
          "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY
        );
      },
      network_id: 2
      // gas: 4700000
    },
    sokol: {
      provider() {
        return new HDWalletProvider(
          process.env.TESTNET_MNEMONIC,
          "https://sokol.poa.network"
        );
      },
      gasPrice: 1000000000,
      network_id: 77
    },
    poa: {
      provider() {
        return new HDWalletProvider(
          process.env.TESTNET_MNEMONIC,
          "https://core.poa.network"
        );
      },
      gasPrice: 1000000000,
      network_id: 99
    }
  },
  compilers: {
    solc: {
      version: "0.6.4"
    }
  }  
};
