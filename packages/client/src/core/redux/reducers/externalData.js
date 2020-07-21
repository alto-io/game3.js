import {
  RIMBLE_RECEIVED_ETH_PRICE,
  RIMBLE_RECEIVE_TX_TIME_ESTIMATE,
  RIMBLE_RECEIVE_AVG_TX_GAS_AND_TIME,
  RIMBLE_RECEIVE_ESTIMATE_TX_GAS
} from "../actionTypes";

// Initialize rimbleAlert store
const initialRimbleExternalData = {
  ethPrice: {},
  txGas: {},
  txTimeEstimate: {},
  txGasEstimate: {}
};

export default function(state = initialRimbleExternalData, action) {
  switch (action.type) {
    case RIMBLE_RECEIVED_ETH_PRICE: {
      const { quote } = action;
      return {
        ...state,
        ethPrice: {
          ...quote
        }
      };
    }
    case RIMBLE_RECEIVE_TX_TIME_ESTIMATE: {
      const { txEstimate } = action;
      return {
        ...state,
        txTimeEstimate: {
          ...txEstimate
        }
      };
    }
    case RIMBLE_RECEIVE_AVG_TX_GAS_AND_TIME: {
      const { gasStationInfo } = action;
      return {
        ...state,
        gasStationInfo: {
          ...gasStationInfo
        }
      };
    }
    case RIMBLE_RECEIVE_ESTIMATE_TX_GAS: {
      return {
        ...state,
        txGasEstimate: action.txGasEstimate
      };
    }
    default: {
      return state;
    }
  }
}
