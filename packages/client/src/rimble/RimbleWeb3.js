import React from "react";
import Web3 from "web3"; // uses latest 1.x.x version
import RimbleUtils from "@rimble/utils";
import ConnectionModalUtil from "./ConnectionModalsUtil";
import TransactionUtil from "./TransactionUtil";
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const RimbleTransactionContext = React.createContext({
  contract: {},
  account: {},
  accountBalance: {},
  accountBalanceLow: {},
  web3: {},
  web3Fallback: {},
  transactions: {},
  checkPreflight: () => {},
  initWeb3: () => {},
  initContract: () => {},
  initAccount: () => {},
  rejectAccountConnect: () => {},
  accountValidated: {},
  accountValidationPending: {},
  rejectValidation: () => {},
  validateAccount: () => {},
  connectAndValidateAccount: () => {},
  network: {
    required: {},
    current: {},
    isCorrectNetwork: null,
    checkNetwork: () => {}
  },
  validBrowser: () => {},
  modals: {
    data: {
      noWeb3BrowserModalIsOpen: {},
      noWalletModalIsOpen: {},
      connectionModalIsOpen: {},
      accountConnectionPending: {},
      userRejectedConnect: {},
      accountValidationPending: {},
      userRejectedValidation: {},
      wrongNetworkModalIsOpen: {},
      transactionConnectionModalIsOpen: {},
      lowFundsModalIsOpen: {}
    },
    methods: {
      openNoWeb3BrowserModal: () => {},
      closeNoWeb3BrowserModal: () => {},
      closeConnectionPendingModal: () => {},
      openConnectionPendingModal: () => {},
      closeUserRejectedConnectionModal: () => {},
      openUserRejectedConnectionModal: () => {},
      closeValidationPendingModal: () => {},
      openValidationPendingModal: () => {},
      closeUserRejectedValidationModal: () => {},
      openUserRejectedValidationModal: () => {},
      closeWrongNetworkModal: () => {},
      openWrongNetworkModal: () => {},
      closeTransactionConnectionModal: () => {},
      openTransactionConnectionModal: () => {},
      closeLowFundsModal: () => {},
      openLowFundsModal: () => {}
    }
  },
  transaction: {
    data: {
      transactions: {}
    },
    meta: {},
    methods: {}
  }
});

const infuraId = "b71d4cce6c0c4f2ebaecc118a35dfaf5"

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId
      }
    }
  }
})

class RimbleTransaction extends React.Component {
  static Consumer = RimbleTransactionContext.Consumer;

  web3Preflight = () => {
    // Is this browser compatible?
    if (!this.state.validBrowser) {
      console.log("Invalid browser, cancelling transaction.");
      let modals = { ...this.state.modals };
      modals.data.noWeb3BrowserModalIsOpen = true;
      this.setState({ modals });
    }

    // Is there a web3 provider?
    if (!this.state.web3) {
      console.log("No browser wallet, cancelling transaction.");
      let modals = { ...this.state.modals };
      modals.data.noWalletModalIsOpen = true;
      this.setState({ modals });
      return false;
    }

    return true;
  };

  web3ActionPreflight = () => {
    // Is this browser compatible?
    if (!this.state.validBrowser) {
      console.log("Invalid browser, cancelling transaction.");
      let modals = { ...this.state.modals };
      modals.data.noWeb3BrowserModalIsOpen = true;
      this.setState({ modals });
      return false;
    }

    // Is there a wallet?
    if (this.state.web3Fallback) {
      console.log("No browser wallet, cancelling transaction.");
      let modals = { ...this.state.modals };
      modals.data.noWalletModalIsOpen = true;
      this.setState({ modals });
      return false;
    }

    // Is it on the correct network?
    if (!this.state.network.isCorrectNetwork) {
      // wrong network modal
      this.state.modals.methods.openWrongNetworkModal();
      return false;
    }

    return true;
  };

  // Validates user's browser is web3 capable
  checkModernBrowser = async () => {
    const validBrowser = RimbleUtils.browserIsWeb3Capable();

    this.setState({
      validBrowser
    });

    return validBrowser;
  };

