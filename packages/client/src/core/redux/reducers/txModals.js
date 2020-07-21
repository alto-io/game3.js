import {
  RIMBLE_TOGGLE_NETWORK_MODAL,
  RIMBLE_TOGGLE_TX_START_MODAL,
  RIMBLE_TOGGLE_TX_PENDING_MODAL,
  RIMBLE_TOGGLE_TX_SUCCESS_MODAL,
  RIMBLE_TOGGLE_TX_ERROR_MODAL,
  RIMBLE_TOGGLE_TX_LOW_BALANCE_MODAL,
  RIMBLE_TOGGLE_TX_ACTIVITY_MODAL,
  RIMBLE_SET_CURRENT_TX_ID,
  RIMBLE_ENABLE_BUY_BUTTON
} from "./../actionTypes";

// Set Rimble's initial UI state
const initialRimble = {
  showWrongNetworkModal: false,
  showTxStartModal: false,
  showTxPendingModal: false,
  showTxSuccessModal: false,
  showTxErrorModal: false,
  showTxLowBalanceModal: false,
  showTxActivityModal: false,
  enableBuyButton: false
};

// Rimble modal reducers
export const txModals = (state = initialRimble, action) => {
  switch (action.type) {
    case RIMBLE_TOGGLE_NETWORK_MODAL: {
      return {
        ...state,
        showWrongNetworkModal: action.payload.value
      };
    }
    case RIMBLE_TOGGLE_TX_START_MODAL: {
      return {
        ...state,
        showTxStartModal: action.payload.value
      };
    }
    case RIMBLE_TOGGLE_TX_PENDING_MODAL: {
      return {
        ...state,
        showTxStartModal: false,
        showTxPendingModal: action.payload.value
      };
    }
    case RIMBLE_TOGGLE_TX_SUCCESS_MODAL: {
      return {
        ...state,
        showTxStartModal: false,
        showTxPendingModal: false,
        showTxSuccessModal: action.payload.value
      };
    }
    case RIMBLE_TOGGLE_TX_ERROR_MODAL: {
      return {
        ...state,
        showTxStartModal: false,
        showTxPendingModal: false,
        showTxSuccessModal: false,
        showTxErrorModal: action.payload.value
      };
    }
    case RIMBLE_TOGGLE_TX_LOW_BALANCE_MODAL: {
      return {
        ...state,
        showTxLowBalanceModal: action.payload.value
      };
    }
    case RIMBLE_TOGGLE_TX_ACTIVITY_MODAL: {
      return {
        ...state,
        showTxActivityModal: action.payload.value
      };
    }
    case RIMBLE_SET_CURRENT_TX_ID: {
      return {
        ...state,
        currentTxId: {
          stackId: action.payload.value
        }
      };
    }
    case RIMBLE_ENABLE_BUY_BUTTON: {
      return {
        ...state,
        enableBuyButton: action.payload.value
      };
    }
    default:
      return state;
  }
};
