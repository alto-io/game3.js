import {
  RIMBLE_ADD_PROGRESSALERT,
  RIMBLE_TOGGLE_PROGRESSALERT,
  RIMBLE_SET_PROGRESSALERT_STATUS,
  RIMBLE_SET_PROGRESSALERT_TX_HASH,
  RIMBLE_UPDATE_PROGRESSALERT_CONTENT,
  RIMBLE_UPDATE_PROGRESSALERT_TOKEN,
  RIMBLE_UPDATE_PROGRESSALERT_REMAININGTIME,
  RIMBLE_UPDATE_PROGRESSALERT_TXFEE,
  RIMBLE_FETCH_AVG_TX_GAS_AND_TIME,
  RIMBLE_CALL_ESTIMATE_TX_GAS,
  RIMBLE_CALL_TX_GAS_PRICE,
  SET_FILTER,
  RIMBLE_TOGGLE_NETWORK_MODAL,
  RIMBLE_TOGGLE_TX_START_MODAL,
  RIMBLE_TOGGLE_TX_PENDING_MODAL,
  RIMBLE_TOGGLE_TX_SUCCESS_MODAL,
  RIMBLE_TOGGLE_TX_ERROR_MODAL,
  RIMBLE_TOGGLE_TX_LOW_BALANCE_MODAL,
  RIMBLE_TOGGLE_TX_ACTIVITY_MODAL,
  RIMBLE_SET_CURRENT_TX_ID,
  RIMBLE_ENABLE_BUY_BUTTON
} from "./actionTypes";

// Progress Alert actions
let nextProgressAlertId = -1; // We want the first id to be 0 to match Drizzle
export const addProgressAlert = content => {
  return {
    type: RIMBLE_ADD_PROGRESSALERT,
    payload: {
      id: ++nextProgressAlertId,
      content
    }
  };
};

export const toggleProgressAlert = id => {
  return {
    type: RIMBLE_TOGGLE_PROGRESSALERT,
    payload: { id }
  };
};

export const setProgressAlertStatus = ({
  status,
  id,
  stackTempKey,
  txHash
}) => {
  return {
    type: RIMBLE_SET_PROGRESSALERT_STATUS,
    payload: { status, id, stackTempKey, txHash }
  };
};

export const setProgressAlertTxHash = ({ stackTempKey, txHash, id }) => {
  return {
    type: RIMBLE_SET_PROGRESSALERT_TX_HASH,
    payload: { stackTempKey, txHash, id }
  };
};

export const updateProgressAlertContent = ({
  content,
  txHash,
  id,
  stackTempKey
}) => {
  return {
    type: RIMBLE_UPDATE_PROGRESSALERT_CONTENT,
    payload: { content, txHash, id, stackTempKey }
  };
};

export const updateProgressAlertToken = ({
  token,
  txHash,
  id,
  stackTempKey
}) => {
  return {
    type: RIMBLE_UPDATE_PROGRESSALERT_TOKEN,
    payload: { token, txHash, id, stackTempKey }
  };
};

export const updateProgressAlertRemainingTime = ({
  timeEstimate,
  txHash,
  id,
  stackTempKey
}) => {
  // TODO: remove when hooked up to Saga that will fetch and then call this action
  const getRandom = () => {
    const min = 10 * 1000; // 10s
    const max = 100 * 1000; // 100s
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  timeEstimate = getRandom();

  return {
    type: RIMBLE_UPDATE_PROGRESSALERT_REMAININGTIME,
    payload: { timeEstimate, txHash, id, stackTempKey }
  };
};

export const updateProgressAlertTxFee = ({
  content,
  txHash,
  id,
  stackTempKey
}) => {
  return {
    type: RIMBLE_UPDATE_PROGRESSALERT_TXFEE,
    payload: { content, txHash, id, stackTempKey }
  };
};

export const callTxGasPrice = ({ web3, txHash }) => {
  return {
    type: RIMBLE_CALL_TX_GAS_PRICE,
    payload: { web3, txHash }
  };
};

export const fetchAvgTxGasAndTime = () => {
  return {
    type: RIMBLE_FETCH_AVG_TX_GAS_AND_TIME,
    payload: {}
  };
};

export const callEstimateTxGas = ({ contract, address }) => {
  return {
    type: RIMBLE_CALL_ESTIMATE_TX_GAS,
    payload: { contract, address }
  };
};

export const setFilter = filter => {
  return { type: SET_FILTER, payload: { filter } };
};

// Transaction modal actions
export const toggleWrongNetworkModal = value => {
  return {
    type: RIMBLE_TOGGLE_NETWORK_MODAL,
    payload: { value }
  };
};
export const toggleTxStartModal = value => {
  return {
    type: RIMBLE_TOGGLE_TX_START_MODAL,
    payload: { value }
  };
};
export const toggleTxPendingModal = value => {
  return {
    type: RIMBLE_TOGGLE_TX_PENDING_MODAL,
    payload: { value }
  };
};
export const toggleTxSuccessModal = value => {
  return {
    type: RIMBLE_TOGGLE_TX_SUCCESS_MODAL,
    payload: { value }
  };
};
export const toggleTxErrorModal = value => {
  return {
    type: RIMBLE_TOGGLE_TX_ERROR_MODAL,
    payload: { value }
  };
};
export const toggleTxLowBalanceModal = value => {
  return {
    type: RIMBLE_TOGGLE_TX_LOW_BALANCE_MODAL,
    payload: { value }
  };
};
export const toggleTxActivityModal = value => {
  return {
    type: RIMBLE_TOGGLE_TX_ACTIVITY_MODAL,
    payload: { value }
  };
};

export const setCurrentTxId = value => {
  return {
    type: RIMBLE_SET_CURRENT_TX_ID,
    payload: { value }
  };
};

export const enableBuyButton = value => {
  return {
    type: RIMBLE_ENABLE_BUY_BUTTON,
    payload: { value }
  };
};