  // Initialize a web3 provider
  // TODO: Make async work
  initWeb3 = async () => {
    this.checkModernBrowser();

    let web3 = {};

    // Check for modern web3 provider
    if (window.ethereum) {
      console.log("Using modern web3 provider.");
      web3 = new Web3(window.ethereum);
    }
    // Legacy dapp browsers, public wallet address always exposed
    else if (window.web3) {
      console.log("Legacy web3 provider. Try updating.");
      web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      console.log("Non-Ethereum browser detected. Using Infura fallback.");

      const web3Provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/c43d74f41ea4482d8eecfa96d47a8151"
      );
      web3 = new Web3(web3Provider);

      // Set fallback property, used to show modal
      this.setState({ web3Fallback: true });
    }

    this.setState({ web3 }, () => {
      // After setting the web3 provider, check network
      this.checkNetwork();
    });

    console.log("Finished initWeb3");
  };

  initContract = async (address, abi) => {
    console.log("Init contract");

    if (!this.state.web3) {
      console.log("Awaiting web3");
      await this.initWeb3();
    }

    this.createContract(address, abi);
  };

  createContract = async (address, abi) => {
    console.log("creating contract", address, abi);
    // Create contract on initialized web3 provider with given abi and address
    try {
      const contract = new this.state.web3.eth.Contract(abi, address);
      this.setState({ contract });
    } catch (error) {
      console.log("Could not create contract.");
      window.toastProvider.addMessage("Contract creation failed.", {
        variant: "failure"
      });
    }
  };

  initAccount = async () => {
    this.openConnectionPendingModal();

    // First try EIP 1102 Connect method
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.enable().then(wallets => {
          const account = wallets[0];
          this.closeConnectionPendingModal();
          this.setState({ account });

          console.log("wallet address:", this.state.account);

          // After account is complete, get the balance
          this.getAccountBalance(account);

          // Watch for account change
          this.pollAccountUpdates();
        });
      } catch (error) {
        // User denied account access...
        console.log("User cancelled connect request. Error:", error);

        // Reject Connect
        this.rejectAccountConnect(error);
      }
    } else {
      // Revert back to directly getting wallet address
      try {
        const account = window.web3.eth.accounts[0];
        this.closeConnectionPendingModal();
        this.setState({ account });

        console.log("fallback wallet address:", this.state.account);

        // After account is complete, get the balance
        this.getAccountBalance(account);

        // Watch for account change
        // TODO: This type of wallet browser probably doesn't inject window.ethereum
        // this.pollAccountUpdates();
      } catch (error) {
        console.log("Could not get account address. Error: ", error);

        // Reject Connect
        // TODO: This needs a new modal
        this.rejectAccountConnect(error);
      }
    }
  };

  // TODO: Can this be moved/combined?
  rejectAccountConnect = error => {
    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = false;
    modals.data.userRejectedConnect = true;
    this.setState({ modals });
  };

  getAccountBalance = async account => {
    const localAccount = account ? account : this.state.account;
    if (localAccount) {
      try {
        await this.state.web3.eth
          .getBalance(localAccount)
          .then(accountBalance => {
            if (!isNaN(accountBalance)) {
              accountBalance = this.state.web3.utils.fromWei(
                accountBalance,
                "ether"
              );
              accountBalance = parseFloat(accountBalance);

              // Only update if changed
              if (accountBalance !== this.state.accountBalance) {
                this.setState({ accountBalance });
                console.log("account balance: ", accountBalance);
                this.determineAccountLowBalance();
              }
            } else {
              this.setState({ accountBalance: "--" });
              console.log("account balance FAILED", accountBalance);
            }
          });
      } catch (error) {
        console.log("Failed to get account balance." + error);
      }
    } else {
      console.log("No account on which to get balance");
      return false;
    }
  };

  determineAccountLowBalance = () => {
    // If provided a minimum from http://192.168.1.103:3000/ then use it, else default to 1
    const accountBalanceMinimum =
      typeof this.props.config !== "undefined" &&
      typeof this.props.config.accountBalanceMinimum !== "undefined"
        ? this.props.config.accountBalanceMinimum
        : 1;
    // Determine if the account balance is low
    const accountBalanceLow =
      this.state.accountBalance < accountBalanceMinimum ? true : false;

    this.setState({
      accountBalanceLow
    });

    if (
      accountBalanceLow === false &&
      this.state.modals.data.lowFundsModalIsOpen
    ) {
      this.closeLowFundsModal();

      window.toastProvider.addMessage("Received Funds!", {
        variant: "success",
        secondaryMessage: "You now have enough ETH"
      });
    }
  };

  validateAccount = async () => {
    console.log("validateAccount");
    // Get account wallet if none exist
    if (!this.state.account) {
      await this.initAccount();

      if (!this.state.account) {
        return;
      }
    }
    console.log("setting state to update UI");

    // Show blocking modal
    this.openValidationPendingModal();

    console.log("Requesting web3 personal sign");
    return window.web3.personal.sign(
      window.web3.fromUtf8(
        `To connect to OP Arcade, sign this message to prove you have access to this account. This won’t cost you any Ether.`
      ),
      this.state.account,
      (error, signature) => {
        if (error) {
          // User rejected account validation.
          console.log("Wallet account not validated. Error:", error);

          // Reject the validation
          this.rejectValidation(error);

          if (this.state.callback) {
            this.state.callback("error");
          }
        } else {
          const successMessage = "Connected!";
          console.log(successMessage, signature);
          window.toastProvider.addMessage(successMessage, {
            variant: "success",
            secondaryMessage: "Success! You can now play in tournaments 🎉"
          });

          this.closeValidationPendingModal();
          this.setState({
            accountValidated: true
          });

          if (this.state.callback) {
            this.state.callback("success");
          }
        }
      }
    );
  };

  rejectValidation = error => {
    let modals = { ...this.state.modals };
    modals.data.userRejectedValidation = true;
    modals.data.accountValidated = false;
    modals.data.accountValidationPending = false;
    this.setState({ modals });
  };

  connectAndValidateAccount = async callback => {
    if (!this.web3ActionPreflight()) {
      return;
    }

    // Check for account
    if (!this.state.account || !this.state.accountValidated) {
      // Show modal to connect account
      // this.openConnectionModal(null, callback);

      const provider = await web3Modal.connect()
      console.log(provider);
    }

    // await this.initAccount();
    // await this.validateAccount();
  };

  getRequiredNetwork = () => {
    const networkId =
      typeof this.props.config !== "undefined" &&
      typeof this.props.config.requiredNetwork !== "undefined"
        ? this.props.config.requiredNetwork
        : 1;
    let networkName = "";
    switch (networkId) {
      case 1:
        networkName = "Main";
        break;
      case 3:
        networkName = "Ropsten";
        break;
      case 4:
        networkName = "Rinkeby";
        break;
      case 42:
        networkName = "Kovan";
        break;
      default:
        networkName = "unknown";
    }

    let requiredNetwork = {
      name: networkName,
      id: networkId
    };

    let network = { ...this.state.network };
    network.required = requiredNetwork;

    this.setState({ network });
  };

  getNetworkId = async () => {
    try {
      return this.state.web3.eth.net.getId((error, networkId) => {
        let current = { ...this.state.network.current };
        current.id = networkId;
        let network = { ...this.state.network };
        network.current = current;
        this.setState({ network });
      });
    } catch (error) {
      console.log("Could not get network ID: ", error);
    }
  };

  getNetworkName = async () => {
    try {
      return this.state.web3.eth.net.getNetworkType((error, networkName) => {
        let current = { ...this.state.network.current };
        current.name = networkName;
        let network = { ...this.state.network };
        network.current = current;
        this.setState({ network });
      });
    } catch (error) {
      console.log("Could not get network Name: ", error);
    }
  };

  checkNetwork = async () => {
    this.getRequiredNetwork();
    await this.getNetworkId();
    await this.getNetworkName();

    let network = { ...this.state.network };
    network.isCorrectNetwork =
      this.state.network.current.id === this.state.network.required.id
        ? true
        : false;

    this.setState({ network });
  };

  pollAccountUpdates = () => {
    let account = this.state.account;
    let requiresUpdate = false;
    let accountInterval = setInterval(() => {
      if (
        this.state.modals.data.accountValidationPending ||
        this.state.modals.data.accountConnectionPending
      ) {
        return;
      }
      if (window.ethereum.isConnected()) {
        const updatedAccount = window.web3.eth.accounts[0];

        if (updatedAccount.toLowerCase() !== account.toLowerCase()) {
          requiresUpdate = true;
        }

        this.getAccountBalance();

        if (requiresUpdate) {
          clearInterval(accountInterval);
          let modals = { ...this.state.modals };
          modals.data.userRejectedConnect = null;

          this.setState(
            {
              modals: modals,
              account: "",
              accountValidated: null,
              transactions: []
            },
            () => {
              this.initAccount();
            }
          );
        }
      }
    }, 1000);
  };

  contractMethodSendWrapper = (contractMethod, contractParameters, sendParameters, callback) => {
    console.log("contractMethodSendWrapper Callback: ", callback);
    // Is it web3 capable?
    if (!this.web3ActionPreflight()) {
      return;
    }

    // Is a wallet connected and verified?
    if (!this.state.account || !this.state.accountValidated) {
      this.openTransactionConnectionModal(null, () => {
        console.log("Successfully connected, continuing with Tx");
        this.contractMethodSendWrapper(contractMethod, callback);
      });
      return;
    }

    // Are there a minimum amount of funds?
    if (this.state.accountBalanceLow) {
      this.openLowFundsModal(null, () => {});
      return;
    }

    // Is the contract loaded?

    // Create new tx and add to collection
    // Maybe this needs to get moved out of the wrapper?
    let transaction = this.createTransaction();
    this.addTransaction(transaction);

    // Add meta data to transaction
    transaction.method = contractMethod;
    transaction.type = "contract";
    transaction.status = "started";

    console.log("transaction: ", { ...transaction });

    // Show toast for starting transaction
    this.updateTransaction(transaction);

    const { contract, account } = this.state;

    try {
      contract.methods[contractMethod](...contractParameters)
        .send(sendParameters)
        .on("transactionHash", hash => {
          // Submitted to block and received transaction hash
          // Set properties on the current transaction
          transaction.transactionHash = hash;
          transaction.status = "pending";
          transaction.recentEvent = "transactionHash";
          this.updateTransaction(transaction);
          if (callback) {
            callback("transactionHash", transaction);
          }
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          // Update confirmation count on each subsequent confirmation that's received
          transaction.confirmationCount += 1;

          // How many confirmations should be received before informing the user
          const confidenceThreshold = 3;

          if (transaction.confirmationCount === 1) {
            // Initial confirmation receipt
            transaction.status = "confirmed";
          } else if (transaction.confirmationCount < confidenceThreshold) {
            // Not enough confirmations to match threshold
          } else if (transaction.confirmationCount === confidenceThreshold) {
            // Confirmations match threshold
            // Check the status from result since we are confident in the result
            if (receipt.status) {
              transaction.status = "success";
            } else if (!receipt.status) {
              transaction.status = "error";
            }
          } else if (transaction.confirmationCount > confidenceThreshold) {
            // Confidence threshold met
          }
          // Update transaction with receipt details
          transaction.recentEvent = "confirmation";
          this.updateTransaction(transaction);
          if (callback) {
            callback("confirmation", transaction);
          }
        })
        .on("receipt", receipt => {
          // Received receipt, met total number of confirmations
          transaction.recentEvent = "receipt";
          this.updateTransaction(transaction);
          if (callback) {
            callback("receipt", transaction);
          }
        })
        .on("error", error => {
          // Errored out
          transaction.status = "error";
          transaction.recentEvent = "error";
          this.updateTransaction(transaction);
          // TODO: should this be a custom error? What is the error here?
          // TODO: determine how to handle error messages globally
          window.toastProvider.addMessage("Value change failed", {
            secondaryMessage: "Could not change value.",
            actionHref: "",
            actionText: "",
            variant: "failure"
          });
          if (callback) {
            callback("error: " + error, transaction);
          }
        });
    } catch (error) {
      transaction.status = "error";
      this.updateTransaction(transaction);
      // TODO: should this be a custom error? What is the error here?
      // TODO: determine how to handle error messages globally
      window.toastProvider.addMessage("Value change failed", {
        secondaryMessage: "Could not change value on smart contract",
        actionHref: "",
        actionText: "",
        variant: "failure"
      });
      if (callback) {
        callback("error: " + error, error);
      }
    }
  };

  // Create tx
  createTransaction = () => {
    let transaction = {};
    transaction.created = Date.now();
    transaction.lastUpdated = Date.now();
    transaction.status = "initialized";
    transaction.confirmationCount = 0;

    return transaction;
  };

  addTransaction = transaction => {
    const transactions = { ...this.state.transactions };
    console.log("addTransaction: ", { ...transaction });
    transactions[`tx${transaction.created}`] = transaction;
    this.setState({ transactions });
  };

  // Add/update transaction in state
  updateTransaction = updatedTransaction => {
    const transactions = { ...this.state.transactions };
    const transaction = { ...updatedTransaction };
    transaction.lastUpdated = Date.now();
    transactions[`tx${updatedTransaction.created}`] = transaction;
    this.setState({ transactions });
  };

  // UTILITY
  shortenHash = hash => {
    let shortHash = hash;
    const txStart = shortHash.substr(0, 7);
    const txEnd = shortHash.substr(shortHash.length - 4);
    shortHash = txStart + "..." + txEnd;
    return shortHash;
  };

  // CONNECTION MODAL METHODS
  closeConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.connectionModalIsOpen = false;
    console.log("this.state", this.state);
    this.setState({ modals });
  };

  openConnectionModal = (e, callback) => {
    if (typeof e !== "undefined" && e !== null) {
      console.log(e);
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.connectionModalIsOpen = true;
    this.setState({ modals: modals, callback: callback });
  };

  closeConnectionPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = false;
    this.setState({ modals });
  };

  openConnectionPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = true;
    modals.data.transactionConnectionModalIsOpen = false;
    modals.data.connectionModalIsOpen = false;

    this.setState({ modals });
  };

  closeUserRejectedConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedConnect = false;
    this.setState({ modals });
  };

  openUserRejectedConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedConnect = true;
    this.setState({ modals });
  };

  closeValidationPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountValidationPending = false;
    modals.data.connectionModalIsOpen = false;
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  openValidationPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = false;
    modals.data.transactionConnectionModalIsOpen = false;
    modals.data.accountValidationPending = true;
    modals.data.userRejectedValidation = false;
    this.setState({ modals });
  };

  closeUserRejectedValidationModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedValidation = false;
    modals.data.connectionModalIsOpen = false;
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  openUserRejectedValidationModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedValidation = true;
    modals.data.connectionModalIsOpen = false;
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  closeNoWeb3BrowserModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWeb3BrowserModalIsOpen = false;
    this.setState({ modals });
  };

  openNoWeb3BrowserModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWeb3BrowserModalIsOpen = true;
    this.setState({ modals });
  };

  closeNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = false;
    this.setState({ modals });
  };

  openNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = true;
    this.setState({ modals });
  };

  closeNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = false;
    this.setState({ modals });
  };

  openNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = true;
    this.setState({ modals });
  };

  closeWrongNetworkModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.wrongNetworkModalIsOpen = false;
    this.setState({ modals });
  };

  openWrongNetworkModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.wrongNetworkModalIsOpen = true;
    this.setState({ modals });
  };

  closeTransactionConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  openTransactionConnectionModal = (e, callback) => {
    if (typeof e !== "undefined" && e !== null) {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.transactionConnectionModalIsOpen = true;
    this.setState({ modals, callback: callback });
  };

  closeLowFundsModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.lowFundsModalIsOpen = false;
    this.setState({ modals });
  };

  openLowFundsModal = (e, callback) => {
    if (typeof e !== "undefined" && e !== null) {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.lowFundsModalIsOpen = true;
    this.setState({ modals, callback: callback });
  };

  state = {
    contract: {},
    account: null,
    accountBalance: null,
    accountBalanceLow: null,
    web3: null,
    web3Fallback: null,
    transactions: {},
    checkPreflight: this.checkPreflight,
    initWeb3: this.initWeb3,
    initContract: this.initContract,
    initAccount: this.initAccount,
    contractMethodSendWrapper: this.contractMethodSendWrapper,
    rejectAccountConnect: this.rejectAccountConnect,
    accountValidated: null,
    accountValidationPending: null,
    rejectValidation: this.rejectValidation,
    validateAccount: this.validateAccount,
    connectAndValidateAccount: this.connectAndValidateAccount,
    network: {
      required: {},
      current: {},
      isCorrectNetwork: null,
      checkNetwork: this.checkNetwork
    },
    validBrowser: this.checkModernBrowser(),
    modals: {
      data: {
        noWeb3BrowserModalIsOpen: this.noWeb3BrowserModalIsOpen,
        noWalletModalIsOpen: this.noWalletModalIsOpen,
        connectionModalIsOpen: null,
        accountConnectionPending: null,
        userRejectedConnect: null,
        accountValidationPending: null,
        userRejectedValidation: null,
        wrongNetworkModalIsOpen: null,
        transactionConnectionModalIsOpen: null,
        lowFundsModalIsOpen: null
      },
      methods: {
        openNoWeb3BrowserModal: this.openNoWeb3BrowserModal,
        closeNoWeb3BrowserModal: this.closeNoWeb3BrowserModal,
        openNoWalletModal: this.openNoWalletModal,
        closeNoWalletModal: this.closeNoWalletModal,
        closeConnectionModal: this.closeConnectionModal,
        openConnectionModal: this.openConnectionModal,
        closeConnectionPendingModal: this.closeConnectionPendingModal,
        openConnectionPendingModal: this.openConnectionPendingModal,
        closeUserRejectedConnectionModal: this.closeUserRejectedConnectionModal,
        openUserRejectedConnectionModal: this.openUserRejectedConnectionModal,
        closeValidationPendingModal: this.closeValidationPendingModal,
        openValidationPendingModal: this.openValidationPendingModal,
        closeUserRejectedValidationModal: this.closeUserRejectedValidationModal,
        openUserRejectedValidationModal: this.openUserRejectedValidationModal,
        closeWrongNetworkModal: this.closeWrongNetworkModal,
        openWrongNetworkModal: this.openWrongNetworkModal,
        closeTransactionConnectionModal: this.closeTransactionConnectionModal,
        openTransactionConnectionModal: this.openTransactionConnectionModal,
        closeLowFundsModal: this.closeLowFundsModal,
        openLowFundsModal: this.openLowFundsModal
      }
    },
    transaction: {
      data: {
        transactions: null
      },
      meta: {},
      methods: {}
    }
  };

  componentDidMount() {
    // Performs a check on browser and will load a web3 provider
    // this.initWeb3();
  }

  render() {
    return (
      <div>
        <RimbleTransactionContext.Provider value={this.state} {...this.props} />
        <ConnectionModalUtil
          initAccount={this.state.initAccount}
          account={this.state.account}
          validateAccount={this.state.validateAccount}
          accountConnectionPending={this.state.accountConnectionPending}
          accountValidationPending={this.state.accountValidationPending}
          accountValidated={this.state.accountValidated}
          network={this.state.network}
          modals={this.state.modals}
        />
        <TransactionUtil transaction={this.state.transaction} />
      </div>
    );
  }
}

export default RimbleTransaction;
